# 📚 新闻聚合技能学习报告

**调研时间：** 2026-03-03  
**调研范围：** GitHub 开源项目、RSS 聚合器、AI 摘要工具

---

## 🔍 调研到的核心项目

### 1. FreshRSS (⭐ 最成熟)
**GitHub:** https://github.com/FreshRSS/FreshRSS  
**语言:** PHP | **Stars:** 10k+ | **状态:** 活跃（2026-03-02 更新）

**核心特性：**
- ✅ 自托管 RSS 聚合器
- ✅ 多用户支持 + 匿名阅读模式
- ✅ WebSub 实时推送（WordPress、Medium 等）
- ✅ XPath 网页抓取（无 RSS 网站）
- ✅ 扩展系统（插件机制）
- ✅ 移动端 API（Google Reader API）
- ✅ 命令行工具

**可借鉴设计：**
1. **扩展系统** - 插件化架构，支持自定义功能
2. **网页抓取** - XPath 配置，无需写代码即可抓取新网站
3. **多 API 支持** - 同时支持 Google Reader 和 Fever API
4. **用户查询** - 支持保存搜索条件，生成自定义 RSS

---

### 2. hacker-news-digest (⭐ AI 摘要最佳实践)
**GitHub:** https://github.com/polyrabbit/hacker-news-digest  
**语言:** Python | **状态:** 活跃（2026-02-18 更新）

**核心特性：**
- ✅ ChatGPT 自动生成文章摘要
- ✅ 自动配图（为每篇文章找插图）
- ✅ 本地 T5 模型降级方案
- ✅ RSS 全文支持
- ✅ 多语言翻译（中文版）
- ✅ GitHub Pages 静态部署

**工作流程：**
```
解析 HN 页面 → 提取正文 → 找插图 → AI 摘要 → 渲染模板 → 部署
```

**可借鉴设计：**
1. **AI 摘要 + 降级** - 优先用 ChatGPT，失败时用本地模型
2. **自动配图** - 提升可读性
3. **静态部署** - 低成本、高性能
4. **翻译集成** - 一步完成翻译

---

### 3. feeds.fun (⭐ AI 评分 + 标签)
**GitHub:** https://github.com/Tiendil/feeds.fun  
**语言:** Python | **状态:** 活跃（2026-02-28 更新）

**核心特性：**
- ✅ RSS 阅读器 + AI 摘要
- ✅ 智能标签系统
- ✅ 内容评分（AI 判断重要性）
- ✅ 个性化推荐

**可借鉴设计：**
1. **AI 评分** - 根据用户偏好自动评分
2. **标签系统** - 自动分类 + 手动标签

---

### 4. 其他参考项目

| 项目 | 特点 | 参考价值 |
|------|------|---------|
| newspaper3k | Python 新闻提取库 | 正文提取算法 |
| trafilatura | 网页内容提取工具 | 多格式输出（CSV/JSON/MD） |
| liferea | Linux 桌面阅读器 | 本地客户端设计 |
| Newsboat | 终端 RSS 阅读器 | 轻量级方案 |

---

## 💡 可整合的功能建议

### 短期（v1.1 - 1 周内）

| 功能 | 来源 | 实现难度 | 优先级 |
|------|------|---------|--------|
| **AI 摘要生成** | hacker-news-digest | 中 | 🔥 高 |
| **内容评分系统** | feeds.fun | 低 | 🔥 高 |
| **XPath 网页抓取配置** | FreshRSS | 中 | 🔥 高 |
| **RSS 输出** | 多个项目 | 低 | 中 |

### 中期（v2.0 - 1 个月内）

| 功能 | 来源 | 实现难度 | 优先级 |
|------|------|---------|--------|
| **插件系统** | FreshRSS | 高 | 中 |
| **自动配图** | hacker-news-digest | 中 | 中 |
| **多语言翻译** | hacker-news-digest | 中 | 低 |
| **移动端 API** | FreshRSS | 高 | 低 |

### 长期（v3.0+）

| 功能 | 来源 | 实现难度 | 优先级 |
|------|------|---------|--------|
| **WebSub 实时推送** | FreshRSS | 高 | 低 |
| **多用户系统** | FreshRSS | 高 | 低 |
| **本地 AI 模型降级** | hacker-news-digest | 中 | 中 |

---

## 📋 当前技能差距分析

### ✅ 已有功能
- [x] 多渠道配置管理
- [x] 基础抓取框架
- [x] 飞书表格同步
- [x] 去重过滤
- [x] 检查点机制

### ❌ 缺失功能（需补充）

