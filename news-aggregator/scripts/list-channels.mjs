#!/usr/bin/env node
/**
 * 列出已配置的渠道
 * 用法：node list-channels.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '../config/channels.json');

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));

console.log('\n📺 已配置渠道 (%d 个)\n', config.channels.length);

const priorityMap = { high: '高', medium: '中', low: '低' };

config.channels.forEach((channel, index) => {
  const status = channel.enabled ? '✅' : '❌';
  const priority = priorityMap[channel.priority] || channel.priority;
  console.log(`${status} ${channel.name} (${channel.id}) - ${channel.type} - 优先级：${priority}`);
});

console.log('\n💡 使用 manage-channels.mjs 启用/禁用/添加渠道\n');
