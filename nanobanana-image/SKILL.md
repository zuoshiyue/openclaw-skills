---
name: nanobanana-image
description: >
  MXAPI Nano Banana 图片生成服务。根据文字描述生成小红书配图、封面图、插画等。
  Use when: 需要生成小红书图文配图、封面图、插画、AI 绘画等场景。
  配置：API Key 存储在 ~/.openclaw/config/nanobanana-config.json
---

# MXAPI Nano Banana 图片生成

## 配置

API Key 配置文件：`~/.openclaw/config/nanobanana-config.json`

**平台信息：**
- 平台：MXAPI (open.mxapi.org)
- 服务：Nano Banana AI 绘画
- 端点：`POST /api/v1/draw`
- 价格：约 ¥0.07/次

## 使用方法

### 生成单张图片

```bash
node {baseDir}/scripts/generate.mjs "提示词描述"
```

### 批量生成（小红书 7 页配图）

```bash
node {baseDir}/scripts/batch-generate.mjs --pages 7
```

### 查询余额

```bash
node {baseDir}/scripts/check-balance.mjs
```

## 提示词模板

详见 [references/prompt-templates.md](references/prompt-templates.md)

## 输出格式

```json
{
  "success": true,
  "image_url": "https://...",
  "generation_time": 3.5
}
```

## 注意事项

1. **避免生成文字** — AI 生成文字容易出错
2. **尺寸建议** — 小红书 1080x1440 (3:4)
3. **批量限制** — 一次不超过 10 张

## 脚本说明

| 脚本 | 功能 |
|------|------|
| `scripts/generate.mjs` | 生成单张图片 |
| `scripts/batch-generate.mjs` | 批量生成 |
| `scripts/check-balance.mjs` | 查询余额 |
| `scripts/upload-feishu.mjs` | 上传到飞书云文档 |
