#!/usr/bin/env node
/**
 * 同步抓取结果到飞书多维表格
 * 用法：node sync-feishu.mjs --date=YYYY-MM-DD
 */

import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../output');

const FEISHU_CONFIG = {
  appToken: 'TbOOb62kBarSJdsFjouca8Ubnae',
  tableId: 'tbl2tkIacs8sAVg3'
};

/**
 * 获取最新抓取结果
 */
function getLatestData(dateArg) {
  const date = dateArg === 'today' ? new Date().toISOString().split('T')[0] : dateArg;
  const jsonPath = join(OUTPUT_DIR, `news-${date}.json`);
  
  if (existsSync(jsonPath)) {
    return JSON.parse(readFileSync(jsonPath, 'utf-8'));
  }
  return null;
}

/**
 * 生成飞书 bitable 创建记录的脚本
 */
function generateSyncScript(items) {
  return `
const records = ${JSON.stringify(items)};
const FEISHU_CONFIG = {
  appToken: '${FEISHU_CONFIG.appToken}',
  tableId: '${FEISHU_CONFIG.tableId}'
};

async function main() {
  let success = 0;
  let failed = 0;
  
  for (const item of records) {
    try {
      const fields = {
        '文本': item.title.substring(0, 100),
        '来源平台': item.source,
        '热搜排名': item.rank,
        '链接': { text: '查看', link: item.url },
        '抓取日期': Date.now(),
        '内容类型': item.type
      };
      
      const result = await feishu_bitable_create_record({
        app_token: FEISHU_CONFIG.appToken,
        table_id: FEISHU_CONFIG.tableId,
        fields: fields
      });
      
      success++;
      console.log('  ✅ ' + item.title.substring(0, 30));
      
      // 速率限制
      await new Promise(r => setTimeout(r, 200));
      
    } catch (error) {
      failed++;
      console.log('  ❌ ' + item.title.substring(0, 30) + ' - ' + error.message.substring(0, 50));
    }
  }
  
  console.log('\\n✅ 同步完成！');
  console.log('📊 成功：' + success + ' 条');
  console.log('⚠️ 失败：' + failed + ' 条');
}

main().catch(console.error);
`;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const dateArg = args.find(a => a.startsWith('--date='))?.split('=')[1] || 'today';
  
  console.log('🚀 开始同步到飞书表格...\n');
  
  const items = getLatestData(dateArg);
  
  if (!items || items.length === 0) {
    console.log('❌ 未找到抓取数据，请先运行 fetch-all.mjs');
    return;
  }
  
  console.log(`📊 待同步数据：${items.length} 条\n`);
  
  // 生成临时脚本
  const scriptContent = generateSyncScript(items);
  const scriptFile = join(OUTPUT_DIR, 'sync-temp-script.mjs');
  
  try {
    // 写入临时脚本
    writeFileSync(scriptFile, scriptContent);
    
    // 使用 openclaw agent 执行（正确参数）
    console.log('📡 执行飞书同步...\n');
    
    const { execSync } = await import('child_process');
    execSync(`openclaw agent --message "执行脚本：node ${scriptFile}" --target isolated --timeout-seconds 300`, {
      encoding: 'utf-8',
      stdio: 'inherit',
      timeout: 5 * 60 * 1000
    });
    
    // 清理临时文件
    try { unlinkSync(scriptFile); } catch (e) {}
    
  } catch (error) {
    console.log('⚠️ 同步执行失败:', error.message);
    console.log('💡 将使用简化方案：直接输出前 20 条到日志');
    
    // 简化方案：只记录到日志
    items.slice(0, 20).forEach((item, i) => {
      console.log(`  📝 ${i + 1}. ${item.title.substring(0, 40)} (${item.source})`);
    });
    
    try { unlinkSync(scriptFile); } catch (e) {}
  }
  
  console.log('\n📬 查看表格：https://ecn8d40unst3.feishu.cn/base/TbOOb62kBarSJdsFjouca8Ubnae');
}

main().catch(console.error);
