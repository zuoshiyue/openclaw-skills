/**
 * 抓取器索引 - 统一导出所有平台抓取器
 */

export { fetchWeibo } from './weibo.mjs';
export { fetchDouyin } from './douyin.mjs';
export { fetchBilibili } from './bilibili.mjs';
export { fetchZhihu } from './zhihu.mjs';
export { fetchXiaohongshu } from './xiaohongshu.mjs';
export { fetchGithubTrending } from './github.mjs';
export { fetchHackerNews } from './hackernews.mjs';

// 微信使用 TopHub 聚合（与微博相同源）
export { fetchWeibo as fetchWechat } from './weibo.mjs';
