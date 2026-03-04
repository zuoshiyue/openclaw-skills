#!/usr/bin/env node
/**
 * 管理渠道（启用/禁用/添加）
 * 用法：
 *   node manage-channels.mjs enable <id>
 *   node manage-channels.mjs disable <id>
 *   node manage-channels.mjs add <name> <url> <type>
 *   node manage-channels.mjs remove <id>
 *   node manage-channels.mjs list
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../config/channels.json');

function loadConfig() {
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
}

function saveConfig(config) {
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
}

function enableChannel(id) {
  const config = loadConfig();
  const channel = config.channels.find(c => c.id === id);
  if (!channel) {
    console.log(`❌ 未找到渠道：${id}`);
    return;
  }
  channel.enabled = true;
  saveConfig(config);
  console.log(`✅ 已启用渠道：${channel.name} (${id})`);
}

function disableChannel(id) {
  const config = loadConfig();
  const channel = config.channels.find(c => c.id === id);
  if (!channel) {
    console.log(`❌ 未找到渠道：${id}`);
    return;
  }
  channel.enabled = false;
  saveConfig(config);
  console.log(`✅ 已禁用渠道：${channel.name} (${id})`);
}

function addChannel(name, url, type) {
  const config = loadConfig();
  const id = name.toLowerCase().replace(/\s+/g, '-');
  
  if (config.channels.find(c => c.id === id)) {
    console.log(`⚠️ 渠道已存在：${id}`);
    return;
  }
  
  config.channels.push({
    id,
    name,
    url,
    type: type || '其他',
    priority: 'medium',
    enabled: true,
    fetchLimit: 10,
    rateLimit: 1000
  });
  
  saveConfig(config);
  console.log(`✅ 已添加渠道：${name} (${id})`);
}

function removeChannel(id) {
  const config = loadConfig();
  const index = config.channels.findIndex(c => c.id === id);
  if (index === -1) {
    console.log(`❌ 未找到渠道：${id}`);
    return;
  }
  const removed = config.channels.splice(index, 1)[0];
  saveConfig(config);
  console.log(`✅ 已移除渠道：${removed.name} (${id})`);
}

// 主逻辑
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'enable':
    enableChannel(args[1]);
    break;
  case 'disable':
    disableChannel(args[1]);
    break;
  case 'add':
    addChannel(args[1], args[2], args[3]);
    break;
  case 'remove':
    removeChannel(args[1]);
    break;
  case 'list':
  default:
    console.log('📺 渠道管理工具\n');
    console.log('用法:');
    console.log('  node manage-channels.mjs enable <id>    - 启用渠道');
    console.log('  node manage-channels.mjs disable <id>   - 禁用渠道');
    console.log('  node manage-channels.mjs add <name> <url> <type> - 添加渠道');
    console.log('  node manage-channels.mjs remove <id>    - 移除渠道');
    console.log('  node manage-channels.mjs list           - 显示此帮助\n');
    break;
}
