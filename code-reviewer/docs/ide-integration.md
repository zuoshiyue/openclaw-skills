# IDE 集成指南

> 在编辑器中实时获得代码规范反馈

---

## 🖥️ VS Code

### 方案 1：使用 ESLint/P3C 插件

#### Java (Alibaba P3C)

1. 安装插件：`Alibaba Java Code Guidelines`
2. 配置 `.p3c.properties`:

```properties
# 启用规则
p3c.rule.CleanCode.enabled=true
p3c.rule.SOLID.enabled=true

# 自定义规则严重性
p3c.rule.CC-VAR-003.severity=error
p3c.rule.CC-FUNC-001.severity=warning
```

#### JavaScript (ESLint + Airbnb)

1. 安装插件：`ESLint`
2. 配置 `.eslintrc.js`:

```javascript
module.exports = {
  extends: [
    'airbnb-base',
    'plugin:clean-code/recommended'
  ],
  plugins: ['clean-code'],
  rules: {
    // Clean Code 规则
    'clean-code/naming-convention': 'error',
    'clean-code/function-max-lines': ['warn', 50],
    'clean-code/no-magic-numbers': 'error',
    
    // Airbnb 规则覆盖
    'no-console': 'warn',
    'max-params': ['error', 3]
  }
};
```

### 方案 2：自定义 Code Runner

创建 `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Code Review",
      "type": "shell",
      "command": "node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs ${file} --verbose",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": {
        "owner": "code-reviewer",
        "fileLocation": ["relative", "${workspaceFolder}"],
        "pattern": {
          "regexp": "^\\[(\\w+-\\d+)\\] 第 (\\d+) 行",
          "code": 1,
          "line": 2,
          "message": "^(.*)$"
        }
      }
    }
  ]
}
```

创建 `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+r",
    "command": "workbench.action.tasks.runTask",
    "args": "Code Review"
  }
]
```

### 方案 3：保存时自动检查

创建 `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.run": "onSave",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "code-reviewer.autoCheck": true,
  "code-reviewer.checkOnSave": true,
  "code-reviewer.rules": {
    "CC-VAR-003": "error",
    "CC-FUNC-001": "warning"
  }
}
```

---

## 🅰️ IntelliJ IDEA

### Java 项目

1. **安装插件**
   - `Alibaba Java Code Guidelines` (P3C 官方)
   - `SonarLint` (额外检查)
   - `CheckStyle-IDEA`

2. **配置 P3C**
   
   `Settings → Other Settings → Alibaba Java Code Guidelines`:
   ```
   ✓ Enable real-time detection
   ✓ Highlight issues in editor
   ✓ Show severity level
   ```

3. **导入自定义规则**
   
   `Settings → Editor → Inspections → Import Profile`:
   ```xml
   <!-- code-reviewer-intellij.xml -->
   <profile version="1.0">
     <inspection_tool class="CleanCodeNaming" enabled="true" level="ERROR" />
     <inspection_tool class="CleanCodeFunctionLength" enabled="true" level="WARNING" />
     <inspection_tool class="SOLIDSingleResponsibility" enabled="true" level="WEAK WARNING" />
   </profile>
   ```

### 配置保存时检查

`Settings → Tools → Actions on Save`:
```
✓ Run code inspection
✓ Optimize imports
✓ Reformat code
```

### 配置 Live Templates

`Settings → Editor → Live Templates`:

```java
// 模板：clean-method
template: cleanmethod
description: Clean Code 方法模板

public $RETURN_TYPE$ $METHOD_NAME$($PARAMS$) {
    // TODO: 实现单一职责
    $END$
}

variables:
  RETURN_TYPE: 表达式类型
  METHOD_NAME: 动词 + 名词
  PARAMS: 不超过 3 个
```

---

## 🐍 PyCharm

### 安装插件

1. `Pylint` - Python 代码检查
2. `Black` - 代码格式化
3. `isort` - 导入排序

### 配置 Pylint

创建 `.pylintrc`:

```ini
[MESSAGES CONTROL]
enable=clean-code,solid-principles
disable=C0114,C0115,C0116  # 禁用某些文档检查

[FORMAT]
max-line-length=120
max-args=3
max-locals=15
max-returns=1
max-branches=6
max-statements=50

[DESIGN]
max-attributes=7
max-public-methods=20
```

