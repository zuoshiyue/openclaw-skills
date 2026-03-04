---
name: find-skills
description: >
  帮助用户发现和安装 Agent 技能。
  Use when: 用户问"如何做 X"、"找一个技能"、"有技能可以做 X 吗"、
  或想扩展 Agent 能力时。
  工具：npx skills (Skills CLI)
---

# Find Skills

帮助发现和安装技能的技能管理工具。

## 触发场景

用户使用以下表达时：
- "如何做 X" / "找个技能做 X"
- "有技能可以做 X 吗"
- "你能做 X 吗"（X 是专业任务）
- 想扩展 Agent 能力

## Skills CLI 命令

```bash
npx skills find [query]     # 搜索技能
npx skills add <package>    # 安装技能
npx skills check            # 检查更新
npx skills update           # 更新所有技能
```

**技能浏览：** https://skills.sh/

---

## 使用流程

### 1. 理解需求

识别：
- 领域（React、测试、部署等）
- 具体任务
- 是否常见任务（可能有现成技能）

### 2. 搜索技能

```bash
npx skills find react performance
npx skills find pr review
npx skills find changelog
```

### 3. 呈现结果

```
找到相关技能：vercel-react-best-practices
功能：React/Next.js 性能优化指南

安装命令：
npx skills add vercel-labs/agent-skills@vercel-react-best-practices

详情：https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### 4. 安装技能

```bash
npx skills add <owner/repo@skill> -g -y
```

---

## 常见技能分类

| 分类 | 搜索关键词 |
|------|-----------|
| Web 开发 | react, nextjs, typescript, tailwind |
| 测试 | testing, jest, playwright, e2e |
| DevOps | deploy, docker, kubernetes, ci-cd |
| 文档 | docs, readme, changelog |
| 代码质量 | review, lint, refactor |
| 设计 | ui, ux, design-system |

---

## 搜索技巧

1. **具体关键词** — "react testing" 优于 "testing"
2. **尝试同义词** — "deploy" / "deployment" / "ci-cd"
3. **查看热门源** — `vercel-labs/agent-skills`

---

## 未找到技能时

```
未找到 "xyz" 相关技能。

我可以直接帮你完成这个任务！

如果想重复使用，可以创建自己的技能：
npx skills init my-xyz-skill
```
