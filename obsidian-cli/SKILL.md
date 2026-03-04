---
name: obsidian-cli
description: >
  Obsidian 文档编写 CLI 工具。创建、编辑、查询 Markdown 笔记，
  支持 Frontmatter 管理、双向链接、标签搜索。
  Use when: 需要编写 Obsidian 笔记、创建文档、管理知识库、添加 Frontmatter。
  配置：Vault 路径 ~/.openclaw/workspace/docs
---

# Obsidian CLI

Obsidian 文档编写工具 — 直接操作 Markdown 文件。

## 配置

**Vault 路径:** `~/.openclaw/workspace/docs`

## 快速命令

### 创建笔记

```bash
# 创建新笔记（带 Frontmatter）
cat > ~/.openclaw/workspace/docs/笔记标题.md << 'EOF'
---
created: $(date -Iseconds)
tags: [标签 1, 标签 2]
---

# 笔记标题

内容...
EOF
```

### 编辑笔记

```bash
# 追加内容
echo "## 新段落" >> ~/.openclaw/workspace/docs/笔记标题.md
echo "内容..." >> ~/.openclaw/workspace/docs/笔记标题.md
```

### 搜索笔记

```bash
# 按标签搜索
grep -r "#标签" ~/.openclaw/workspace/docs/

# 按标题搜索
find ~/.openclaw/workspace/docs/ -name "*关键词*.md"
```

### 列出笔记

```bash
# 最近修改的笔记
ls -lt ~/.openclaw/workspace/docs/ | head -20

# 按标签分类
grep -rl "^tags:" ~/.openclaw/workspace/docs/ | xargs grep "tags:"
```

---

## Frontmatter 模板

### 文档笔记

```yaml
---
title: 文档标题
created: 2026-03-05T00:00:00+08:00
modified: 2026-03-05T00:00:00+08:00
tags: [文档，分类]
status: draft | in-progress | published
---
```

### 会议记录

```yaml
---
title: 会议记录 - YYYY-MM-DD
date: 2026-03-05
attendees: [姓名 1, 姓名 2]
tags: [会议，项目名]
---
```

### 学习笔记

```yaml
---
title: 学习笔记 - 主题
source: 来源链接
created: 2026-03-05
tags: [学习，主题]
---
```

---

## 双向链接

### 内部链接

```markdown
[[笔记标题]]
[[笔记标题#锚点]]
[[笔记标题|显示文本]]
```

### 反向链接查询

```bash
# 查找引用此笔记的文件
grep -r "\[\[笔记标题\]\]" ~/.openclaw/workspace/docs/
```

---

## 标签管理

### 常用标签

| 标签 | 用途 |
|------|------|
| `#文档` | 技术文档 |
| `#会议` | 会议记录 |
| `#学习` | 学习笔记 |
| `#项目` | 项目相关 |
| `#草稿` | 未完成内容 |
| `#已发布` | 已完成内容 |

### 添加标签

```markdown
# 在 Frontmatter 中添加
tags: [标签 1, 标签 2]

# 或在内容中添加
#标签
```

---

## 批量操作

### 批量添加 Frontmatter

```bash
for file in ~/.openclaw/workspace/docs/*.md; do
  if ! grep -q "^---" "$file"; then
    sed -i '' "1i\\
---\\
created: $(date -Iseconds)\\
---\\
" "$file"
  fi
done
```

### 统计笔记数量

```bash
# 总笔记数
find ~/.openclaw/workspace/docs/ -name "*.md" | wc -l

# 按标签统计
grep -r "^tags:.*标签" ~/.openclaw/workspace/docs/ | wc -l
```

---

## 最佳实践

1. **统一命名** — 使用中文或英文，避免特殊字符
2. **Frontmatter 必填** — created、tags 至少包含
3. **双向链接** — 相关笔记之间使用 [[链接]]
4. **定期整理** — 清理无用草稿，归档旧笔记
5. **备份同步** — 使用 Git 管理笔记版本

---

## 与 Obsidian App 集成

1. 打开 Obsidian App
2. 添加 Vault: `~/.openclaw/workspace/docs`
3. 安装推荐插件:
   - Dataview — 查询和展示
   - Templater — 模板管理
   - QuickAdd — 快速添加笔记

---

## 脚本工具

详见 [scripts/](scripts/) 目录：
- `create-note.sh` — 创建笔记
- `add-frontmatter.sh` — 批量添加 Frontmatter
- `search-notes.sh` — 搜索笔记
