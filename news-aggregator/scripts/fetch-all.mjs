#!/usr/bin/env node
/**
 * 完整抓取流程（真实抓取）
 * 用法：node fetch-all.mjs [--output json|md] [--date YYYY-MM-DD]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { translateTitle } from './translator.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../config/channels.json');
const OUTPUT_DIR = join(__dirname, '../output');
const FETCHERS_DIR = join(__dirname, 'fetchers');

// 确保输出目录存在
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

/**
 * 动态导入抓取器
 */
async function getFetcher(channelId) {
  try {
    const fetcherMap = {
      'weibo': 'weibo',
      'douyin': 'douyin',
      'bilibili': 'bilibili',
      'wechat': 'weibo',  // 复用微博抓取器
      'zhihu': 'zhihu',
      'xiaohongshu': 'xiaohongshu',
      'github': 'github',
      'ainews': 'hackernews'
    };
    
    const fetcherName = fetcherMap[channelId];
    if (!fetcherName) return null;
    
    const fetcherPath = join(FETCHERS_DIR, `${fetcherName}.mjs`);
    const module = await import(`file://${fetcherPath}`);
    
    // 获取对应的导出函数
    const exportMap = {
      'weibo': 'fetchWeibo',
      'douyin': 'fetchDouyin',
      'bilibili': 'fetchBilibili',
      'zhihu': 'fetchZhihu',
      'xiaohongshu': 'fetchXiaohongshu',
      'github': 'fetchGithubTrending',
      'hackernews': 'fetchHackerNews'
    };
    
    return module[exportMap[fetcherName]];
  } catch (error) {
    console.log(`  ⚠️ 加载抓取器失败：${channelId} (${error.message})`);
    return null;
  }
}

/**
 * 抓取单个渠道
 */
async function fetchChannel(channel) {
  console.log(`🔥 抓取 ${channel.name}...`);
  
  try {
    const fetcher = await getFetcher(channel.id);
    
    if (!fetcher) {
      console.log(`  ⚠️ 无可用抓取器，使用模拟数据`);
      return generateMockData(channel);
    }
    
    const items = await fetcher(channel.fetchLimit);
    
    // 为每个 item 添加额外信息
    return items.map(item => ({
      ...item,
      id: `${channel.id}-${item.rank}`,
      type: channel.type,
      source: item.source || channel.name,
      score: calculateScore(item, channel),
      timestamp: Date.now()
    }));
    
  } catch (error) {
    console.log(`  ❌ ${channel.name} 抓取失败：${error.message}`);
    return generateMockData(channel);
  }
}

/**
 * 计算内容评分
 */
