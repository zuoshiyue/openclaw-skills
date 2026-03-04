#!/bin/bash
# 技能脱敏脚本 - 移除敏感信息

SKILLS_DIR="$HOME/.openclaw/workspace/skills"

echo "🔒 开始脱敏处理..."

# 脱敏项目
SENSITIVE_PATTERNS=(
  "api[_-]?key.*['\"].*['\"]"
  "secret.*['\"].*['\"]"
  "token.*['\"].*['\"]"
  "password.*['\"].*['\"]"
  "ou_[a-f0-9]+"
  "chat:[a-zA-Z0-9_]+"
  "user:[a-zA-Z0-9_]+"
  "TbOOb[0-9a-zA-Z]+"
  "tbl[0-9a-zA-Z]+"
)

# 需要清理的文件
FILES_TO_CLEAN=$(find "$SKILLS_DIR" -type f \( -name "*.md" -o -name "*.json" -o -name "*.mjs" -o -name "*.js" -o -name "*.py" -o -name "*.sh" \) 2>/dev/null)

for file in $FILES_TO_CLEAN; do
  # 跳过 node_modules 和.git
  if [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".git"* ]]; then
    continue
  fi
  
  # 创建备份
  cp "$file" "$file.bak"
  
  # 脱敏处理
  sed -i '' 's/ou_[a-f0-9]\+/ou_xxx/g' "$file"
  sed -i '' 's/chat:[a-zA-Z0-9_]\+/chat:xxx/g' "$file"
  sed -i '' 's/user:[a-zA-Z0-9_]\+/user:xxx/g' "$file"
  sed -i '' 's/TbOOb[0-9a-zA-Z]\+/TbOObXXX/g' "$file"
  sed -i '' 's/tbl[0-9a-zA-Z]\+/tblXXX/g' "$file"
  sed -i '' 's/"api_key": "xxx"]*"/"api_key": "xxx"/g' "$file"
  sed -i '' 's/"secret": "xxx"]*"/"secret": "xxx"/g' "$file"
  sed -i '' 's/"token": "xxx"]*"/"token": "xxx"/g' "$file"
  
  # 检查是否有变化
  if ! diff -q "$file" "$file.bak" > /dev/null 2>&1; then
    echo "✅ 脱敏：$file"
  fi
  
  # 删除备份
  rm "$file.bak"
done

echo "✅ 脱敏完成!"
