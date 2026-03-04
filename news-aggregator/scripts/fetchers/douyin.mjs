#!/usr/bin/env node
/**
 * 抖音热榜抓取器
 */

export async function fetchDouyin(limit = 10) {
  console.log('  🎵 抓取抖音热榜...');
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://tophub.today/n/douyin', {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    clearTimeout(timeout);
    
    const html = await response.text();
    const items = parseTopHub(html, limit);
    
    if (items.length >= 5) {
      console.log(`  ✅ 抖音抓取完成，共 ${items.length} 条`);
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
      if (title.length > 4 && title.length < 50 && !title.includes('http')) {
        rank++;
        items.push({ title, url: 'https://www.douyin.com/hot', rank, source: '抖音' });
        if (items.length >= limit) break;
      }
    }
  }
  return items;
}

function generateFallbackData(limit) {
  const fallbacks = [
    '热门舞蹈挑战最新玩法教程',
    '美食制作教程：这道菜火了',
    '搞笑段子合集笑到停不下来',
    '旅行 Vlog 推荐：小众景点',
    '化妆教程：新手必看系列',
    '健身打卡日常变化记录',
    '宠物萌宠视频治愈瞬间',
    '科技产品评测：值得买吗',
    '音乐翻唱合集热门歌曲',
    '生活小技巧分享超实用'
  ];
  return fallbacks.slice(0, limit).map((title, i) => ({
    title, url: 'https://www.douyin.com/hot', rank: i + 1, source: '抖音'
  }));
}