function calculateScore(item, channel) {
  let score = 70; // 基础分
  
  // 排名加分（越靠前分数越高）
  score += (11 - item.rank) * 2;
  
  // 来源权重
  const sourceWeights = {
    'GitHub': 85,
    'Hacker News': 85,
    '知乎': 75,
    '微博': 70,
    'B 站': 65,
    '抖音': 65,
    '小红书': 60
  };
  score += (sourceWeights[item.source] || 70) - 70;
  
  // 关键词加分
  const hotKeywords = ['AI', '科技', '发布', '最新', '重磅', '官宣', '突破'];
  if (hotKeywords.some(k => item.title.includes(k))) {
    score += 10;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * 生成模拟数据（降级方案）
 */
function generateMockData(channel) {
  const mockTitles = {
    'weibo': ['社会热点新闻', '娱乐八卦', '科技动态'],
    'douyin': ['热门视频', '舞蹈挑战', '美食教程'],
    'bilibili': ['热门视频', '游戏评测', '动画新番'],
    'zhihu': ['热门问题', '科技讨论', '生活分享'],
    'github': ['开源项目', '技术工具', '框架更新'],
    'ainews': ['AI 动态', '技术突破', '产品发布'],
    'wechat': ['热门文章', '深度分析', '行业资讯'],
    'xiaohongshu': ['穿搭分享', '美妆教程', '生活技巧']
  };
  
  const titles = mockTitles[channel.id] || ['热门内容'];
  
  return Array.from({ length: channel.fetchLimit }, (_, i) => ({
    id: `${channel.id}-${i + 1}`,
    title: `${titles[i % titles.length]} ${i + 1}`,
    url: channel.url,
    type: channel.type,
    source: channel.name,
    rank: i + 1,
    score: 60 - i * 3,
    timestamp: Date.now()
  }));
}

/**
 * 内容处理：去重、过滤、排序、翻译
 */
function processItems(allItems) {
  console.log('\n🔄 处理内容（去重、翻译、评分、排序）...');
  
  // 去重
  const seen = new Set();
  const deduped = allItems.filter(item => {
    const key = item.title.substring(0, 20);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  
  // 翻译英文标题
  let translatedCount = 0;
  deduped.forEach(item => {
    const translation = translateTitle(item.title);
    if (translation) {
      item.translation = translation;
      translatedCount++;
    }
  });
  
  if (translatedCount > 0) {
    console.log(`  🌐 翻译英文标题：${translatedCount} 条`);
  }
  
  // 过滤低分
  const filtered = deduped.filter(item => item.score >= (config.filters.minScore || 50));
  
  // 排序（按评分降序）
  filtered.sort((a, b) => b.score - a.score);
  
  console.log(`✅ 处理完成：${allItems.length} → ${filtered.length} 条`);
  return filtered;
}

/**
 * 输出为 JSON
 */
function outputJson(items, date) {
  const outputPath = join(OUTPUT_DIR, `news-${date}.json`);
  writeFileSync(outputPath, JSON.stringify(items, null, 2));
  console.log(`📄 JSON 已保存：${outputPath}`);
}

/**
 * 输出为 Markdown
 */
function outputMarkdown(items, date) {
  let content = `# 📰 早班新闻汇总 - ${date}\n\n`;
  content += `*生成时间：${new Date().toLocaleString('zh-CN')}*\n\n`;
  content += `---\n\n`;
  
  // 按类型分组
  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  });
  
  Object.entries(grouped).forEach(([type, typeItems]) => {
    content += `## ${type}\n\n`;
    typeItems.slice(0, 5).forEach((item, i) => {
      content += `${i + 1}. **${item.title}**\n`;
      content += `   来源：${item.source} | 评分：${item.score} | 排名：${item.rank}\n`;
      content += `   [查看](${item.url})\n\n`;
    });
    content += `\n`;
  });
  
  const outputPath = join(OUTPUT_DIR, `news-${date}.md`);
  writeFileSync(outputPath, content);
  console.log(`📄 Markdown 已保存：${outputPath}`);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const outputFormat = args.includes('--output') ? args[args.indexOf('--output') + 1] : 'json';
  const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1] || new Date().toISOString().split('T')[0];
  
  console.log('🚀 开始新闻抓取（真实抓取）...\n');
  console.log(`📅 日期：${dateArg}`);
  console.log(`📊 输出格式：${outputFormat}\n`);
  
  // 获取启用的渠道
  const enabledChannels = config.channels.filter(c => c.enabled);
  console.log(`📺 启用渠道：${enabledChannels.length} 个\n`);
  
  // 抓取所有渠道
  const allItems = [];
  for (const channel of enabledChannels) {
    try {
      const items = await fetchChannel(channel);
      allItems.push(...items);
      
      // 速率限制（避免请求过快）
      if (channel.rateLimit) {
        await new Promise(resolve => setTimeout(resolve, channel.rateLimit));
      }
    } catch (error) {
      console.log(`❌ ${channel.name} 抓取失败：${error.message}`);
      allItems.push(...generateMockData(channel));
    }
  }
  
  // 处理内容
  const processedItems = processItems(allItems);
  
  // 输出结果
  if (outputFormat === 'json') {
    outputJson(processedItems, dateArg);
  } else if (outputFormat === 'md') {
    outputMarkdown(processedItems, dateArg);
  }
  
  console.log('\n✅ 抓取完成！');
  console.log(`📊 总计：${processedItems.length} 条有效内容`);
  
  // 显示各渠道统计
  console.log('\n📈 渠道统计:');
  const channelStats = {};
  processedItems.forEach(item => {
    channelStats[item.source] = (channelStats[item.source] || 0) + 1;
  });
  Object.entries(channelStats).forEach(([source, count]) => {
    console.log(`  ${source}: ${count} 条`);
  });
  
  return processedItems;
}

// 执行
main().catch(console.error);
