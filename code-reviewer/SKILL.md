# Code Standards - 代码规范与审查

## 📖 技能描述

**双重定位：**
- 📖 **开发规范** - 指导日常开发，预防问题
- 🔍 **代码审查** - 检查已有代码，发现问题

> **预防胜于治疗** —— 写好代码比审查代码更重要

**知识来源：**
- 📘 Clean Code（代码整洁之道）- Robert C. Martin
- 📗 编写可读代码的艺术 - Dustin Boswell
- 📙 重构：改善既有代码的设计 - Martin Fowler
- 📕 代码大全 - Steve McConnell
- 📔 Effective Java - Joshua Bloch
- 📜 阿里巴巴 Java 开发手册（黄山版）

## 🎯 核心能力

### 📖 开发规范指导
- ✅ 命名规范：变量、函数、类、常量命名规则
- ✅ 函数设计：单一职责、参数限制、长度控制
- ✅ 代码结构：减少嵌套、消除重复、合理抽象
- ✅ 注释规范：解释为什么而非做什么
- ✅ 异常处理：捕获具体异常、记录足够信息
- ✅ SOLID 原则：5 大面向对象设计原则

### 🔍 代码审查检查
- **变量命名**：有意义、可发音、避免心智映射
- **函数设计**：单一职责、参数不超过 3 个、无副作用
- **代码结构**：避免重复、消除死代码、合理抽象
- **注释规范**：注释应该解释为什么而不是做什么

### 2. SOLID 原则
- **S** - Single Responsibility Principle（单一职责）
- **O** - Open/Closed Principle（开闭原则）
- **L** - Liskov Substitution Principle（里氏替换）
- **I** - Interface Segregation Principle（接口隔离）
- **D** - Dependency Inversion Principle（依赖倒置）

### 3. 代码异味（Code Smells）检测
- 过长的函数/类
- 过大的类
- 过多的参数
- 重复代码
- 过度耦合
- 不恰当的命名
- 魔法数字
- 过深的嵌套

### 4. 阿里巴巴 Java 规范（P3C 规则）
- 49 条 PMD 实现规则
- 强制/推荐/参考三级规范
- 涵盖命名、注释、格式、设计模式等

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
2. **提交前** - 使用 [检查清单](docs/checklist.md) 自检
3. **遇到问题** - 查阅 [正反面示例](docs/examples.md)
4. **快速查阅** - 打印 [快速参考卡片](docs/quick-reference.md) 贴在显示器旁

### 团队规范定制

1. 复制 `rules/` 目录下的规则文件
2. 根据团队习惯修改规则
3. 更新 `docs/development-guide.md` 添加团队特定规范

---

## 🔧 代码审查使用

### 基础审查
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径>
```

### 指定语言
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --lang java
```

### 详细模式
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --verbose
```

### 生成报告
```bash
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs <文件路径> --report
```

## 📊 输出格式

```markdown
## 代码审查报告

**文件:** xxx.java
**语言:** Java
**审查时间:** 2026-03-05 15:00

### 总体评分：85/100 ⭐⭐⭐⭐

### ✅ 优点
- 命名清晰，符合驼峰规范
- 函数职责单一，平均长度合理

### ⚠️ 需要改进
1. **[严重]** 第 23 行：发现魔法数字 86400000，应定义为常量
2. **[中等]** 第 45 行：函数参数过多（5 个），建议封装为对象
3. **[轻微]** 第 78 行：缺少 JavaDoc 注释

### 📈 改进建议
- 提取常量：MILLISECONDS_PER_DAY = 86400000
- 使用 Builder 模式封装多参数
- 补充公共方法的 JavaDoc
```

## 📁 文件结构

```
code-reviewer/
├── SKILL.md                      # 技能说明
├── README.md                     # 使用文档
├── scripts/
│   └── review.mjs               # 主审查脚本
├── rules/
│   ├── clean-code.json          # Clean Code 规则 (23 条)
│   ├── solid.json               # SOLID 原则 (5 大原则)
│   ├── alibaba-java.json        # 阿里巴巴 Java 规范 (35+ 条)
│   └── code-smells.json         # 代码异味 (24 种)
└── docs/
    ├── development-guide.md     # 📖 开发规范手册
    ├── checklist.md             # ✅ 审查检查清单
    ├── examples.md              # 💡 正反面示例
    └── quick-reference.md       # 📋 快速参考卡片
```

## 🚀 快速开始

1. **审查单个文件**
   ```bash
   node scripts/review.mjs ./src/UserService.java
   ```

2. **审查整个目录**
   ```bash
   node scripts/review.mjs ./src --recursive
   ```

3. **CI/CD 集成**
   ```bash
   # 返回非零退出码表示发现问题
   node scripts/review.mjs ./src --ci
   ```

## 📝 规则配置

规则文件使用 JSON 格式，支持自定义：

```json
{
  "ruleId": "CC-VAR-001",
  "category": "Clean Code",
  "severity": "warning",
  "name": "使用有意义的变量名",
  "description": "变量名应该清晰表达其用途",
  "pattern": "/^[a-z]{1,2}$/",
  "suggestion": "使用 descriptiveName 而非 x, tmp 等"
}
```

## 🎓 学习资源

- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript) - 94k stars
- [阿里巴巴 P3C](https://github.com/alibaba/p3c) - 30k stars
- [Refactoring Guru](https://refactoring.guru/) - 重构和设计模式

## ⚠️ 注意事项

1. 本工具提供建议，最终决策权在开发者
2. 规则可根据团队规范定制
3. 不要过度优化，平衡可读性和性能
4. 代码审查是学习过程，不是批评

## 📄 License

MIT License
