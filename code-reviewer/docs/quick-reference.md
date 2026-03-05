# 代码开发规范 - 快速参考卡片

> 打印出来贴在显示器旁边，随时参考！

---

## 📝 命名规范

| 类型 | 规范 | 示例 ✅ | 避免 ❌ |
|------|------|--------|--------|
| **变量** | 小驼峰，有意义 | `currentUser`, `productList` | `u`, `list`, `data` |
| **常量** | 全大写 + 下划线 | `MAX_RETRY`, `DEFAULT_TIMEOUT` | `max`, `timeout` |
| **函数** | 动词 + 名词 | `getUserById`, `calculateTotal` | `getUser`, `calc` |
| **类** | 大驼峰 | `UserService`, `OrderManager` | `userService`, `user_service` |
| **布尔** | is/has/can/should | `isValid`, `hasPermission` | `check`, `verify` |

---

## 🎯 函数设计

```
┌─────────────────────────────────────────────────────┐
│  函数设计三原则                                      │
├─────────────────────────────────────────────────────┤
│  1️⃣  只做一件事                                     │
│  2️⃣  参数不超过 3 个                                 │
│  3️⃣  长度不超过 50 行                                │
└─────────────────────────────────────────────────────┘
```

### 参数过多？用对象！

```javascript
// ❌ 不要这样
function createUser(name, email, role, department, manager) { }

// ✅ 这样更好
function createUser({ name, email, role, department, manager }) { }
```

### 嵌套过深？提前返回！

```javascript
// ❌ 不要这样
if (user) {
  if (user.isValid()) {
    if (user.hasPermission()) {
      // 业务逻辑
    }
  }
}

// ✅ 这样更好
if (!user) return;
if (!user.isValid()) return;
if (!user.hasPermission()) return;
// 业务逻辑
```

---

## 🔄 代码结构

### DRY 原则 (Don't Repeat Yourself)

**看到重复代码 → 提取为函数**

```javascript
// 发现重复？
developers.forEach(d => render({ salary: d.calcSalary() }));
managers.forEach(m => render({ salary: m.calcSalary() }));

// 提取！
employees.forEach(e => render({ salary: e.calcSalary() }));
```

### 单一职责

**一个类/函数只有一个改变的理由**

```javascript
// ❌ 一个类做多件事
class UserService {
  save() { }      // 数据持久化
  email() { }     // 邮件发送
  log() { }       // 日志记录
  report() { }    // 报告生成
}

// ✅ 每个类职责单一
class UserRepository { save() { } }
class EmailService { email() { } }
class ActivityLogger { log() { } }
```

---

## 💬 注释规范

### 注释"为什么"而非"做什么"

```javascript
// ❌ 重复代码
// 设置用户名为 Guest
user.name = 'Guest';

// ✅ 解释原因
// 使用默认用户名，因为这是新用户注册流程的初始值
user.name = 'Guest';
```

### 删除注释代码

```javascript
// ❌ 不要这样
// const oldFunction = () => { };
// 已废弃，使用 newFunction

// ✅ 直接删除，版本控制保留历史
```

---

## ⚠️ 常见错误

### 1. 魔法数字

```javascript
// ❌
setTimeout(task, 86400000);

// ✅
const MILLISECONDS_PER_DAY = 86400000;
setTimeout(task, MILLISECONDS_PER_DAY);
```

### 2. 空 catch

```javascript
// ❌
try { riskyOp(); } catch (e) { }

// ✅
try {
  riskyOp();
} catch (error) {
  logger.error('操作失败', error);
  throw new BusinessException('操作失败，请稍后重试', error);
}
```

### 3. 布尔标志参数

```javascript
// ❌
function createFile(name, isTemp) {
  if (isTemp) { /* ... */ } else { /* ... */ }
}

// ✅
function createFile(name) { }
function createTempFile(name) { }
```

---

## 📋 提交前自检清单

```
□ 命名清晰有意义
□ 函数不超过 50 行
□ 嵌套不超过 4 层
□ 参数不超过 3 个
□ 无重复代码
□ 无死代码
□ 有异常处理
□ 有单元测试
□ 更新文档
□ 删除注释代码
```

---

## 🔍 代码审查工具

```bash
# 审查单个文件
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs ./src/UserService.java

# 审查整个目录
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs ./src --recursive

# CI/CD 集成
node ~/.openclaw/workspace/skills/code-reviewer/scripts/review.mjs ./src --ci
```

---

## 📚 深入学习

| 文档 | 用途 |
|------|------|
| [development-guide.md](development-guide.md) | 完整的开发规范手册 |
| [checklist.md](checklist.md) | 详细的审查检查清单 |
| [examples.md](examples.md) | 正反面代码示例 |

---

## 🎓 核心原则记忆

```
   ┌──────────────────────────────────────┐
   │         Clean Code 核心原则          │
   ├──────────────────────────────────────┤
   │  • 有意义的命名                        │
   │  • 短小的函数                          │
   │  • 单一的职责                          │
   │  • 最少的参数                          │
   │  • 充分的测试                          │
   │  • 恰当的注释                          │
   └──────────────────────────────────────┘

   ┌──────────────────────────────────────┐
   │         SOLID 原则                   │
   ├──────────────────────────────────────┤
   │  S - 单一职责                         │
   │  O - 开闭原则                         │
   │  L - 里氏替换                         │
   │  I - 接口隔离                         │
   │  D - 依赖倒置                         │
   └──────────────────────────────────────┘
```

---

*版本：v1.0 | 更新：2026-03-05*
