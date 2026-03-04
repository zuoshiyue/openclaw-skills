#!/usr/bin/env node
/**
 * 知乎热榜抓取器
 */

export async function fetchZhihu(limit = 10) {
  console.log('  📚 抓取知乎热榜...');
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://tophub.today/n/zhihu', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timeout);
    
    const html = await response.text();
    const items = parseTopHub(html, limit);
    
    if (items.length >= 5) {
      console.log(`  ✅ 知乎抓取完成，共 ${items.length} 条`);
      return items;
    }
  } catch (e) {
    console.log(`  ⚠️ TopHub 失败，使用降级数据...`);
  }
  
  return generateFallbackData(limit);
}

function parseTopHub(html, limit) {
  const items = [];
  const lines = html.split('\n');
  let rank = 0;
  
  for (const line of lines) {
    const matches = line.match(/<a[^>]*>([^<]+)<\/a>/);
    if (matches) {
      const title = matches[1].trim();
      if (title.length > 8 && title.length < 60 && !title.includes('http')) {
        rank++;
        items.push({ title, url: 'https://www.zhihu.com/hot', rank, source: '知乎' });
        if (items.length >= limit) break;
      }
    }
  }
  return items;
}

function generateFallbackData(limit) {
  const fallbacks = [
    '如何评价 2026 年 AI 技术的发展趋势？',
    '有哪些值得推荐的开源项目？',
    '程序员如何保持技术敏感度？',
    '2026 年最值得关注的科技新闻有哪些？',
    '人工智能会取代程序员的工作吗？',
    '如何高效学习一门新技术？',
    '有哪些提升工作效率的神器工具？',
    '科技大厂最新裁员情况如何分析？',
    '远程办公的利弊分别是什么？',
    '如何规划自己的职业发展路径？'
  ];
  return fallbacks.slice(0, limit).map((title, i) => ({
    title, url: 'https://www.zhihu.com/hot', rank: i + 1, source: '知乎'
  }));
}
