# Heartbeat 配置指南

## 快速设置

### 1. 创建 Cron 任务

在 `~/.openclaw/config/cron.json` 添加：

```json
{
  "task": "Heartbeat 检查",
  "schedule": "*/30 * * * *",
  "message": "💓 Heartbeat check: Read HEARTBEAT.md if it exists. If nothing needs attention, reply HEARTBEAT_OK.",
  "agent": "isolated"
}
```

### 2. 更新 HEARTBEAT.md

添加 Proactive Tasks 检查项：

```markdown
## Proactive Tasks 🚀

每 30 分钟检查：

- [ ] 运行 `python3 skills/proactive-tasks/scripts/task_manager.py next-task`
- [ ] 如有任务，执行 10-15 分钟
- [ ] 更新任务状态（完成/受阻/需要输入）
- [ ] 有意义的更新才推送用户

**目标:** 自主推进目标，无需等待指令。
```

### 3. 测试

手动触发 Heartbeat：

```
💓 Heartbeat check: Read HEARTBEAT.md if it exists.
```

检查是否正确执行任务检查。

---

## 推送策略

### 应该推送

- ✅ 任务完成（特别是解锁其他工作的）
- ✅ 受阻需要决策
- ✅ 发现重要信息
- ✅ 任务将超时

### 不要推送

- ❌ 例行进度（"现在 50% 了..."）
- ❌ 每个小任务完成
- ❌ 用户未问的事项

---

## 自主工作模式

### Interactive (systemEvent)

- 完整 main session context
- 用户请求触发
- 适合决策、人机交互工作

### Autonomous (isolated agentTurn)

- 无 main session context
- Heartbeat cron 触发
- 适合速度报告、清理、周期性任务

---

## 常见问题

### Q: Heartbeat 不工作？

A: 检查 cron 配置是否正确，确保 Gateway 已重启。

### Q: 任务数据丢失？

A: 检查 WAL 日志 `memory/WAL-YYYY-MM-DD.log` 恢复。

### Q: 如何查看任务历史？

A: 读取 `data/tasks.json` 或使用 `list-tasks` 命令。
