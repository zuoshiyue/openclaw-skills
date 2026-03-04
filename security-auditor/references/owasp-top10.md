# OWASP Top 10 2021 详解

## A01:2021 - Broken Access Control (访问控制失效)

### 问题示例
```typescript
// ❌ 错误：没有授权检查
app.delete('/api/posts/:id', async (req, res) => {
  await db.post.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})
```

### 正确做法
```typescript
// ✅ 正确：验证所有权
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  const post = await db.post.findUnique({ where: { id: req.params.id } })
  if (!post) return res.status(404).json({ error: 'Not found' })
  if (post.authorId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  await db.post.delete({ where: { id: req.params.id } })
  res.json({ success: true })
})
```

### 检查清单
- [ ] 每个端点验证认证
- [ ] 每个数据访问验证授权
- [ ] CORS 配置特定来源
- [ ] 速率限制敏感端点
- [ ] JWT 每次请求验证

---

## A02:2021 - Cryptographic Failures (加密失败)

### 问题示例
```typescript
// ❌ 错误：明文存储密码
await db.user.create({ data: { password: req.body.password } })
```

### 正确做法
```typescript
// ✅ 正确：bcrypt 哈希
import bcrypt from 'bcryptjs'
const hashedPassword = await bcrypt.hash(req.body.password, 12)
await db.user.create({ data: { password: hashedPassword } })
```

### 检查清单
- [ ] 密码 bcrypt 哈希 (12+ rounds) 或 argon2
- [ ] 敏感数据 AES-256 加密
- [ ] 强制 TLS/HTTPS
- [ ] 源码和日志无密钥
- [ ] 敏感字段排除出 API 响应

---

## A03:2021 - Injection (注入攻击)

### SQL 注入
```typescript
// ❌ 错误
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ 正确：参数化查询
const user = await db.query('SELECT * FROM users WHERE email = $1', [email])
const user = await prisma.user.findUnique({ where: { email } })
```

### 命令注入
```typescript
// ❌ 错误
const result = exec(`ls ${userInput}`)

// ✅ 正确
import { execFile } from 'child_process'
execFile('ls', [sanitizedPath], callback)
```

### 检查清单
- [ ] 所有查询使用参数化或 ORM
- [ ] 禁止字符串拼接查询
- [ ] OS 命令使用参数数组
- [ ] 禁止 eval()、Function()

---

## A05:2021 - Security Misconfiguration (安全配置错误)

### 检查清单
- [ ] 更改默认凭证
- [ ] 生产环境错误不泄露堆栈
- [ ] 禁用不必要的 HTTP 方法
- [ ] 配置安全头
- [ ] 生产环境禁用调试模式
- [ ] 定期更新依赖

---

## A07:2021 - Cross-Site Scriptering (XSS)

### 问题示例
```typescript
// ❌ 错误
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

### 正确做法
```typescript
// ✅ 正确： sanitization
import DOMPurify from 'isomorphic-dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userComment) }} />

// ✅ 最佳：纯文本渲染 (React 自动转义)
<div>{userComment}</div>
```

### 检查清单
- [ ] 依赖 React 自动转义
- [ ] HTML 渲染使用 DOMPurify
- [ ] 配置 CSP 头
- [ ] Session Cookie HttpOnly
