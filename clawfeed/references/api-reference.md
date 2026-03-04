# ClawFeed API 参考

## 摘要端点

### 获取摘要列表

```http
GET /api/digests?type=4h|daily|weekly&limit=20&offset=0
```

**参数:**
- `type` — 摘要类型 (4h, daily, weekly, monthly)
- `limit` — 返回数量 (默认 20)
- `offset` — 偏移量

**响应:**
```json
{
  "digests": [
    {
      "id": "xxx",
      "type": "daily",
      "title": "每日摘要 2026-03-05",
      "created_at": "2026-03-05T08:00:00Z",
      "items_count": 15
    }
  ],
  "total": 100
}
```

### 获取单个摘要

```http
GET /api/digests/:id
```

**响应:**
```json
{
  "id": "xxx",
  "type": "daily",
  "title": "...",
  "content": "摘要内容",
  "items": [...],
  "created_at": "..."
}
```

---

## 订阅源端点

### 获取所有订阅源

```http
GET /api/feeds
```

### 添加订阅源

```http
POST /api/feeds
Content-Type: application/json

{
  "url": "https://example.com/rss",
  "name": "示例订阅源",
  "language": "zh"
}
```

---

## 配置端点

### 获取配置

```http
GET /api/config
```

### 更新配置

```http
PUT /api/config
Content-Type: application/json

{
  "language": "zh",
  "digest_schedule": "0 8 * * *"
}
```

---

## 认证端点（可选）

### 开始 OAuth 流程

```http
GET /api/auth/google
```

### OAuth 回调

```http
GET /api/auth/callback?code=xxx
```

### 获取当前用户

```http
GET /api/auth/me
Authorization: Bearer {token}
```

### 登出

```http
POST /api/auth/logout
```

---

## 书签端点（需认证）

### 获取书签

```http
GET /api/marks
```

### 添加书签

```http
POST /api/marks
Content-Type: application/json

{
  "digest_id": "xxx",
  "note": "备注"
}
```

### 删除书签

```http
DELETE /api/marks/:id
```
