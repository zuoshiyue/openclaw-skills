#!/bin/bash
# Obsidian 笔记创建脚本

VAULT_DIR="$HOME/.openclaw/workspace/docs"

usage() {
  echo "用法：$0 <笔记标题> [标签 1] [标签 2] ..."
  echo "示例：$0 \"学习笔记\" 学习 Obsidian"
  exit 1
}

if [ $# -lt 1 ]; then
  usage
fi

TITLE="$1"
shift
TAGS=("$@")

# 生成文件名（替换空格为连字符）
FILENAME=$(echo "$TITLE" | tr ' ' '-' | tr '[:upper:]' '[:lower:]').md
FILEPATH="$VAULT_DIR/$FILENAME"

# 检查是否已存在
if [ -f "$FILEPATH" ]; then
  echo "❌ 笔记已存在：$FILEPATH"
  exit 1
fi

# 生成 Frontmatter
TAGS_YAML=""
if [ ${#TAGS[@]} -gt 0 ]; then
  TAGS_YAML="tags: [$(IFS=', '; echo "${TAGS[*]}")]"
else
  TAGS_YAML="tags: []"
fi

# 创建笔记
cat > "$FILEPATH" << EOF
---
title: $TITLE
created: $(date -Iseconds)
$TAGS_YAML
status: draft
---

# $TITLE

<!-- 在此编写内容 -->

EOF

echo "✅ 笔记已创建：$FILEPATH"
echo "📝 编辑：code \"$FILEPATH\""
echo "🔗 查看：obsidian://open?vault=OpenClaw&file=$FILENAME"
