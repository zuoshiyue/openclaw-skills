# Tavily API 文档

## 搜索端点

```javascript
POST https://api.tavily.com/search
Content-Type: application/json
Authorization: Bearer {API_KEY}

{
  "query": "搜索内容",
  "search_depth": "basic|advanced",
  "topic": "general|news",
  "days": 3,
  "max_results": 5,
  "include_domains": [],
  "exclude_domains": []
}
```

## 响应格式

```json
{
  "query": "搜索内容",
  "follow_up_questions": [],
  "answer": null,
  "images": [],
  "results": [
    {
      "title": "标题",
      "url": "https://...",
      "content": "摘要内容",
      "score": 0.95,
      "raw_content": null
    }
  ]
}
```

## 参数详解

### search_depth
- `basic` — 基础搜索（快速）
- `advanced` — 深度搜索（更全面）

### topic
- `general` — 通用搜索
- `news` — 新闻搜索（需配合 days 参数）

### days
- 新闻搜索的时间范围（1-365 天）
- 仅 topic=news 时有效

### max_results
- 返回结果数量（1-20）
- 默认 5

### include_domains / exclude_domains
- 限制或排除特定域名
- 例如：`include_domains: ["github.com"]`

## 最佳实践

1. **事实查证** — 使用 `--deep` + 交叉验证
2. **新闻搜索** — 使用 `--topic news --days 7`
3. **代码相关** — 添加 `site:github.com` 到查询
4. **学术研究** — 添加 `site:arxiv.org` 或 `site:scholar.google.com`

## 限制

- 免费计划：1000 次/月
- 付费计划：从 $29/月起
- 速率限制：取决于套餐

## 替代方案

如果 Tavily 不可用：
- `web_fetch` 工具 — 提取单个 URL 内容
- 手动浏览器搜索
