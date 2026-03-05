# Code Standards - 代码规范与审查

🤖 基于经典编程书籍和业界最佳实践的**代码开发规范 + 代码审查**工具

## 🎯 双重定位

| 功能 | 用途 | 使用时机 |
|------|------|---------|
| 📖 **开发规范** | 指导日常开发，预防问题 | 写代码时参考 |
| 🔍 **代码审查** | 检查已有代码，发现问题 | 提交前/合并前检查 |

> **预防胜于治疗** —— 写好代码比审查代码更重要

## 📖 知识来源

本技能学习了以下经典编程书籍和规范：

| 书籍/规范 | 来源 | Stars |
|----------|------|-------|
| 📘 **Clean Code** (代码整洁之道) | Robert C. Martin | - |
| 📗 **编写可读代码的艺术** | Dustin Boswell | - |
| 📙 **重构：改善既有代码的设计** | Martin Fowler | - |
| 📕 **代码大全** | Steve McConnell | - |
| 📔 **Effective Java** | Joshua Bloch | - |
| 📜 **阿里巴巴 Java 开发手册** | [Alibaba P3C](https://github.com/alibaba/p3c) | 30.8k |
| 📚 **Clean Code JavaScript** | [ryanmcdermott/clean-code-javascript](https://github.com/ryanmcdermott/clean-code-javascript) | 94.3k |
| 📖 **Airbnb JavaScript Style Guide** | [airbnb/javascript](https://github.com/airbnb/javascript) | 138k |

## 🎯 核心能力

### 1. Clean Code 原则检查
- ✅ 变量命名：有意义、可发音、避免心智映射
- ✅ 函数设计：单一职责、参数不超过 3 个、无副作用
- ✅ 代码结构：避免重复、消除死代码、合理抽象
- ✅ 注释规范：解释为什么而不是做什么

### 2. SOLID 原则
- **S** - Single Responsibility Principle（单一职责）
- **O** - Open/Closed Principle（开闭原则）
- **L** - Liskov Substitution Principle（里氏替换）
- **I** - Interface Segregation Principle（接口隔离）
- **D** - Dependency Inversion Principle（依赖倒置）

### 3. 代码异味（Code Smells）检测
基于 Martin Fowler 的《重构》书籍，检测 24 种常见代码异味：
- 🚨 Bloaters: Long Method, Large Class, Long Parameter List
- 🚨 Object-Orientation Abusers: Switch Statements
- 🚨 Change Preventers: Divergent Change, Shotgun Surgery
- 🚨 Dispensables: Duplicate Code, Dead Code, Commented Code
- 🚨 Couplers: Feature Envy, Inappropriate Intimacy, Data Class

### 4. 阿里巴巴 Java 规范（P3C 规则）
- ✅ 49 条 PMD 实现规则
- ✅ 强制/推荐/参考三级规范
- ✅ 涵盖命名、注释、格式、设计模式、并发处理等

### 5. Python 规范（PEP 8 + Clean Code）
- ✅ 30+ 条 Python 特定规则
- ✅ 涵盖 PEP 8、安全性、Pythonic 风格
- ✅ 包括类型提示、异常处理、并发安全

### 6. Go 规范（Effective Go）
- ✅ 40+ 条 Go 特定规则
- ✅ 涵盖错误处理、并发、defer 使用
- ✅ 包括命名、文档、性能最佳实践

## 📋 审查维度

| 维度 | 检查项 | 权重 |
|------|--------|------|
| **可读性** | 命名清晰、结构简洁、注释恰当 | 30% |
| **可维护性** | 单一职责、低耦合、易扩展 | 25% |
| **可靠性** | 异常处理、边界检查、空值处理 | 20% |
| **性能** | 避免重复计算、合理数据结构 | 15% |
| **安全性** | 输入验证、敏感信息保护 | 10% |

## 📖 开发规范使用

### 日常开发参考

1. **写代码前** - 阅读 [开发规范手册](docs/development-guide.md)
2. **提交前** - 使用检查清单自检
3. **遇到问题** - 查阅正反面示例 [examples.md](docs/examples.md)

### 快速查阅

```bash
# 打开开发规范
cat ~/.openclaw/workspace/skills/code-reviewer/docs/development-guide.md

# 查看检查清单
cat ~/.openclaw/workspace/skills/code-reviewer/docs/checklist.md

# 查看正反面示例
cat ~/.openclaw/workspace/skills/code-reviewer/docs/examples.md
```

---

## 🔧 代码审查使用

### 基础审查
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径>
```

### 指定语言
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --lang java
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --lang python
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --lang go
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --lang javascript
```

### 详细模式
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --verbose
```

### 生成报告
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --report
```

### CI/CD 集成
```bash
# 返回非零退出码表示发现问题
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs ./src --ci --recursive
```

## 📊 输出示例

```
============================================================
📋 代码审查报告
============================================================

📁 文件：UserService.java
🌐 语言：JAVA
📏 行数：328
📊 评分：75/100 ⭐⭐⭐⭐

📈 统计:
   ❌ 错误：3
   ⚠️  警告：5
   ℹ️  提示：2

============================================================
❌ 严重问题
============================================================

1. [CC-VAR-003] 第 23 行
   发现魔法数字：86400000
   💡 建议：将 86400000 定义为具名常量，如 const MILLISECONDS_PER_DAY = 86400000;

2. [ALI-P3C-017] 第 1 行
   覆写了 equals 方法但没有覆写 hashCode
   💡 建议：同时覆写 equals 和 hashCode 方法

3. [SMELL-004] 第 156 行
   嵌套过深 (深度：5)
   💡 建议：使用提前返回、提取函数等方式减少嵌套

============================================================
⚠️  需要改进
============================================================

1. [CC-FUNC-001] 第 89 行
   函数参数过多 (5 个参数)
   💡 建议：封装为对象参数

...

============================================================
📝 总体建议
============================================================

👍 代码质量良好，建议修复上述问题。

============================================================
```

## 📁 文件结构

```
code-reviewer/
├── SKILL.md                      # 技能说明文档
├── README.md                     # 本文件
├── scripts/
│   ├── review.mjs               # 主审查脚本
│   └── utils.mjs                # 工具函数
├── rules/
│   ├── clean-code.json          # Clean Code 规则
│   ├── solid.json               # SOLID 原则
│   ├── alibaba-java.json        # 阿里巴巴 Java 规范
│   └── code-smells.json         # 代码异味规则
└── docs/
    ├── checklist.md             # 审查检查清单
    └── examples.md              # 正反面示例
```

## 🎓 学习资源

### 在线文档
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript) - 94k stars
- [阿里巴巴 P3C](https://github.com/alibaba/p3c) - 30k stars
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) - 138k stars
- [Refactoring Guru](https://refactoring.guru/) - 重构和设计模式

### 推荐书籍
- 《Clean Code》- Robert C. Martin
- 《重构：改善既有代码的设计》- Martin Fowler
- 《代码大全》- Steve McConnell
- 《Effective Java》- Joshua Bloch

## ⚠️ 注意事项

1. **本工具提供建议，最终决策权在开发者**
2. **规则可根据团队规范定制**
3. **不要过度优化，平衡可读性和性能**
4. **代码审查是学习过程，不是批评**

## 🚀 扩展计划

- [ ] 支持更多语言（Python、Go、Rust）
- [ ] 集成 AST 解析提高准确性
- [ ] 支持自定义规则配置
- [ ] 生成可视化报告
- [ ] IDE 插件集成

## 📄 License

MIT License

---

*Created: 2026-03-05*  
*Based on: Clean Code, Refactoring, SOLID Principles, Alibaba P3C*
