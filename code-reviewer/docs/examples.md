# 代码审查正反面示例

## 📖 说明

本文件收集了 Clean Code、重构等经典书籍中的正反面代码示例，用于代码审查参考和学习。

---

## 1. 命名规范

### ❌ 反面示例：无意义的变量名

```javascript
// Bad: 变量名无意义
const d = moment().format("YYYY/MM/DD");
const yyyymmdstr = moment().format("YYYY/MM/DD");

function getUserInfo(u) {
  return fetch(`/api/user/${u.id}`);
}
```

### ✅ 正面示例：有意义的命名

```javascript
// Good: 变量名清晰表达用途
const currentDate = moment().format("YYYY/MM/DD");
const formattedDate = moment().format("YYYY/MM/DD");

function getUser(user) {
  return fetch(`/api/user/${user.id}`);
}
```

---

## 2. 函数设计

### ❌ 反面示例：函数做多件事

```javascript
// Bad: 函数同时负责查询、过滤、发送邮件
function emailClients(clients) {
  clients.forEach(client => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}
```

### ✅ 正面示例：单一职责

```javascript
// Good: 每个函数只做一件事
function emailActiveClients(clients) {
  clients.filter(isActiveClient).forEach(email);
}

function isActiveClient(client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

---

## 3. 函数参数

### ❌ 反面示例：参数过多

```javascript
// Bad: 5 个参数，难以理解和记忆
function createMenu(title, body, buttonText, cancellable, position) {
  // ...
}

createMenu("标题", "内容", "确定", true, { x: 100, y: 200 });
```

### ✅ 正面示例：对象参数

```javascript
// Good: 使用对象参数，清晰明了
function createMenu({ title, body, buttonText, cancellable, position }) {
  // ...
}

createMenu({
  title: "标题",
  body: "内容",
  buttonText: "确定",
  cancellable: true,
  position: { x: 100, y: 200 }
});
```

---

## 4. 魔法数字

### ❌ 反面示例：硬编码数字

```javascript
// Bad: 魔法数字，含义不明确
setTimeout(blastOff, 86400000);

if (user.role === 3) {
  // 3 是什么角色？
  grantAdminAccess();
}

const price = quantity * 9.99;
```

### ✅ 正面示例：具名常量

```javascript
// Good: 常量名清晰表达含义
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
setTimeout(blastOff, MILLISECONDS_PER_DAY);

const ROLE_ADMIN = 3;
if (user.role === ROLE_ADMIN) {
  grantAdminAccess();
}

const PRICE_PER_UNIT = 9.99;
const price = quantity * PRICE_PER_UNIT;
```

---

## 5. 嵌套深度

### ❌ 反面示例：过深嵌套

```javascript
// Bad: 4 层嵌套，难以阅读
function processOrder(order) {
  if (order) {
    if (order.items) {
      if (order.items.length > 0) {
        if (order.customer) {
          // 实际业务逻辑在这里
          calculateTotal(order);
        }
      }
    }
  }
}
```

### ✅ 正面示例：提前返回

```javascript
// Good: 使用卫语句，减少嵌套
function processOrder(order) {
  if (!order) return;
  if (!order.items || order.items.length === 0) return;
  if (!order.customer) return;
  
  calculateTotal(order);
}
```

---

## 6. 重复代码

### ❌ 反面示例：重复逻辑

```javascript
// Bad: 重复的代码逻辑
function showDeveloperList(developers) {
  developers.forEach(developer => {
    const expectedSalary = developer.calculateExpectedSalary();
    const experience = developer.getExperience();
    const githubLink = developer.getGithubLink();
    const data = { expectedSalary, experience, githubLink };
    render(data);
  });
}

function showManagerList(managers) {
  managers.forEach(manager => {
    const expectedSalary = manager.calculateExpectedSalary();
    const experience = manager.getExperience();
    const portfolio = manager.getMBAProjects();
    const data = { expectedSalary, experience, portfolio };
    render(data);
  });
}
```

### ✅ 正面示例：提取公共逻辑

```javascript
// Good: 统一处理，消除重复
function showEmployeeList(employees) {
  employees.forEach(employee => {
    const expectedSalary = employee.calculateExpectedSalary();
    const experience = employee.getExperience();
    
    const data = { expectedSalary, experience };
    
    switch (employee.type) {
      case "manager":
        data.portfolio = employee.getMBAProjects();
        break;
      case "developer":
        data.githubLink = employee.getGithubLink();
        break;
    }
    
    render(data);
  });
}
```

---

## 7. 副作用

### ❌ 反面示例：修改全局变量

```javascript
// Bad: 函数有副作用，修改全局变量
let name = "Ryan McDermott";

function splitIntoFirstAndLastName() {
  name = name.split(" ");
}

splitIntoFirstAndLastName();
console.log(name); // ['Ryan', 'McDermott']
```

### ✅ 正面示例：纯函数

```javascript
// Good: 纯函数，无副作用
function splitIntoFirstAndLastName(name) {
  return name.split(" ");
}

const name = "Ryan McDermott";
const newName = splitIntoFirstAndLastName(name);

