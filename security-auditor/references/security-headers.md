# 安全头配置指南

## 完整配置 (Next.js)

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.example.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  }
}
```

## 头说明

| 头 | 作用 | 推荐值 |
|---|------|--------|
| `Strict-Transport-Security` | 强制 HTTPS | `max-age=63072000` |
| `X-Frame-Options` | 防止点击劫持 | `SAMEORIGIN` |
| `X-Content-Type-Options` | 防止 MIME 嗅探 | `nosniff` |
| `Content-Security-Policy` | 限制资源加载 | 根据需求配置 |
| `Referrer-Policy` | 控制 Referer | `strict-origin-when-cross-origin` |

## CSP 配置建议

### 严格模式 (推荐)
```
default-src 'none'
script-src 'self'
style-src 'self'
img-src 'self' data:
font-src 'self'
connect-src 'self'
frame-ancestors 'none'
```

### 宽松模式 (开发)
```
default-src 'self' 'unsafe-inline' 'unsafe-eval'
img-src 'self' data: https:
connect-src 'self' https://api.*
```

## 验证工具

- https://securityheaders.com/
- https://csp-evaluator.withgoogle.com/
