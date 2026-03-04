---
name: tavily-search
description: >
  Tavily AI 优化搜索引擎。为 AI Agent 提供精准、简洁的搜索结果。
  Use when: 需要联网搜索、查证事实、获取最新信息、研究复杂问题。
  配置：TAVILY_API_KEY 环境变量
homepage: https://tavily.com
metadata: {"clawdbot":{"emoji":"🔍","requires":{"bins":["node"],"env":["TAVILY_API_KEY"]}}}
---

# Tavily Search

AI 优化的搜索引擎，返回干净、相关的结果。

## 快速开始

```bash
# 基础搜索
node {baseDir}/scripts/search.mjs "查询内容"

# 指定结果数量
node {baseDir}/scripts/search.mjs "查询内容" -n 10

# 深度研究
node {baseDir}/scripts/search.mjs "查询内容" --deep

# 新闻搜索
node {baseDir}/scripts/search.mjs "查询内容" --topic news
```

## 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-n <count>` | 结果数量 | 5 (max: 20) |
| `--deep` | 深度研究模式 | 否 |
| `--topic news` | 新闻搜索 | general |
| `--days <n>` | 新闻时间范围 | - |

## URL 内容提取

```bash
node {baseDir}/scripts/extract.mjs "https://example.com/article"
```

## 配置

**API Key:** https://tavily.com

```bash
export TAVILY_API_KEY="your_key"
```

## 使用建议

- **常规搜索** — 默认参数即可
- **复杂问题** — 使用 `--deep` 模式
- **时事新闻** — 使用 `--topic news`
- **查证事实** — 交叉验证多个来源

详见 [references/api-docs.md](references/api-docs.md)
