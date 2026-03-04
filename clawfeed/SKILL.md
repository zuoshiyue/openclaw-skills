---
name: clawfeed
description: >
  AI 驱动的新闻摘要工具。自动从 Twitter 和 RSS 生成结构化摘要（4 小时/日/周/月）。
  Use when: 需要生成新闻摘要、查看订阅源、管理订阅包。
  配置：SQLite 数据库，可选 Google OAuth
---

# ClawFeed

AI 驱动的新闻摘要生成工具。

## 功能

- **摘要生成** — 4 小时/日/周/月周期
- **订阅源管理** — Twitter、RSS
- **多语言支持** — 切换显示语言
- **书签功能** — 收藏重要摘要（需认证）

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

**服务端口:** 8767（可通过 `DIGEST_PORT` 修改）

---

## 配置

### 环境变量 (.env)

| 变量 | 说明 | 必需 | 默认 |
|------|------|------|------|
| `DIGEST_PORT` | 服务端口 | 否 | 8767 |
| `AI_DIGEST_DB` | SQLite 路径 | 否 | `data/digest.db` |
| `GOOGLE_CLIENT_ID` | Google OAuth | 认证功能 | - |
| `SESSION_SECRET` | Session 加密 | 认证功能 | - |

### 只读模式

无需任何配置即可运行：
- ✅ 浏览摘要
- ✅ 查看订阅源
- ✅ 切换语言

### 完整功能（需配置）

- 🔐 Google OAuth 登录
- 🔐 书签管理
- 🔐 自定义订阅源

---

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/digests` | 获取摘要列表 |
| GET | `/api/digests/:id` | 获取单个摘要 |
| GET | `/api/feeds` | 获取订阅源 |
| GET | `/api/config` | 获取配置 |

详见 [references/api-reference.md](references/api-reference.md)

---

## 模板定制

- `templates/curation-rules.md` — 摘要规则
- `templates/digest-prompt.md` — AI 摘要提示词

---

## 反向代理配置

详见 [references/reverse-proxy.md](references/reverse-proxy.md)

### Caddy 示例

```caddyfile
digest.example.com {
    reverse_proxy localhost:8767
}
```

### Nginx 示例

```nginx
server {
    listen 443 ssl;
    server_name digest.example.com;
    
    location / {
        proxy_pass http://localhost:8767;
    }
}
```

---

## 数据库

SQLite 自动创建，路径：`data/digest.db`

主要表：
- `digests` — 摘要记录
- `feeds` — 订阅源
- `users` — 用户（认证功能）
- `bookmarks` — 书签

---

**文档:** https://github.com/your-repo/clawfeed