### 配置保存时检查

`Settings → Tools → Actions on Save`:
```
✓ Run inspections
✓ Run code cleanup
```

---

## 🔧 自定义审查插件

### VS Code 插件开发

创建 `package.json`:

```json
{
  "name": "code-reviewer-vscode",
  "displayName": "Code Reviewer",
  "version": "1.0.0",
  "engines": {
    "vscode": "^1.75.0"
  },
  "activationEvents": ["onLanguage:java", "onLanguage:javascript"],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "codeReviewer.run",
        "title": "运行代码审查"
      }
    ],
    "keybindings": [
      {
        "command": "codeReviewer.run",
        "key": "ctrl+shift+r",
        "when": "editorTextFocus"
      }
    ]
  }
}
```

创建 `extension.js`:

```javascript
const vscode = require('vscode');
const { exec } = require('child_process');

function activate(context) {
  let disposable = vscode.commands.registerCommand('codeReviewer.run', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;
    
    const filePath = editor.document.fileName;
    const outputChannel = vscode.window.createOutputChannel('Code Reviewer');
    
    outputChannel.show();
    outputChannel.appendLine(`🔍 正在审查：${filePath}`);
    
    exec(`node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs ${filePath}`, 
      (error, stdout, stderr) => {
        if (error) {
          outputChannel.appendLine(`❌ 错误：${error.message}`);
          return;
        }
        outputChannel.appendLine(stdout);
        
        // 显示问题面板
        const diagnostics = vscode.languages.createDiagnosticCollection('code-reviewer');
        // 解析输出并创建 diagnostic
      });
  });
  
  context.subscriptions.push(disposable);
}

module.exports = { activate };
```

---

## 📊 实时反馈配置

### 问题提示样式

```json
{
  "workbench.colorCustomizations": {
    "editorWarning.foreground": "#ff9800",
    "editorError.foreground": "#f44336",
    "editorInfo.foreground": "#2196f3"
  },
  "editor.lightbulb.enabled": true,
  "editor.codeLens": true
}
```

### 快速修复建议

```javascript
// VS Code Code Action Provider
vscode.languages.registerCodeActionsProvider(
  { scheme: 'file', language: 'java' },
  {
    provideCodeActions(document, range, context) {
      const actions = [];
      
      // 检测到魔法数字
      if (diagnostic.code === 'CC-VAR-003') {
        const action = new vscode.CodeAction(
          '提取为常量',
          vscode.CodeActionKind.QuickFix
        );
        action.edit = new vscode.WorkspaceEdit();
        // 创建提取常量的编辑
        actions.push(action);
      }
      
      return actions;
    }
  }
);
```

---

## 🎯 最佳实践

### 1. 分层检查

```
编辑器实时检查 → 快速反馈（命名、格式）
     ↓
保存时检查 → 中等检查（函数长度、嵌套）
     ↓
提交前检查 → 完整检查（所有规则）
     ↓
CI/CD 检查 → 质量门禁
```

### 2. 性能优化

```json
{
  "code-reviewer.debounce": 500,  // 防抖 500ms
  "code-reviewer.maxFileSize": 1000,  // 最大文件行数
  "code-reviewer.exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**"
  ]
}
```

### 3. 团队同步

```json
// .vscode/settings.json (提交到版本控制)
{
  "code-reviewer.config": "../.code-reviewer.json",
  "code-reviewer.sharedRules": true
}
```

---

## 📋 检查清单

### VS Code
- [ ] 安装必要插件
- [ ] 配置 ESLint/P3C
- [ ] 设置保存时检查
- [ ] 配置快捷键
- [ ] 测试实时反馈

### IntelliJ IDEA
- [ ] 安装 P3C 插件
- [ ] 导入检查配置
- [ ] 配置 Live Templates
- [ ] 设置保存时检查
- [ ] 配置代码格式化

### PyCharm
- [ ] 安装 Pylint
- [ ] 配置 .pylintrc
- [ ] 设置保存时检查
- [ ] 配置代码格式化

---

*最后更新：2026-03-05*
