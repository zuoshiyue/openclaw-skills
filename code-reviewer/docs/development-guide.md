# 代码开发规范手册

> 预防胜于治疗 —— 写好代码比审查代码更重要

## 🎯 使用说明

本规范用于**指导日常开发**，帮助你在写代码时做出正确决策。

**审查工具** 用于发现问题，**本规范** 用于预防问题。

---

## 第一部分：命名规范

### 1.1 变量命名

#### ✅ 正确做法

```javascript
// 使用有意义的名称
const currentUser = getUserById(id);
const productList = await fetchProducts();
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;
```

#### ❌ 避免做法

```javascript
// 无意义的名称
const u = getUserById(id);
const list = await fetchProducts();
const max = 3;
const timeout = 5000;
```

#### 📋 命名检查清单

- [ ] 变量名能清晰表达用途吗？
- [ ] 其他人能一眼看懂吗？
- [ ] 常量使用全大写 + 下划线吗？
- [ ] 避免单字母命名（循环变量除外）

---

### 1.2 函数命名

#### ✅ 正确做法

```javascript
// 动词 + 名词，清晰表达意图
function getUserById(id) { }
function calculateTotalPrice(items) { }
function isValidEmail(email) { }
function formatCurrency(amount, locale) { }
```

#### ❌ 避免做法

```javascript
// 名称模糊
function getUser(id) { }           // 是通过 ID 还是其他？
function calc(items) { }           // 计算什么？
function check(email) { }          // 检查什么？
function format(amount) { }        // 格式化为什么格式？
```

#### 📋 函数命名检查清单

- [ ] 函数名说明做了什么吗？
- [ ] 布尔函数用 is/has/should 开头吗？
- [ ] 命令式函数用动词开头吗？
- [ ] 名称长度适中（3-30 字符）吗？

---

## 第二部分：函数设计

### 2.1 单一职责

#### ✅ 正确做法

```javascript
// 每个函数只做一件事
function emailActiveClients(clients) {
  clients.filter(isActiveClient).forEach(sendEmail);
}

function isActiveClient(client) {
  const record = database.lookup(client);
  return record.isActive();
}

function sendEmail(client) {
  // 发送邮件逻辑
}
```

#### ❌ 避免做法

```javascript
// 一个函数做多件事
function processClients(clients) {
  // 查询 + 过滤 + 发送邮件 + 记录日志 + 生成报告
  clients.forEach(client => {
    const record = database.lookup(client);
    if (record.isActive()) {
      email(client);
      log(`Emailed ${client.name}`);
      report.add(client);
    }
  });
}
```

#### 📋 函数职责检查清单

- [ ] 函数只做一件事吗？
- [ ] 函数名能准确概括全部逻辑吗？
- [ ] 函数长度不超过 50 行吗？
- [ ] 嵌套不超过 4 层吗？

---

### 2.2 参数设计

#### ✅ 正确做法

```javascript
// 使用对象参数
function createUser({ name, email, role, permissions }) {
  // ...
}

createUser({
  name: 'John',
  email: 'john@example.com',
  role: 'admin',
  permissions: ['read', 'write']
});
```

#### ❌ 避免做法

```javascript
// 参数过多
function createUser(name, email, role, permissions, department, manager, startDate) {
  // ...
}

createUser('John', 'john@example.com', 'admin', ['read', 'write'], 'IT', 'Jane', '2024-01-01');
// 每个参数的含义？顺序对吗？
```

#### 📋 参数设计检查清单

- [ ] 参数不超过 3 个吗？
- [ ] 超过 3 个时封装为对象了吗？
- [ ] 参数顺序合理吗（重要的在前）？
- [ ] 有默认值的参数放后面了吗？

---

## 第三部分：代码结构

### 3.1 减少嵌套

#### ✅ 正确做法（卫语句）

```javascript
function processOrder(order) {
  if (!order) return;
  if (!order.items || order.items.length === 0) return;
  if (!order.customer) return;
  if (!order.payment) return;
  
  // 主要业务逻辑
  calculateTotal(order);
  saveOrder(order);
  sendConfirmation(order);
}
```

