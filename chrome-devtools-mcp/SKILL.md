---
name: chrome-devtools-mcp
description: >
  Chrome DevTools MCP — Google 官方浏览器自动化工具。
  通过 MCP 协议控制 Chrome：点击、填充表单、导航、截图、性能追踪、网络检查。
  Use when: 浏览器测试、网页自动化、性能分析、UI 测试、表单填充、视觉回归测试。
homepage: https://github.com/ChromeDevTools/chrome-devtools-mcp
license: Apache-2.0
metadata: {"openclaw": {"emoji": "🌐", "requires": {"bins": ["node"]}}}
---

# 🌐 Chrome DevTools MCP

Google 官方 Chrome DevTools MCP 服务器 — 通过 Puppeteer 和 CDP 协议控制 Chrome。

## 功能

- **输入自动化** — 点击、拖拽、填充表单、悬停、按键、上传文件
- **导航** — 打开/关闭/切换页面、等待元素/网络空闲
- **截图** — 页面截图和 DOM 快照
- **性能追踪** — 记录和分析 Chrome 性能
- **网络检查** — 查看网络请求和响应
- **控制台调试** — 读取控制台消息
- **设备模拟** — 模拟移动设备、调整视口

## 安装

```bash
npx -y chrome-devtools-mcp@latest --help
```

## 启动方式

```bash
# 标准模式（自动启动 Chrome）
npx -y chrome-devtools-mcp@latest

# 无头模式（服务器环境）
npx -y chrome-devtools-mcp@latest --headless

# 连接现有 Chrome（需带 --remote-debugging-port=9222 启动）
npx -y chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222

# 禁用遥测
npx -y chrome-devtools-mcp@latest --no-usage-statistics
```

## OpenClaw MCP 配置

```json
{
  "mcp": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "env": {}
    }
  }
}
```

## 常用操作

| 操作 | 说明 |
|------|------|
| `browser_navigate` | 导航到 URL |
| `browser_click` | 点击元素 |
| `browser_fill` | 填充表单字段 |
| `browser_screenshot` | 页面截图 |
| `browser_snapshot` | 获取页面快照 |
| `performance_trace` | 性能追踪 |
| `network_requests` | 查看网络请求 |

## 环境要求

- Node.js v20.19+
- Chrome/Chromium 浏览器

## 文档

- GitHub: https://github.com/ChromeDevTools/chrome-devtools-mcp
- 可用工具：`npx -y chrome-devtools-mcp@latest --help`
