---
name: proactive-tasks
description: >
  主动任务管理系统。将被动助手转变为主动合作伙伴，自主推进长期目标。
  Use when: 管理目标、分解项目、跟踪进度、自主工作时。
  配合 Heartbeat 实现自主工作流。
---

# Proactive Tasks

主动任务管理系统 — 让 AI 自主推进目标，无需等待指令。

## 核心功能

- 跟踪目标并分解为可执行任务
- Heartbeat 期间自主工作
- 完成时推送更新，受阻时请求输入
- 持续推动长期目标

---

## 快速开始

### 创建目标

```bash
python3 scripts/task_manager.py add-goal "构建语音助手" \
  --priority high \
  --context "用本地模型替代 Alexa"
```

### 分解任务

```bash
python3 scripts/task_manager.py add-task "构建语音助手" \
  "调研语音识别模型" \
  --priority high
```

### Heartbeat 检查

```bash
python3 scripts/task_manager.py next-task
```

返回最高优先级可执行任务。

### 完成任务

```bash
python3 scripts/task_manager.py complete-task <task-id> \
  --notes "调研完成，Whisper.cpp 最适合"
```

---

## 任务状态

| 状态 | 说明 |
|------|------|
| `pending` | 待执行（依赖已满足） |
| `in_progress` | 执行中 |
| `blocked` | 受阻（依赖未满足） |
| `needs_input` | 需要用户输入 |
| `completed` | 已完成 |
| `cancelled` | 已取消 |

---

## Heartbeat 集成

### 配置 Heartbeat

在 `HEARTBEAT.md` 添加：

```markdown
## Proactive Tasks 🚀

- [ ] 运行 `python3 scripts/task_manager.py next-task`
- [ ] 如有任务，执行 10-15 分钟
- [ ] 更新任务状态
- [ ] 有意义的更新才推送（完成/受阻/发现）
```

### 执行流程

```
每 30 分钟:
├─ Heartbeat 触发
├─ 检查下一个任务
├─ 有任务 → 执行、更新状态、必要时推送
└─ 无任务 → 回复 HEARTBEAT_OK
```

详见 [references/heartbeat-setup.md](references/heartbeat-setup.md)

---

## 生产级特性

### 1. WAL 日志 (Write-Ahead Logging)

关键变更先记录到 `memory/WAL-YYYY-MM-DD.log`，防止 context 截断丢失数据。

### 2. SESSION-STATE.md

任务状态的"内存"，记录当前任务上下文。

### 3. Working Buffer

60-100% context 危险区的变更缓冲。

### 4. 自愈健康检查

```bash
python3 scripts/task_manager.py health-check
```

自动修复常见数据问题。

详见 [references/production-features.md](references/production-features.md)

---

## CLI 参考

详见 [references/CLI_REFERENCE.md](references/CLI_REFERENCE.md)

### 常用命令

| 命令 | 功能 |
|------|------|
| `add-goal` | 添加目标 |
| `add-task` | 添加任务 |
| `next-task` | 获取下一个任务 |
| `complete-task` | 完成任务 |
| `mark-blocked` | 标记受阻 |
| `health-check` | 健康检查 |

---

## 最佳实践

### 何时创建目标

- 长期项目（构建、学习、研究）
- 持续性责任（监控、维护）
- 探索性工作（评估选项）

### 何时推送用户

✅ **应该推送:**
- 完成重要里程碑
- 需要输入/决策
- 发现重要信息

❌ **不要推送:**
- 例行进度更新
- 小任务完成
- 用户未问的事项

---

## 数据存储

`data/tasks.json`:

```json
{
  "goals": [{"id": "goal_001", "title": "...", "priority": "high"}],
  "tasks": [{"id": "task_001", "goal_id": "goal_001", "title": "...", "status": "completed"}]
}
```

---

**文档:** https://github.com/toki-os/proactive-tasks
