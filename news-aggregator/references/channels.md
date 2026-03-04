# 渠道配置详情

## 默认渠道（8 个）

| ID | 名称 | 类型 | 优先级 | 状态 |
|----|------|------|--------|------|
| weibo | 微博 | 社会热点 | 高 | ✅ |
| douyin | 抖音 | 社会热点 | 高 | ✅ |
| bilibili | B 站 | 娱乐 | 中 | ✅ |
| wechat | 微信 | 社会热点 | 高 | ✅ |
| zhihu | 知乎 | 社会热点 | 高 | ✅ |
| xiaohongshu | 小红书 | 其他 | 低 | ✅ |
| github | GitHub | GitHub 项目 | 高 | ✅ |
| ainews | AI 新闻 | AI 动态 | 高 | ✅ |

## 内容类型分类

- **社会热点** - 微博、抖音、微信、知乎
- **科技新闻** - GitHub、AI 新闻
- **娱乐** - B 站
- **其他** - 小红书

## 添加新渠道

```bash
node scripts/manage-channels.mjs add "Product Hunt" "https://www.producthunt.com" "科技新闻"
```

## 渠道配置示例

```json
{
  "id": "weibo",
  "name": "微博",
  "url": "https://weibo.com/hot",
  "type": "社会热点",
  "priority": "high",
  "enabled": true,
  "fetchLimit": 10,
  "rateLimit": 1000
}
```

## 抓取器开发

在 `scripts/fetchers/` 创建新文件：

```javascript
// scripts/fetchers/custom-fetcher.mjs
export async function fetchCustom() {
  // 实现抓取逻辑
  return [
    { title: '...', rank: 1, url: '...', type: '...' }
  ];
}
```
