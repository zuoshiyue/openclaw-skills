---
name: news-aggregator
description: >
  新闻聚合与热搜抓取技能。支持多渠道管理、智能过滤、统一处理。
  Use when: 需要抓取微博/抖音/B 站/知乎等热搜、聚合多渠道新闻、定时推送热点摘要。
  配置：渠道配置在 ~/.openclaw/workspace/skills/news-aggregator/config/channels.json
metadata: {"clawdbot":{"emoji":"📰","requires":{"bins":["node","curl"]}}}
---

# 📰 News Aggregator - 新闻聚合器

**智能新闻聚合技能** - 管理多渠道、抓取热搜、统一处理、自动分发

---

## 🚀 快速开始

```bash
# 查看已启用渠道
node {workspace}/skills/news-aggregator/scripts/list-channels.mjs

# 执行一次完整抓取
node {workspace}/skills/news-aggregator/scripts/fetch-all.mjs

# 同步到飞书表格
node {workspace}/skills/news-aggregator/scripts/sync-feishu.mjs

# 管理渠道（启用/禁用/新增）
node {workspace}/skills/news-aggregator/scripts/manage-channels.mjs enable github
```

---

## 📋 功能特性

1. **渠道管理** - 启用/禁用、新增渠道、优先级设置
2. **数据抓取** - 多平台支持、检查点机制、速率限制
3. **内容处理** - 去重过滤、智能分类、质量评分
4. **输出分发** - 飞书多维表格、消息推送、JSON 导出

---

## 📺 支持渠道

| ID | 名称 | 类型 | 优先级 |
|----|------|------|--------|
| weibo | 微博 | 社会热点 | 高 |
| douyin | 抖音 | 社会热点 | 高 |
| bilibili | B 站 | 娱乐 | 中 |
| zhihu | 知乎 | 社会热点 | 高 |
| github | GitHub | GitHub 项目 | 高 |
| ainews | AI 新闻 | AI 动态 | 高 |

完整渠道配置详见 [references/channels.md](references/channels.md)

---

## 🔧 配置文件

**位置：** `config/channels.json`

```json
{
  "channels": [...],
  "output": {
    "feishu": { "enabled": true },
    "push": { "enabled": true }
  },
  "filters": {
    "dedup": true,
    "minScore": 50
  }
}
```

---

## 🔄 定时任务

**Cron 配置：** `~/.openclaw/config/cron.json`

```json
{
  "task": "早班新闻聚合",
  "schedule": "0 8 * * *",
  "script": "node {workspace}/skills/news-aggregator/scripts/fetch-all.mjs",
  "agent": "assistant-agent"
}
```

---

## 📁 文件结构

```
news-aggregator/
├── SKILL.md              # 技能文档（本文件）
├── config/
│   └── channels.json     # 渠道配置
├── references/
│   ├── channels.md       # 渠道详情
│   └── api-docs.md       # API 文档
└── scripts/
    ├── list-channels.mjs
    ├── manage-channels.mjs
    ├── fetch-all.mjs
    └── sync-feishu.mjs
```

---

## ⚠️ 注意事项

1. **速率限制** - 避免频繁请求触发反爬
2. **API Key** - 部分平台需要配置 API Key
3. **数据合规** - 遵守各平台使用条款

---

**版本：** v1.0  
**最后更新：** 2026-03-05
