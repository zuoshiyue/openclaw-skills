#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书内容格式优化工具
将标准文本转换为小红书友好的格式
"""

import re

def format_xiaohongshu_content(text):
    """
    格式化小红书内容：
    1. 将 \n 转换为实际换行
    2. 在 emoji 后添加换行
    3. 控制段落间距
    4. 优化标签格式
    """
    
    # 1. 替换 \n 为实际换行
    text = text.replace('\\n', '\n')
    
    # 2. 在 emoji 后确保有换行
    emojis = ['🎯', '✨', '📌', '✅', '💰', '🔧', '1️⃣', '2️⃣', '3️⃣', 
              '4️⃣', '5️⃣', '🚀', '💡', '🔥', '⭐', '📊', '🎉']
    for emoji in emojis:
        # 确保 emoji 前有换行（除非在开头）
        text = re.sub(r'(?<!\n)(' + emoji + ')', r'\n\1', text)
        # 确保 emoji 后有换行（如果后面是文字）
        text = re.sub(r'(' + emoji + r')([^\n\s])', r'\1 \2', text)
    
    # 3. 移除多余空行（保留最多 2 个连续换行）
    while '\n\n\n' in text:
        text = text.replace('\n\n\n', '\n\n')
    
    # 4. 优化标签格式 - 确保标签在最后，且每个标签前有换行
    hashtag_pattern = r'(#[^\s#]+)'
    hashtags = re.findall(hashtag_pattern, text)
    if hashtags:
        # 移除原文中的标签
        text = re.sub(hashtag_pattern, '', text)
        # 在末尾统一添加标签
        text = text.rstrip() + '\n\n' + ' '.join(hashtags)
    
    # 5. 清理多余空格
    text = re.sub(r' +\n', '\n', text)  # 移除行尾空格
    text = re.sub(r'\n +', '\n', text)  # 移除行首空格
    
    return text.strip()


def create_xiaohongshu_post(title, content, tags, images=None):
    """
    创建小红书帖子数据结构
    
    Args:
        title: 标题（20 字以内）
        content: 正文内容
        tags: 标签列表
        images: 图片路径列表
    
    Returns:
        dict: 发布参数
    """
    
    # 格式化内容
    formatted_content = format_xiaohongshu_content(content)
    
    # 构建发布参数
    post_data = {
        "title": title,
        "content": formatted_content,
        "tags": tags
    }
    
    if images:
        post_data["images"] = images
    
    return post_data


# 示例用法
if __name__ == "__main__":
    # 原始内容（包含 \n）
    raw_content = r"""🚀 从 0 到 1！我帮验证了一条真正可用的小红书自动化链路

✨ 不用写代码！OpenClaw+ 飞书，3 步搞定小红书图文，效率提升 10 倍

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

#OpenClaw #小红书运营 #自动化 #AI 提效 #内容创作"""

    # 格式化
    formatted = format_xiaohongshu_content(raw_content)
    
    print("=" * 60)
    print("优化后的内容：")
    print("=" * 60)
    print(formatted)
    print("=" * 60)
    
    # 创建发布数据
    post = create_xiaohongshu_post(
        title="3 小时搭建！OpenClaw 小红书全自动 SOP",
        content=raw_content,
        tags=["OpenClaw", "小红书运营", "自动化", "AI 提效", "内容创作"],
        images=[
            "/app/images/page_01.jpg",
            "/app/images/page_02.jpg",
            "/app/images/page_03.jpg",
            "/app/images/page_04.jpg",
            "/app/images/page_05.jpg",
            "/app/images/page_06.jpg",
            "/app/images/page_07.jpg"
        ]
    )
    
    print("\n发布数据：")
    import json
    print(json.dumps(post, indent=2, ensure_ascii=False))
