# 小红书 SOP 快速配置指南

## ✅ 已完成

- [x] Skills 创建 (`xiaohongshu-sop`)
- [x] 飞书图片上传方案（无需阿里云）
- [x] Docker Desktop 安装
- [x] GitHub Desktop 安装

---

## 🔧 待配置

### 1. Docker 环境激活

Docker Desktop 首次安装后需要激活 PATH：

```bash
# 方式 1：重新打开终端
# 关闭当前终端，重新打开

# 方式 2：手动加载
eval "$(/opt/homebrew/bin/brew shellenv)"

# 验证
docker --version
docker ps
```

### 2. 启动小红书 MCP 服务

Docker 可用后运行：

```bash
# 启动小红书 MCP 容器
docker run -d --name xiaohongshu-mcp \
  -p 18060:18060 \
  --platform linux/amd64 \
  xpzouying/xiaohongshu-mcp

# 验证运行
docker ps | grep xiaohongshu

# 配置到 mcporter
mcporter config add xiaohongshu http://localhost:18060/mcp

# 测试
mcporter list
```

### 3. 飞书应用配置

创建配置文件 `~/.openclaw/config/feishu-app-config.json`：

```json
{
  "feishu": {
    "app_id": "cli_xxxxx",
    "app_secret": "xxxxx",
    "folder_token": "xxxxx"
  }
}
```

**获取步骤：**
1. 访问 https://open.feishu.cn
2. 创建企业自建应用
3. 开通权限：云文档、多维表格、机器人
4. 复制 App ID 和 App Secret

### 4. 创建飞书多维表格

1. 打开飞书 → 云文档 → 新建多维表格
2. 按以下结构创建字段：

| 字段名 | 类型 |
|--------|------|
| 任务 ID | 自动编号 |
| 选题来源 | 文本 |
| 标题草稿 | 文本 |
| 正文内容 | 文本 |
| 图片附件 | 附件 |
| 标签建议 | 文本 |
| 内容状态 | 单选 |

3. 复制表格 Token（URL 中的部分）

---

## 🧪 测试流程

### 测试 1：Docker 就绪

```bash
docker --version
docker ps
```

### 测试 2：小红书 MCP

```bash
docker ps | grep xiaohongshu
mcporter list
```

### 测试 3：内容生成

告诉 AI：
```
帮我解析这篇文章生成小红书图文：
https://zhuanlan.zhihu.com/p/2008700494474938353
```

### 测试 4：完整流程

```
1. 解析知乎文章
2. 生成小红书格式内容
3. 创建飞书多维表格记录
4. 上传图片到飞书云文档
```

---

## ⚠️ 常见问题

### Docker 命令找不到
```bash
# 重启终端或运行
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Docker Desktop 启动慢
- 首次启动需要 1-2 分钟
- 检查菜单栏是否有 Docker 图标

### 小红书 MCP 启动失败
```bash
# 查看日志
docker logs xiaohongshu-mcp

# 重启容器
docker restart xiaohongshu-mcp
```

---

## 📞 下一步

1. **等待 Docker 完全启动**（检查菜单栏图标）
2. **运行小红书 MCP 容器**
3. **配置飞书应用**
4. **开始测试内容生成**
