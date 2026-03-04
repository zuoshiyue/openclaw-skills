# OpenClaw Skills - 技能集合

> 🎯 这是 OpenClaw 的自创技能集合，所有技能都已脱敏处理，可直接使用。

## 📦 技能列表

### 生产力工具

| 技能 | 说明 |
|------|------|
| `nanobanana-image` | MXAPI Nano Banana AI 绘画，生成小红书配图 |
| `news-aggregator` | 新闻聚合器，抓取微博/抖音/B 站等热搜 |
| `tavily-search` | Tavily AI 搜索引擎 |
| `summarize` | URL/文件/YouTube 视频总结 |
| `find-skills` | 技能发现和安装工具 |
| `obsidian-cli` | Obsidian 文档编写 CLI |
| `openclaw-xhs` | 小红书内容搜索/抓取/热点跟踪 |

### 开发工具

| 技能 | 说明 |
|------|------|
| `chrome-devtools-mcp` | Chrome DevTools MCP 浏览器自动化 |
| `security-auditor` | OWASP 安全审计工具 |
| `clawfeed` | AI 新闻摘要生成 |

### 内容创作

| 技能 | 说明 |
|------|------|
| `xiaohongshu-sop` | 小红书全自动图文生成 SOP |

### 系统管理

| 技能 | 说明 |
|------|------|
| `proactive-tasks` | 主动任务管理系统 |
| `openclaw-cost-guard` | Token 成本追踪和预算控制 |
| `weather` | 天气查询工具 |
| `feishu-doc-permissions` | 飞书文档权限管理 |
| `openclaw-self-healing` | 4 层自愈系统 (Watchdog → Claude Recovery) |

### 理财

| 技能 | 说明 |
|------|------|
| `a-stock-analysis` | A 股实时行情与持仓分析 |

---

## 🚀 使用方法

### 1. 克隆仓库

```bash
git clone https://github.com/zuoshiyue/openclaw-skills.git
cd openclaw-skills
```

### 2. 复制技能到 OpenClaw

```bash
# 复制单个技能
cp -r nanobanana-image ~/.openclaw/workspace/skills/

# 或复制所有技能
cp -r * ~/.openclaw/workspace/skills/
```

### 3. 配置 API Key

部分技能需要配置 API Key，查看对应技能的 `SKILL.md` 获取配置说明。

### 4. 重启 OpenClaw

```bash
openclaw gateway restart
```

---

## 📋 技能规范

所有技能遵循统一的 [skill-creator](https://github.com/openclaw/openclaw/tree/main/skills/skill-creator) 规范：

- **SKILL.md** - 技能文档（<100 行）
- **references/** - 详细参考资料
- **scripts/** - 可执行脚本
- **assets/** - 资源文件（可选）

---

## 🔒 脱敏说明

本仓库已进行严格脱敏处理：

- ❌ 无 API Key
- ❌ 无用户 ID
- ❌ 无飞书配置
- ❌ 无个人数据

**脱敏模式:**
- 用户 ID → `ou_xxx`
- 飞书 Token → `TbOObXXX`
- API Key → `xxx`

---

## 📝 更新日志

### 2026-03-05 - 新增推荐技能
- ✅ `openclaw-xhs` - 小红书工具 (1.4K 安装)
- ✅ `openclaw-self-healing` - 自修复系统 (267 安装)

### 2026-03-05 - 初始版本
- ✨ 13 个自创技能已脱敏
- 📚 完整文档和配置说明

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

---

## 📄 许可证

MIT License

---

**维护者:** @zuoshiyue  
**最后更新:** 2026-03-05