| 功能 | 重要性 | 建议实现方式 |
|------|--------|-------------|
| **真实抓取逻辑** | 🔥 必须 | 各平台 API/爬虫 |
| **AI 摘要** | 🔥 必须 | 调用 LLM API |
| **内容评分** | 高 | 规则 + AI 结合 |
| **XPath 配置抓取** | 高 | 配置文件驱动 |
| **RSS 输出** | 中 | 标准 RSS 2.0 |
| **自动配图** | 中 | 图片搜索 API |
| **插件系统** | 低 | 预留接口 |

---

## 🎯 下一步行动计划

### 第 1 步：实现真实抓取（优先级：🔥）
```javascript
// 为每个渠道实现真实抓取器
skills/news-aggregator/scripts/fetchers/
├── weibo.mjs      // 微博热搜 API
├── github.mjs     // GitHub Trending API
├── zhihu.mjs      // 知乎热榜 API
└── ...
```

### 第 2 步：集成 AI 摘要（优先级：🔥）
```javascript
// 调用现有 LLM 接口生成摘要
async function generateSummary(article) {
  const prompt = `用 50 字总结这篇文章：${article.content}`;
  return await callLLM(prompt);
}
```

### 第 3 步：内容评分系统（优先级：高）
```javascript
// 综合评分 = 来源权重 + 热度 + 关键词匹配
function calculateScore(item) {
  let score = 50; // 基础分
  score += item.rank * -5; // 排名越靠前分数越高
  score += SOURCE_WEIGHTS[item.source] || 0;
  score += matchKeywords(item.title) ? 20 : 0;
  return score;
}
```

### 第 4 步：XPath 配置抓取（优先级：高）
```json
// config/scrapers.json
{
  "example.com": {
    "url": "https://example.com/news",
    "items": "//div[@class='news-item']",
    "title": ".//h2/text()",
    "link": ".//a/@href"
  }
}
```

### 第 5 步：RSS 输出（优先级：中）
```javascript
// 生成标准 RSS 2.0
function generateRSS(items) {
  return `<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <title>早间新闻</title>
    ${items.map(item => `
    <item>
      <title>${item.title}</title>
      <link>${item.url}</link>
      <description>${item.summary}</description>
    </item>
    `).join('')}
  </channel>
</rss>`;
}
```

---

## 📊 架构优化建议

### 当前架构
```
配置 → 抓取 → 处理 → 输出
```

### 优化后架构
```
┌─────────────┐
│  渠道配置   │
│  (JSON)     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  抓取引擎   │────▶│  XPath 引擎  │
│  (插件化)   │     │  (配置驱动)  │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│  AI 处理层   │
│  - 摘要     │
│  - 评分     │
│  - 分类     │
│  - 翻译     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│      输出层             │
│  ┌─────┬─────┬─────┐   │
│  │飞书 │ RSS │ JSON│   │
│  └─────┴─────┴─────┘   │
└─────────────────────────┘
```

---

## 🔑 关键技术决策

### 1. AI 摘要服务选择
| 选项 | 优点 | 缺点 | 推荐 |
|------|------|------|------|
| 调用现有 LLM | 快速集成、质量好 | 成本、依赖 | ✅ 首选 |
| 本地模型 (T5) | 免费、离线 | 质量一般、资源占用 | 降级方案 |
| 混合模式 | 兼顾两者 | 实现复杂 | ✅ 最佳 |

### 2. 抓取方式选择
| 选项 | 适用场景 | 推荐 |
|------|---------|------|
| 官方 API | 有开放 API 的平台 | ✅ 优先 |
| RSS/Atom | 支持 RSS 的网站 | ✅ 优先 |
| XPath 配置 | 无 API 的静态网站 | ✅ 推荐 |
| 自定义爬虫 | 复杂动态网站 | 按需 |

### 3. 数据存储
| 选项 | 优点 | 缺点 | 推荐 |
|------|------|------|------|
| 飞书表格 | 已配置、可视化 | API 限制 | ✅ 当前 |
| SQLite | 本地、快速 | 无共享 | 备选 |
| PostgreSQL | 强大、可扩展 | 运维成本 | 长期 |

---

## 📝 总结

### 学到的核心经验

1. **FreshRSS** - 插件化架构 + XPath 配置抓取是最灵活的设计
2. **hacker-news-digest** - AI 摘要 + 自动配图大幅提升用户体验
3. **feeds.fun** - AI 评分系统实现个性化推荐

### 我们的差异化优势

1. ✅ **飞书深度集成** - 直接同步表格 + 推送
2. ✅ **检查点机制** - 中断恢复，适合定时任务
3. ✅ **多渠道统一管理** - 社交媒体 + 技术社区
4. ✅ **轻量级设计** - Node.js 脚本，易部署

### 下一步优先级

```
真实抓取 > AI 摘要 > 内容评分 > XPath 配置 > RSS 输出
```

---

**报告生成：** muse  
**参考项目：** 4 个核心项目 + 10+ 相关项目  
**建议实施周期：** 2 周（v1.1） → 1 个月（v2.0）
