# CI/CD 集成指南

> 将代码规范检查集成到自动化流程中

---

## 🚀 GitHub Actions

### 基础配置

创建 `.github/workflows/code-review.yml`:

```yaml
name: Code Review

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  code-review:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Code Reviewer
        run: |
          npm install -g @openclaw/code-reviewer
      
      - name: Run Code Review
        run: |
          code-reviewer ./src --ci --report
      
      - name: Upload Review Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: code-review-report
          path: review-report.md
```

### 高级配置（多语言）

```yaml
name: Code Quality

on:
  pull_request:
    branches: [main]

jobs:
  java-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Java Code Review
        run: |
          code-reviewer ./src/main/java --lang java --ci

  js-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: JavaScript Code Review
        run: |
          code-reviewer ./src --lang javascript --ci

  python-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Python Code Review
        run: |
          code-reviewer ./src --lang python --ci
```

---

## 🔄 GitLab CI

### `.gitlab-ci.yml`

```yaml
stages:
  - review
  - test
  - build

code-review:
  stage: review
  image: node:18
  script:
    - npm install -g @openclaw/code-reviewer
    - code-reviewer ./src --ci --report
  artifacts:
    reports:
      code_review: review-report.md
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

---

## 📦 Jenkins Pipeline

### `Jenkinsfile`

```groovy
pipeline {
    agent any
    
    stages {
        stage('Code Review') {
            steps {
                sh '''
                    npm install -g @openclaw/code-reviewer
                    code-reviewer ./src --ci --report
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'review-report.md'
                }
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
    
    post {
        failure {
            echo '代码审查失败！请查看审查报告。'
        }
    }
}
```

---

## 🔧 Git Hooks (提交前检查)

### 使用 Husky (JavaScript)

```bash
# 安装 Husky
npm install husky --save-dev
npx husky install

# 添加 pre-commit hook
npx husky add .husky/pre-commit "npx code-reviewer --staged --ci"
```

### 使用 pre-commit (Python)

创建 `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: code-reviewer
        name: Code Reviewer
        entry: code-reviewer
        language: node
        additional_dependencies: ['@openclaw/code-reviewer']
        types: [file]
        files: \.(java|js|ts|py)$
```

### 自定义 Git Hook

创建 `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "🔍 运行代码审查..."

# 获取变更文件
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(java|js|ts)$')

if [ -z "$FILES" ]; then
    echo "✅ 没有需要审查的代码"
    exit 0
fi

# 审查变更文件
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs $FILES --ci

if [ $? -ne 0 ]; then
    echo "❌ 代码审查失败！请修复问题后重新提交。"
    exit 1
fi

echo "✅ 代码审查通过"
exit 0
```

---

## 📊 质量门禁配置

### GitHub PR 检查

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate

on:
  pull_request:
    branches: [main]

jobs:
  quality-gate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Code Review
        id: review
        run: |
          code-reviewer ./src --ci --json > review-result.json
      
      - name: Check Quality Gate
        run: |
          ERROR_COUNT=$(cat review-result.json | jq '.issues | map(select(.severity == "error")) | length')
          WARNING_COUNT=$(cat review-result.json | jq '.issues | map(select(.severity == "warning")) | length')
          
          echo "错误数：$ERROR_COUNT"
          echo "警告数：$WARNING_COUNT"
          
          if [ "$ERROR_COUNT" -gt 0 ]; then
            echo "❌ 存在严重错误，质量门禁未通过"
            exit 1
          fi
          
          if [ "$WARNING_COUNT" -gt 10 ]; then
            echo "❌ 警告过多，质量门禁未通过"
            exit 1
          fi
          
          echo "✅ 质量门禁通过"
```

---

## 📈 质量趋势追踪

### 生成质量报告

```bash
#!/bin/bash

# 生成质量趋势报告
code-reviewer ./src --report --json > review-$(date +%Y%m%d).json

# 提取关键指标
ERROR_COUNT=$(cat review-$(date +%Y%m%d).json | jq '.issues | map(select(.severity == "error")) | length')
SCORE=$(cat review-$(date +%Y%m%d).json | jq '.score')

# 记录到趋势文件
echo "$(date +%Y-%m-%d),$ERROR_COUNT,$SCORE" >> quality-trend.csv
```

### GitHub Actions 定时报告

```yaml
name: Weekly Quality Report

on:
  schedule:
    - cron: '0 9 * * 1'  # 每周一上午 9 点

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Generate Report
        run: |
          code-reviewer ./src --report > weekly-report.md
      
      - name: Create Issue
        uses: peter-evans/create-issue-from-file@v4
        with:
          title: 每周代码质量报告 - ${{ github.event.repository.name }}
          content-filepath: weekly-report.md
          labels: quality-report
```

---

## 🔔 通知集成

### 飞书通知

```yaml
- name: Notify Feishu
  if: failure()
  run: |
    curl -X POST -H "Content-Type: application/json" \
      -d '{
        "msg_type": "interactive",
        "card": {
          "config": {
            "wide_screen_mode": true
          },
          "header": {
            "template": "red",
            "title": {
              "content": "❌ 代码审查失败",
              "tag": "plain_text"
            }
          },
          "elements": [
            {
              "tag": "div",
              "text": {
                "content": "请查看审查报告并修复问题",
                "tag": "lark_md"
              }
            }
          ]
        }
      }' \
      ${{ secrets.FEISHU_WEBHOOK }}
```

### Slack 通知

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: '❌ 代码审查失败',
        attachments: [{
          color: 'danger',
          text: '请查看审查报告并修复问题'
        }]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📋 最佳实践

### 1. 渐进式采用

```yaml
# 第一阶段：只报告，不阻断
- name: Code Review (Report Only)
  run: code-reviewer ./src --report

# 第二阶段：只阻断严重错误
- name: Code Review (Errors Only)
  run: code-reviewer ./src --ci --severity error

# 第三阶段：完整检查
- name: Code Review (Full)
  run: code-reviewer ./src --ci
```

### 2. 分支差异化

```yaml
jobs:
  review:
    steps:
      # main 分支：严格检查
      - name: Review Main
        if: github.ref == 'refs/heads/main'
        run: code-reviewer ./src --ci --strict
      
      # 特性分支：宽松检查
      - name: Review Feature
        if: startsWith(github.ref, 'refs/heads/feature/')
        run: code-reviewer ./src --ci --lenient
```

### 3. 文件类型差异化

```yaml
- name: Review Critical Files
  run: |
    code-reviewer ./src/service --ci  # 服务层严格检查
    code-reviewer ./src/model --ci    # 模型层严格检查

- name: Review Test Files
  run: |
    code-reviewer ./test --ci --lenient  # 测试文件宽松检查
```

---

## 🎯 质量指标

### 建议的门禁标准

| 指标 | 优秀 | 良好 | 需改进 |
|------|------|------|--------|
| 错误数 | 0 | 0 | >0 |
| 警告数 | <5 | <20 | >20 |
| 代码评分 | >90 | >70 | <70 |
| 重复率 | <5% | <10% | >10% |
| 测试覆盖率 | >80% | >60% | <60% |

---

*最后更新：2026-03-05*