console.log(name);    // 'Ryan McDermott'
console.log(newName); // ['Ryan', 'McDermott']
```

---

## 8. 条件判断

### ❌ 反面示例：复杂条件

```javascript
// Bad: 复杂条件内联，难以理解
if (fsm.state === "fetching" && isEmpty(listNode)) {
  showSpinner();
}
```

### ✅ 正面示例：封装条件

```javascript
// Good: 封装为具名函数，意图清晰
function shouldShowSpinner(fsm, listNode) {
  return fsm.state === "fetching" && isEmpty(listNode);
}

if (shouldShowSpinner(fsmInstance, listNodeInstance)) {
  showSpinner();
}
```

---

## 9. 否定式条件

### ❌ 反面示例：否定式命名

```javascript
// Bad: 双重否定，难以理解
function isDOMNodeNotPresent(node) {
  // ...
}

if (!isDOMNodeNotPresent(node)) {
  // 需要大脑转个弯
}
```

### ✅ 正面示例：肯定式命名

```javascript
// Good: 肯定式表达，直观易懂
function isDOMNodePresent(node) {
  // ...
}

if (isDOMNodePresent(node)) {
  // 一目了然
}
```

---

## 10. 注释规范

### ❌ 反面示例：注释说什么

```javascript
// Bad: 注释重复代码已表达的内容
// 设置用户名为 John
user.name = 'John';

// 检查用户是否有效
if (user.isValid()) {
  // 保存用户
  user.save();
}
```

### ✅ 正面示例：注释说为什么

```javascript
// Good: 注释解释原因和背景
// 使用默认用户名，因为这是新用户注册流程的初始值
user.name = 'John';

// 只有验证通过的用户才能保存，防止脏数据入库
if (user.isValid()) {
  user.save();
}
```

---

## 11. 类设计

### ❌ 反面示例：上帝类

```javascript
// Bad: 类承担过多职责
class UserManager {
  saveUser(user) { /* ... */ }
  sendEmail(user) { /* ... */ }
  logActivity(action) { /* ... */ }
  generateReport() { /* ... */ }
  connectToDatabase() { /* ... */ }
}
```

### ✅ 正面示例：单一职责

```javascript
// Good: 每个类职责单一
class UserRepository {
  save(user) { /* ... */ }
  findById(id) { /* ... */ }
}

class EmailService {
  sendWelcomeEmail(user) { /* ... */ }
}

class ActivityLogger {
  log(action) { /* ... */ }
}

class ReportGenerator {
  generateUserReport() { /* ... */ }
}
```

---

## 12. 异常处理

### ❌ 反面示例：空 catch 或通用异常

```javascript
// Bad: 空 catch 块，吞掉异常
try {
  riskyOperation();
} catch (e) {
  // 什么都不做
}

// Bad: 捕获过于通用的异常
try {
  doSomething();
} catch (Exception e) {
  // 所有异常都一样处理
}
```

### ✅ 正面示例：具体异常处理

```javascript
// Good: 捕获具体异常并适当处理
try {
  riskyOperation();
} catch (DatabaseError e) {
  logger.error('数据库操作失败', e);
  throw new ServiceException('保存失败，请稍后重试', e);
}

// Good: 记录异常上下文
try {
  processPayment(order);
} catch (PaymentError e) {
  logger.error(`订单${order.id}支付失败：${e.message}`, {
    orderId: order.id,
    amount: order.amount,
    userId: order.userId
  });
  notifyUser(order.userId, '支付失败，请检查银行卡信息');
}
```

---

## 13. SOLID 原则示例

### SRP - 单一职责

```javascript
// Bad: 违反 SRP
class Report {
  loadData() { /* ... */ }
  processData() { /* ... */ }
  saveToDatabase() { /* ... */ }
  exportToPDF() { /* ... */ }
  sendEmail() { /* ... */ }
}

// Good: 遵循 SRP
class ReportData {
  loadData() { /* ... */ }
  processData() { /* ... */ }
}

class ReportRepository {
  save(report) { /* ... */ }
}

class ReportExporter {
  exportToPDF(report) { /* ... */ }
}

class ReportService {
  constructor(reportRepo, exporter) {
    this.repo = reportRepo;
    this.exporter = exporter;
  }
}
```

### DIP - 依赖倒置

```javascript
// Bad: 依赖具体实现
class UserService {
  constructor() {
    this.userRepository = new MySQLUserRepository();
  }
}

// Good: 依赖抽象
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository; // 传入接口实现
  }
}

// 使用时注入具体实现
const userService = new UserService(new MySQLUserRepository());
// 或 const userService = new UserService(new MongoUserRepository());
```

---

## 📚 参考资料

- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) - Robert C. Martin
- [Refactoring](https://martinfowler.com/books/refactoring.html) - Martin Fowler
- [Effective Java](https://www.oracle.com/java/technologies/javase/effectivejava.html) - Joshua Bloch
- [阿里巴巴 Java 开发手册](https://github.com/alibaba/p3c)

---

*最后更新：2026-03-05*
