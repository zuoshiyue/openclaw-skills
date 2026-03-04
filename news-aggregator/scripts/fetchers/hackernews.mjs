#!/usr/bin/env node
/**
 * Hacker News (AI 新闻) 抓取器
 * 来源：https://news.ycombinator.com/
 */

export async function fetchHackerNews(limit = 10) {
  console.log('  🤖 抓取 Hacker News...');
  
  try {
    // 使用官方 API
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await response.json();
    
    const items = [];
    
    // 获取前 limit 篇文章的详情
    for (let i = 0; i < Math.min(ids.length, limit); i++) {
      try {
        const itemResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ids[i]}.json`);
        const item = await itemResponse.json();
        
        if (item && item.title) {
          items.push({
            title: item.title,
            url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
            rank: i + 1,
            source: 'Hacker News',
            score: item.score || 0
          });
        }
      } catch (e) {
        // 跳过失败的项目
      }
    }
    
    console.log(`  ✅ Hacker News 抓取完成，共 ${items.length} 条`);
    return items;
    
  } catch (error) {
    console.log(`  ❌ Hacker News 抓取失败：${error.message}`);
    return generateFallbackData(limit);
  }
}

function generateFallbackData(limit) {
  const fallbacks = [
    'AI 技术最新突破',
    '开源项目推荐',
    '科技大厂动态',
    '程序员职业发展',
    '新技术趋势分析',
    '创业公司融资消息',
    '技术大会报道',
    '产品发布资讯',
    '行业动态分析',
    '技术教程分享'
  ];
  
  return fallbacks.slice(0, limit).map((title, i) => ({
    title,
    url: 'https://news.ycombinator.com/',
    rank: i + 1,
    source: 'Hacker News'
  }));
}
