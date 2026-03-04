# 小红书 MCP Docker 配置

## 当前状态

- ✅ Docker Desktop 已安装并运行
- ✅ Docker version 29.2.1
- ⚠️ 镜像拉取中（网络原因可能较慢）
- ✅ mcporter 已配置 xiaohongshu 端点

---

## 手动启动步骤

如果自动启动失败，可以手动执行：

### 1. 拉取镜像（可能需要多次尝试）

```bash
# 如果网络慢，可以重试多次
docker pull --platform linux/amd64 xpzouying/xiaohongshu-mcp
```

### 2. 运行容器

```bash
docker run -d --name xiaohongshu-mcp \
  -p 18060:18060 \
  --platform linux/amd64 \
  xpzouying/xiaohongshu-mcp
```

### 3. 验证运行

```bash
# 查看容器状态
docker ps | grep xiaohongshu

# 查看日志
docker logs xiaohongshu-mcp

# 测试连接
curl http://localhost:18060/health
```

### 4. 配置 mcporter

```bash
# 添加配置（已完成）
mcporter config add xiaohongshu http://localhost:18060/mcp

# 验证配置
mcporter list
```

---

## 常见问题

### 镜像拉取失败

**错误：** `error getting credentials`

**解决：**
```bash
# 重置 Docker 凭据
rm -rf ~/.docker/config.json

# 重新登录 Docker Hub（如果需要）
docker login
```

### 容器启动失败

**检查日志：**
```bash
docker logs xiaohongshu-mcp
```

**重启容器：**
```bash
docker restart xiaohongshu-mcp
```

### 端口被占用

**错误：** `port 18060 is already allocated`

**解决：**
```bash
# 查找占用端口的进程
lsof -i :18060

# 使用不同端口
docker run -d --name xiaohongshu-mcp \
  -p 18061:18060 \
  --platform linux/amd64 \
  xpzouying/xiaohongshu-mcp

# 修改 mcporter 配置
mcporter config update xiaohongshu http://localhost:18061/mcp
```

---

## 替代方案（如果 Docker 持续失败）

### 方案 A：使用飞书云文档 + 手动发布

不需要小红书 MCP，流程：
1. AI 生成内容 → 飞书多维表格
2. 人工复制内容到小红书 APP
3. 手动上传图片发布

### 方案 B：使用 Cookie-Editor + xreach

```bash
# 安装 Cookie-Editor Chrome 插件
# 登录小红书，导出 Cookie
# 配置到 agent-reach
agent-reach configure xiaohongshu-cookies "your_cookies"
```

---

## 下一步

1. **等待镜像下载完成**（可能需要几分钟）
2. **启动容器**
3. **测试 MCP 连接**
4. **开始使用自动发布功能**

---

## 测试命令

```bash
# 检查容器状态
docker ps | grep xiaohongshu

# 测试 MCP 工具
mcporter call 'xiaohongshu.get_feed_detail(feed_id: "test")'
```
