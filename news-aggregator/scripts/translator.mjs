#!/usr/bin/env node
/**
 * 简单英文翻译器 - 使用内置词典 + 规则
 * 不使用外部 API，快速翻译常见英文标题
 */

// 常见技术术语词典
const TECH_DICT = {
  // 公司和品牌
  'OpenAI': 'OpenAI',
  'Meta': 'Meta',
  'Google': '谷歌',
  'Microsoft': '微软',
  'Apple': '苹果',
  'Tesla': '特斯拉',
  'Amazon': '亚马逊',
  'Facebook': '脸书',
  'Twitter': '推特',
  'GitHub': 'GitHub',
  
  // 技术术语
  'AI': 'AI',
  'Artificial Intelligence': '人工智能',
  'Machine Learning': '机器学习',
  'Deep Learning': '深度学习',
  'Neural Network': '神经网络',
  'LLM': '大语言模型',
  'API': 'API',
  'SDK': 'SDK',
  'Open Source': '开源',
  'Data Privacy': '数据隐私',
  'Cybersecurity': '网络安全',
  'Smart Glasses': '智能眼镜',
  
  // 开发相关
  'Python': 'Python',
  'JavaScript': 'JavaScript',
  'TypeScript': 'TypeScript',
  'React': 'React',
  'Vue': 'Vue',
  'Angular': 'Angular',
  'Node.js': 'Node.js',
  'Docker': 'Docker',
  'Kubernetes': 'K8s',
  'Framework': '框架',
  'Library': '库',
  'Tool': '工具',
  
  // 动作
  'Launches': '发布',
  'Releases': '发布',
  'Announces': '宣布',
  'Unveils': '发布',
  'Introduces': '推出',
  'Updates': '更新',
  'Fixes': '修复',
  'Improves': '改进',
  'Adds': '添加',
  'Removes': '移除',
  'Acquires': '收购',
  'Launch': '发布',
  'Release': '发布',
  'Announcement': '公告',
  'Update': '更新',
  'Fix': '修复',
  'Feature': '功能',
  'Bug': '漏洞',
  'Version': '版本',
  
  // 描述词
  'Revolutionary': '革命性',
  'Innovative': '创新',
  'Powerful': '强大',
  'Efficient': '高效',
  'Secure': '安全',
  'Fast': '快速',
  'Advanced': '先进',
  'Popular': '热门',
  'Trending': '趋势',
  'Breaking': '突发',
  'Exclusive': '独家',
  'Official': '官方',
  'Major': '重大',
  'Critical': '严重',
  'Important': '重要',
  'Controversy': '争议',
  'Concerns': '担忧',
  'Issues': '问题',
  'Report': '报告',
  'Study': '研究',
  'Research': '研究',
  'Analysis': '分析',
  'Review': '评测',
  'Guide': '指南',
  'Tutorial': '教程',
  
  // 常用词
  'and': '与',
  'of': '的',
  'in': '在',
  'on': '在',
  'to': '到',
  'for': '为',
  'from': '从',
  'with': '与',
  'by': '由',
  'about': '关于',
  'after': '之后',
  'before': '之前',
  'New': '新',
  'Latest': '最新',
  'Best': '最佳',
  'Top': '顶级',
  'How to': '如何',
  'What': '什么',
  'Why': '为什么',
  'When': '何时'
};

// 检测是否主要是英文
function isEnglish(text) {
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  return englishChars / totalChars > 0.5;
}

// 翻译函数
export function translateTitle(title) {
  if (!isEnglish(title)) {
    return null;
  }
  
  let translated = title;
  
  // 按长度排序，先替换长短语
  const sortedKeys = Object.keys(TECH_DICT).sort((a, b) => b.length - a.length);
  
  sortedKeys.forEach(en => {
    const zh = TECH_DICT[en];
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, zh);
  });
  
  // 清理多余空格
  translated = translated.replace(/\s+/g, ' ').trim();
  
  // 如果翻译后和原文一样，返回 null
  if (translated === title) {
    return null;
  }
  
  return translated;
}

// 测试
if (process.argv[2]) {
  const test = process.argv.slice(2).join(' ');
  const result = translateTitle(test);
  console.log('原文:', test);
  console.log('译文:', result || '保持原文');
}
