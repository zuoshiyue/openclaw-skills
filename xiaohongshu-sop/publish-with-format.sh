#!/bin/bash
# 小红书发布脚本（带格式优化）
# 用法：./publish-with-format.sh

set -e

echo "📝 小红书内容格式优化发布工具"
echo "================================"
echo ""

# 定义内容（使用实际换行符）
TITLE="3 小时搭建！OpenClaw 小红书全自动 SOP"

CONTENT='🚀 从 0 到 1！我帮验证了一条真正可用的小红书自动化链路

✨ 不用写代码！OpenClaw+ 飞书，3 步搞定小红书图文

📌 核心功能：
✅ AI 自动生成 7 页图文内容
✅ Nano Banana 生成配图
✅ 飞书多维表格存储
✅ 自动发布到小红书

💰 成本：图片生成约¥0.07/张

🔧 完整流程：
1️⃣ 输入微信文章链接或关键词
2️⃣ AI 生成 7 页图文内容
3️⃣ 自动生成 7 张配图
4️⃣ 写入飞书表格
5️⃣ 一键发布

#OpenClaw #小红书运营 #自动化 #AI 提效 #内容创作 #飞书多维表格 #SOP #打工人神器 #效率工具 #自媒体运营'

# 图片路径（容器内路径）
IMAGES=(
  "/app/images/page_01.jpg"
  "/app/images/page_02.jpg"
  "/app/images/page_03.jpg"
  "/app/images/page_04.jpg"
  "/app/images/page_05.jpg"
  "/app/images/page_06.jpg"
  "/app/images/page_07.jpg"
)

# 标签
TAGS=("OpenClaw" "小红书运营" "自动化" "AI 提效" "内容创作")

echo "标题：$TITLE"
echo ""
echo "内容预览："
echo "$CONTENT" | head -10
echo "..."
echo ""
echo "图片数量：${#IMAGES[@]}"
echo "标签数量：${#TAGS[@]}"
echo ""
echo "================================"
echo "开始发布..."
echo ""

# 构建图片数组字符串
IMAGES_JSON=$(printf '"%s",' "${IMAGES[@]}")
IMAGES_JSON="[${IMAGES_JSON%,}]"

# 构建标签数组字符串
TAGS_JSON=$(printf '"%s",' "${TAGS[@]}")
TAGS_JSON="[${TAGS_JSON%,}]"

# 调用 MCP 发布
echo "调用小红书 MCP 发布..."
mcporter call 'xiaohongshu.publish_content' \
  title:"$TITLE" \
  content:"$CONTENT" \
  images:"$IMAGES_JSON" \
  tags:"$TAGS_JSON" \
  --timeout 300000 \
  2>&1

echo ""
echo "================================"
echo "✅ 发布完成！"
