# 小红书全自动图文 SOP - 搭建指南（飞书版）

## 📋 前置准备

### 1. 账号准备

- [x] 飞书账号（已配置 ✅）— 6 个机器人可用
- [ ] 小红书账号（用于发布）
- [ ] SophNet 账号（可选，用于一键部署 OpenClaw）

### 2. 飞书应用配置

**✅ 已完成配置** — 使用现有飞书机器人：

| 机器人 | 用途 |
|--------|------|
| main | 日常对话、任务执行 |
| nova | 早报、进化报告 |
| alpha | 基金分析 |
| sentry | 系统告警 |
| zero | 代码任务 |

**如需新建应用：**
1. 登录 https://open.feishu.cn
2. 创建企业自建应用
3. 开通权限：云文档、多维表格、机器人
4. 获取 App ID 和 App Secret

### 3. 图片生成（可选）
- Nano Banana API
- 或 Stable Diffusion API
- 或 Midjourney API
- 或用 AI 生成配图描述，手动配图

---

## 🚀 搭建步骤

### 步骤 1：创建飞书多维表格

1. 打开飞书 → 云文档 → 新建多维表格
2. 按 `bitable-template.md` 创建字段
3. 命名为「小红书内容生产管理」
4. 复制表格 Token（URL 中的部分）

### 步骤 2：配置飞书应用

创建配置文件 `~/.openclaw/config/feishu-app-config.json`：

```json
{
  "feishu": {
    "app_id": "cli_xxxxx",
    "app_secret": "xxxxx",
    "bot_name": "小红书 SOP 助手"
  }
}
```

### 步骤 3：安装依赖

```bash
# 飞书 SDK（如未安装）
pip3 install requests

# 或使用 Homebrew Python
/opt/homebrew/bin/python3.12 -m pip install requests
```

### 步骤 4：配置小红书 MCP（可选，有封号风险）

```bash
# 方式 1：Docker（推荐）
docker run -d --name xiaohongshu-mcp \
  -p 18060:18060 \
  --platform linux/amd64 \
  xpzouying/xiaohongshu-mcp

# 配置到 mcporter
mcporter config add xiaohongshu http://localhost:18060/mcp

# 方式 2：本地运行（需要 Cookie）
# 详见 https://github.com/xpzouying/xiaohongshu-mcp
```

### 步骤 5：测试流程

```bash
# 1. 测试飞书图片上传
python3 /Users/zuoshiyue/.openclaw/workspace/skills/xiaohongshu-sop/test-feishu-upload.py

# 2. 测试内容生成
# 告诉 AI："帮我解析这篇文章生成小红书图文：https://mp.weixin.qq.com/s/xxx"

# 3. 测试飞书写入
# 告诉 AI："把生成的内容写入飞书多维表格"
```

---

## 📊 完整流程图

```
┌─────────────────┐
│  输入：链接/关键词  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  内容解析/搜索    │
│  (Jina Reader)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  小红书格式重组   │
│  (AI 生成)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  图片生成        │
│  (Nano Banana)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  图片上传飞书    │
│  (云文档存储)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  写入飞书表格    │
│  (结构化存储)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  人工确认发布    │
│  (降低封号风险)  │
└─────────────────┘
```

---

## ⚠️ 注意事项

1. **封号风险** — 自动发布可能触发平台风控，建议人工确认
2. **内容合规** — 避免敏感词、虚假宣传
3. **图片版权** — 确保生成图片可商用
4. **频率控制** — 不要短时间大量发布
5. **Cookie 安全** — 使用专用小号，不要用主账号

---

## 💡 进阶优化

1. **Prompt 优化 Skill** — 持续改进生成质量
2. **热点监控** — 自动抓取热搜关键词
3. **数据分析** — 发布后自动追踪互动数据
4. **A/B 测试** — 测试不同标题/封面的效果

---

## 📞 问题排查

| 问题 | 可能原因 | 解决方案 |
|------|---------|---------|
| 飞书上传失败 | 权限不足 | 检查应用权限配置 |
| 飞书写入失败 | Token 错误 | 检查表格 Token |
| 小红书 MCP 连不上 | Docker 未启动 | `docker ps` 检查 |
| 图片生成失败 | API Key 过期 | 续费或更换 |

---

**搭建完成后，告诉 AI："开始生成小红书图文"，即可启动自动化流程。**
