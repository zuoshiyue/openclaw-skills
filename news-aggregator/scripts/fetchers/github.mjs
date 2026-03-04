#!/usr/bin/env node
/**
 * GitHub Trending 抓取器
 * 来源：https://github.com/trending
 */

export async function fetchGithubTrending(limit = 10) {
  console.log('  📦 抓取 GitHub Trending...');
  
  try {
    const response = await fetch('https://github.com/trending', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)'
      }
    });
    const html = await response.text();
    
    const items = parseHtml(html, limit);
    
    if (items.length > 0) {
      console.log(`  ✅ GitHub 抓取完成，共 ${items.length} 条`);
      return items;
    }
    
    throw new Error('解析失败');
    
  } catch (error) {
    console.log(`  ⚠️ GitHub 抓取失败：${error.message}`);
    return generateFallbackData(limit);
  }
}

function parseHtml(html, limit) {
  const items = [];
  
  // 匹配 GitHub trending 的仓库名格式：owner/repo
  const repoRegex = /<a[^>]*href="\/([^"/]+\/[^"/]+)"[^>]*>/g;
  let match;
  let rank = 0;
  
  while ((match = repoRegex.exec(html)) !== null && items.length < limit) {
    const repo = match[1];
    
    // 验证是有效的仓库名格式
    if (repo.match(/^[\w-]+\/[\w-]+$/)) {
      rank++;
      items.push({
        title: repo,
        description: '',
        url: `https://github.com/${repo}`,
        rank: rank,
        source: 'GitHub'
      });
    }
  }
  
  return items;
}

function generateFallbackData(limit) {
  const fallbacks = [
    'openclaw/openclaw',
    'microsoft/vscode',
    'facebook/react',
    'python/cpython',
    'nodejs/node',
    'docker/compose',
    'kubernetes/kubernetes',
    'tensorflow/tensorflow',
    'vercel/next.js',
    'rust-lang/rust'
  ];
  
  return fallbacks.slice(0, limit).map((repo, i) => ({
    title: repo,
    description: '',
    url: `https://github.com/${repo}`,
    rank: i + 1,
    source: 'GitHub'
  }));
}
