#!/bin/bash
# Obsidian 笔记搜索脚本

VAULT_DIR="$HOME/.openclaw/workspace/docs"

usage() {
  echo "用法：$0 [选项] <搜索内容>"
  echo "选项:"
  echo "  -t, --tag       按标签搜索"
  echo "  -f, --frontmatter  按 Frontmatter 搜索"
  echo "  -c, --content   按内容搜索（默认）"
  echo "  -l, --list      列出所有笔记"
  exit 1
}

if [ $# -lt 1 ]; then
  usage
fi

MODE="content"
while [ $# -gt 0 ]; do
  case "$1" in
    -t|--tag)
      MODE="tag"
      shift
      ;;
    -f|--frontmatter)
      MODE="frontmatter"
      shift
      ;;
    -c|--content)
      MODE="content"
      shift
      ;;
    -l|--list)
      echo "📚 所有笔记:"
      find "$VAULT_DIR" -name "*.md" -type f | sort
      exit 0
      ;;
    *)
      SEARCH_TERM="$1"
      shift
      ;;
  esac
done

case "$MODE" in
  tag)
    echo "🔍 按标签搜索：$SEARCH_TERM"
    grep -rl "^tags:.*$SEARCH_TERM" "$VAULT_DIR" 2>/dev/null
    ;;
  frontmatter)
    echo "🔍 按 Frontmatter 搜索：$SEARCH_TERM"
    grep -rl "^$SEARCH_TERM:" "$VAULT_DIR" 2>/dev/null
    ;;
  content)
    echo "🔍 按内容搜索：$SEARCH_TERM"
    grep -rl "$SEARCH_TERM" "$VAULT_DIR" 2>/dev/null
    ;;
esac