#### ❌ 避免做法（箭头型代码）

```javascript
function processOrder(order) {
  if (order) {
    if (order.items && order.items.length > 0) {
      if (order.customer) {
        if (order.payment) {
          // 主要业务逻辑
          calculateTotal(order);
          saveOrder(order);
          sendConfirmation(order);
        }
      }
    }
  }
}
```

#### 📋 嵌套检查清单

- [ ] 嵌套不超过 4 层吗？
- [ ] 能用提前返回吗？
- [ ] 能提取为独立函数吗？
- [ ] 能用卫语句简化吗？

---

### 3.2 消除重复

#### ✅ 正确做法

```javascript
// 提取公共逻辑
function showEmployeeList(employees) {
  employees.forEach(employee => {
    const data = {
      salary: employee.calculateSalary(),
      experience: employee.getExperience()
    };
    
    // 根据类型添加特定字段
    if (employee.type === 'manager') {
      data.portfolio = employee.getMBAProjects();
    } else if (employee.type === 'developer') {
      data.github = employee.getGithubLink();
    }
    
    render(data);
  });
}
```

#### ❌ 避免做法

```javascript
// 重复代码
function showDeveloperList(developers) {
  developers.forEach(dev => {
    const data = {
      salary: dev.calculateSalary(),
      experience: dev.getExperience(),
      github: dev.getGithubLink()
    };
    render(data);
  });
}

function showManagerList(managers) {
  managers.forEach(manager => {
    const data = {
      salary: manager.calculateSalary(),
      experience: manager.getExperience(),
      portfolio: manager.getMBAProjects()
    };
    render(data);
  });
}
```

#### 📋 重复代码检查清单

- [ ] 有复制粘贴的代码吗？
- [ ] 有相似的逻辑吗？
- [ ] 能提取为公共函数吗？
- [ ] 能用模板方法吗？

---

## 第四部分：注释规范

### 4.1 注释原则

#### ✅ 正确做法

```javascript
// 注释解释"为什么"而不是"做什么"

// 使用默认用户名，因为这是新用户注册流程的初始值
user.name = 'Guest';

// 重试 3 次，因为网络波动通常是暂时的
const MAX_RETRY = 3;

// 缓存 5 分钟，平衡实时性和性能
const CACHE_TTL = 5 * 60 * 1000;
```

#### ❌ 避免做法

```javascript
// 注释重复代码

// 设置用户名为 Guest
user.name = 'Guest';

// 最大重试次数为 3
const MAX_RETRY = 3;

// 如果用户有效
if (user.isValid()) {
  // 保存用户
  user.save();
}
```

#### 📋 注释检查清单

- [ ] 注释解释为什么而不是做什么吗？
- [ ] 有注释掉的代码吗？（应该删除）
- [ ] 公共方法有文档注释吗？
- [ ] 复杂算法有说明吗？

---

## 第五部分：异常处理

### 5.1 基本原则

#### ✅ 正确做法

```javascript
// 捕获具体异常，适当处理
async function processPayment(order) {
  try {
    await paymentGateway.charge(order.amount);
  } catch (error) {
    if (error instanceof InsufficientFundsError) {
      notifyUser(order.userId, '余额不足，请充值');
      logger.warn(`订单${order.id}支付失败：余额不足`);
    } else if (error instanceof NetworkError) {
      // 可重试的错误
      await retry(() => processPayment(order));
    } else {
      // 未知错误，记录详细信息
      logger.error(`订单${order.id}支付失败`, {
        error: error.message,
        stack: error.stack,
        orderId: order.id
      });
      throw new PaymentException('支付失败，请稍后重试', error);
    }
  }
}
```

#### ❌ 避免做法

```javascript
// 空 catch 或通用异常
async function processPayment(order) {
  try {
    await paymentGateway.charge(order.amount);
  } catch (e) {
    // 什么都不做
  }
}

// 或者
async function processPayment(order) {
  try {
    await paymentGateway.charge(order.amount);
  } catch (error) {
    console.log('支付失败');
  }
}
```

