# Code Standards - 文档导航

> 📚 快速找到你需要的文档

---

## 🚀 快速开始

### 我是新手，从哪开始？

1. **首先阅读** → [快速参考卡片](quick-reference.md) (5 分钟)
2. **然后学习** → [开发规范手册](development-guide.md) (30 分钟)
3. **实践使用** → [审查工具使用](../README.md#代码审查使用)

---

## 📖 按场景查找

### 场景 1：我要写新代码

| 文档 | 用途 | 时间 |
|------|------|------|
| [快速参考卡片](quick-reference.md) | 速查命名、函数规范 | 2 分钟 |
| [开发规范手册](development-guide.md) | 深入学习最佳实践 | 30 分钟 |
| [正反面示例](examples.md) | 对照示例写代码 | 随时查阅 |

### 场景 2：我要提交代码

| 文档 | 用途 | 时间 |
|------|------|------|
| [检查清单](checklist.md) | 提交前自检 | 5 分钟 |
| [审查工具](../README.md) | 自动检查代码 | 1 分钟 |

### 场景 3：我要审查他人代码

| 文档 | 用途 | 时间 |
|------|------|------|
| [检查清单](checklist.md) | 人工审查清单 | 10 分钟 |
| [审查工具](../README.md) | 自动化审查 | 1 分钟 |
| [正反面示例](examples.md) | 提供改进建议 | 参考用 |

### 场景 4：我要集成到团队流程

| 文档 | 用途 | 时间 |
|------|------|------|
| [CI/CD 集成指南](ci-cd-integration.md) | GitHub/GitLab/Jenkins | 30 分钟 |
| [IDE 集成指南](ide-integration.md) | VSCode/IDEA/PyCharm | 20 分钟 |
| [团队配置模板](../config/team-config.template.json) | 定制团队规范 | 15 分钟 |

---

## 📚 按主题查找

### 命名规范

- [快速参考 - 命名规范](quick-reference.md#命名规范)
- [开发规范 - 命名规范](development-guide.md#第一部分命名规范)
- [Clean Code 规则](rules/clean-code.json) - VAR 章节

### 函数设计

- [快速参考 - 函数设计](quick-reference.md#函数设计)
- [开发规范 - 函数设计](development-guide.md#第二部分函数设计)
- [Clean Code 规则](rules/clean-code.json) - FUNC 章节

### 代码结构

- [开发规范 - 代码结构](development-guide.md#第三部分代码结构)
- [代码异味规则](rules/code-smells.json)
- [正反面示例 - 代码结构](examples.md#6-重复代码)

### SOLID 原则

- [开发规范 - SOLID 原则](development-guide.md#第六部分 solid-原则)
- [SOLID 规则详解](rules/solid.json)
- [正反面示例 - SOLID](examples.md#13-solid-原则示例)

### 异常处理

- [开发规范 - 异常处理](development-guide.md#第五部分异常处理)
- [正反面示例 - 异常处理](examples.md#12-异常处理)

---

## 🛠️ 工具使用

### 审查工具

| 文档 | 内容 |
|------|------|
| [README.md](../README.md) | 完整使用说明 |
| [SKILL.md](../SKILL.md) | 技能详细说明 |

### 规则配置

| 文件 | 内容 |
|------|------|
| [clean-code.json](rules/clean-code.json) | Clean Code 23 条规则 |
| [solid.json](rules/solid.json) | SOLID 5 大原则 |
| [alibaba-java.json](rules/alibaba-java.json) | 阿里巴巴 Java 规范 |
| [code-smells.json](rules/code-smells.json) | 24 种代码异味 |
| [team-config.template.json](config/team-config.template.json) | 团队配置模板 |

---

## 🎓 学习路径

### 初级开发者

```
第 1 天：阅读快速参考卡片 (10 分钟)
第 2 天：学习命名规范 (20 分钟)
第 3 天：学习函数设计 (20 分钟)
第 4 天：实践 + 审查工具检查
第 5 天：复习 + 改进
```

### 中级开发者

```
第 1 周：完整阅读开发规范手册
第 2 周：学习 SOLID 原则
第 3 周：学习代码异味识别
第 4 周：实践 + 代码审查
```

### 高级开发者/Team Lead

```
第 1 天：研究 CI/CD 集成
第 2 天：研究 IDE 集成
第 3 天：定制团队规范
第 4 天：团队培训和推广
```

---

## 📊 文档统计

| 类别 | 文档数 | 总字数 |
|------|--------|--------|
| 规范文档 | 4 | ~24,000 字 |
| 集成指南 | 2 | ~15,000 字 |
| 规则文件 | 4 | ~27,000 字 |
| 工具文档 | 3 | ~15,000 字 |
| **总计** | **13** | **~81,000 字** |

---

## 🔗 外部资源

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

---

## ❓ 常见问题

### Q: 文档太多，看不完怎么办？

**A:** 先看 [快速参考卡片](quick-reference.md)，其他文档当字典查阅。

### Q: 团队想定制规范，从哪开始？

**A:** 复制 [团队配置模板](config/team-config.template.json)，按需修改。

### Q: 如何集成到现有项目？

**A:** 参考 [CI/CD 集成指南](ci-cd-integration.md) 和 [IDE 集成指南](ide-integration.md)。

### Q: 审查工具和文档是什么关系？

**A:** 文档是规范说明，工具是自动化检查。文档指导怎么写，工具检查写得对不对。

---

*最后更新：2026-03-05*  
*文档版本：v1.0*
