---
name: openclaw-cost-guard
description: >
  OpenClaw/Clawdbot Token 和成本追踪工具。从 session JSONL 日志提取真实成本，
  生成日报/周报、昂贵 session 排行、预算检查。
  Use when: 需要监控 token 消耗、生成成本报告、预算告警、优化 token 使用。
  数据源：~/.openclaw/agents/*/sessions/*.jsonl
---

# OpenClaw Cost Guard

Token 和成本追踪工具。

## 数据源

**Session JSONL 日志**（包含真实 USD 成本）:
- OpenClaw: `~/.openclaw/agents/*/sessions/*.jsonl`
- Legacy: `~/.clawdbot/agents/*/sessions/*.jsonl`

---

## 快速命令

### 日报（最近 7 天）

```bash
python3 {baseDir}/scripts/extract_cost.py --last-days 7
```

### 今日/昨日

```bash
python3 {baseDir}/scripts/extract_cost.py --today
python3 {baseDir}/scripts/extract_cost.py --yesterday
```

### 昂贵 Session 排行

```bash
python3 {baseDir}/scripts/extract_cost.py --top-sessions 10
```

### JSON 输出（仪表盘）

```bash
python3 {baseDir}/scripts/extract_cost.py --last-days 30 --json
```

---

## 预算告警

### 预算检查

```bash
python3 {baseDir}/scripts/extract_cost.py --today --budget-usd 5
```

**退出码:**
- `0` — 预算内
- `2` — 超出预算（默认）

### 警告模式（不退出）

```bash
python3 {baseDir}/scripts/extract_cost.py --today --budget-usd 5 --budget-mode warn
```

### Cron 告警配置

```json
{
  "task": "每日成本检查",
  "schedule": "20 9 * * *",
  "script": "python3 {baseDir}/scripts/extract_cost.py --today --budget-usd 5",
  "agent": "isolated",
  "notify": "sentry"
}
```

---

## Token 优化手册

详见 [references/token-saving-playbook.md](references/token-saving-playbook.md)

### 核心原则

- **默认回复预算:** 1-6 行，列表优于段落
- **最多 1 个问题** — 仅在真正需要时提问
- **渐进式披露** — 仅在询问时提供详情
- **批处理工具调用** — 避免重复 status/browser 调用
- **不 dump 日志** — 总结 + 指向文件路径
- **Web 迭代限制** — 最多 3 次 search/fetch

### 提示词示例

```
Answer in <=6 lines. If more is needed, ask permission.
```

---

## 成本估算（备用）

如果 provider 未返回 `usage.cost`，可配置价格：

```bash
export PRICE_INPUT=1.75
export PRICE_OUTPUT=14
export PRICE_CACHE_READ=0.175
python3 {baseDir}/scripts/extract_cost.py --last-days 7
```

---

## 报告格式

```
============================================================
成本报告 - 最近 7 天
============================================================

总花费：$12.34
日均：$1.76

Top 昂贵 Session:
1. session-abc - $3.45 (复杂代码分析)
2. session-def - $2.10 (长对话)
...

建议:
- session-abc 可使用 fast 模型池
- 减少不必要的工具调用
```

---

## 脚本说明

| 脚本 | 功能 |
|------|------|
| `extract_cost.py` | 成本提取和报告 |
| `budget_check.py` | 预算检查 |
| `token_analyzer.py` | Token 使用分析 |