#### 📋 异常处理检查清单

- [ ] 不捕获 Exception 后不做处理吗？
- [ ] 使用具体的异常类型吗？
- [ ] 记录足够的错误信息吗？
- [ ] 告知用户友好的错误消息吗？

---

## 第六部分：SOLID 原则

### 6.1 单一职责原则 (SRP)

```javascript
// ❌ 违反 SRP
class UserService {
  save(user) { }           // 数据持久化
  sendEmail(user) { }      // 邮件发送
  log(action) { }          // 日志记录
  generateReport() { }     // 报告生成
}

// ✅ 遵循 SRP
class UserRepository {
  save(user) { }
  findById(id) { }
}

class EmailService {
  sendWelcomeEmail(user) { }
}

class ActivityLogger {
  log(action) { }
}

class UserService {
  constructor(userRepo, emailService, logger) {
    this.userRepo = userRepo;
    this.emailService = emailService;
    this.logger = logger;
  }
  
  register(userData) {
    const user = this.userRepo.save(userData);
    this.emailService.sendWelcomeEmail(user);
    this.logger.log(`用户${user.id}注册`);
    return user;
  }
}
```

### 6.2 开闭原则 (OCP)

```javascript
// ❌ 违反 OCP - 添加新类型需要修改代码
function getDiscount(customer) {
  if (customer.type === 'regular') {
    return 0;
  } else if (customer.type === 'vip') {
    return 0.1;
  } else if (customer.type === 'svip') {
    return 0.2;
  }
}

// ✅ 遵循 OCP - 添加新类型只需扩展
class Customer {
  getDiscount() { return 0; }
}

class RegularCustomer extends Customer {
  getDiscount() { return 0; }
}

class VIPCustomer extends Customer {
  getDiscount() { return 0.1; }
}

class SVIPCustomer extends Customer {
  getDiscount() { return 0.2; }
}

// 使用时
function calculatePrice(customer, amount) {
  return amount * (1 - customer.getDiscount());
}
```

### 6.3 依赖倒置原则 (DIP)

```javascript
// ❌ 违反 DIP - 依赖具体实现
class OrderService {
  constructor() {
    this.orderRepo = new MySQLOrderRepository();
    this.emailService = new SendGridEmailService();
  }
}

// ✅ 遵循 DIP - 依赖抽象
class OrderService {
  constructor(orderRepository, emailService) {
    this.orderRepo = orderRepository;  // 接口
    this.emailService = emailService;   // 接口
  }
}

// 使用时注入具体实现
const orderService = new OrderService(
  new MySQLOrderRepository(),
  new SendGridEmailService()
);

// 可以轻松切换实现
const orderService2 = new OrderService(
  new MongoOrderRepository(),
  new SesEmailService()
);
```

---

## 第七部分：开发检查清单

### 提交前自检

#### 代码质量
- [ ] 命名清晰有意义
- [ ] 函数不超过 50 行
- [ ] 嵌套不超过 4 层
- [ ] 参数不超过 3 个
- [ ] 无重复代码
- [ ] 无死代码

#### 异常处理
- [ ] 捕获具体异常
- [ ] 记录足够信息
- [ ] 用户友好提示
- [ ] 资源正确释放

#### 测试
- [ ] 有单元测试
- [ ] 覆盖边界条件
- [ ] 测试独立可运行
- [ ] 测试命名清晰

#### 文档
- [ ] 公共方法有文档
- [ ] 复杂逻辑有注释
- [ ] 更新了 README
- [ ] 删除了注释代码

---

## 📚 参考资料

- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882) - Robert C. Martin
- [Refactoring](https://martinfowler.com/books/refactoring.html) - Martin Fowler
- [Effective Java](https://www.oracle.com/java/technologies/javase/effectivejava.html) - Joshua Bloch
- [阿里巴巴 Java 开发手册](https://github.com/alibaba/p3c)

---

*最后更新：2026-03-05*  
*版本：v1.0*
