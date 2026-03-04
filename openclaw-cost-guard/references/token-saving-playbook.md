# Token 优化手册

## 核心原则

### 1. 回复长度控制

**目标:** 默认 1-6 行

```
✅ 好：简洁列表，直接回答
❌ 差：冗长段落，重复说明
```

### 2. 提问策略

**最多 1 个问题** — 仅在真正阻塞时：

```
✅ 好："需要继续吗？"（任务完成后）
❌ 差："你觉得怎么样？还有其他需求吗？..."（多个问题）
```

### 3. 渐进式披露

```
第一层：核心答案（1-3 行）
第二层：详情（仅在询问时提供）
第三层：完整文档（指向文件）
```

### 4. 工具调用优化

**批处理:**
```
✅ 好：一次性搜索 3 个关键词
❌ 差：3 次单独搜索
```

**避免重复:**
```
✅ 好：缓存 status 检查结果
❌ 差：每步都调用 status
```

### 5. 日志处理

```
✅ 好："日志已保存到 /path/to/file.log，关键错误：XXX"
❌ 差：[dump 1000 行日志到聊天]
```

### 6. Web 搜索限制

**最多 3 次迭代:**
```
1. 初次搜索
2. 深入搜索（如需要）
3. 验证搜索（如需要）
```

---

## 提示词模板

### 简洁模式

```
Answer in <=6 lines. Use bullets over paragraphs.
Ask at most 1 question, only if truly blocking.
```

### 分步执行

```
Step 1: [任务描述]
When done, report completion in 1-2 lines.
Do not dump logs - summarize and point to file.
```

### 研究任务

```
Research [topic] with max 3 web iterations.
Return top 5 findings as bullet points.
Include source URLs.
```

---

## 模型池优化

### Fast 池 (glm-4.7)

- 日常会话
- 简单问答
- 状态检查

### Smart 池 (qwen3-max)

- 复杂推理
- 深度分析
- 代码审查

### Text 池 (qwen3-coder-plus)

- 代码生成
- 文档处理
- 翻译总结

---

## 成本监控

### 每日检查

```bash
python3 scripts/extract_cost.py --today
```

### 告警阈值

| 级别 | 日预算 | 行动 |
|------|--------|------|
| 🟢 正常 | <$5 | 无需行动 |
| 🟡 警告 | $5-10 | 检查昂贵 session |
| 🔴 严重 | >$10 | 立即优化 |

### 优化措施

1. 检查 top 昂贵 session
2. 识别可优化的模式
3. 调整模型池路由
4. 减少不必要的工具调用

---

## 常见浪费模式

| 模式 | 浪费原因 | 优化方案 |
|------|---------|---------|
| 长回复 | 输出 token 多 | 限制 6 行内 |
| 重复搜索 | 多次 web 调用 | 批处理 + 缓存 |
| 日志 dump | 大量上下文 | 总结 + 文件引用 |
| 过度思考 | 深度推理滥用 | 简单任务用 fast 池 |
