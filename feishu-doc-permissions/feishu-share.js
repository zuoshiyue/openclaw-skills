#!/usr/bin/env node
/**
 * 飞书文档分享脚本
 * 用法：node feishu-share.js <doc_token> <doc_title>
 */

const docToken = process.argv[2];
const docTitle = process.argv[3] || '飞书文档';
const userId = 'ou_81ff6a748bdc9a5b1d69c253fcbaea90';

console.log(`📝 分享文档：${docTitle}`);
console.log(`   链接：https://feishu.cn/docx/${docToken}`);
console.log(`   用户：${userId}`);
console.log('');
console.log('由于飞书 API 限制，请手动设置文档权限：');
console.log('1. 打开文档链接');
console.log('2. 点击右上角 "分享"');
console.log('3. 添加用户为 "可编辑"');
console.log('');
console.log('或者使用飞书机器人发送分享消息给用户。');
