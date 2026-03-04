#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成小红书 7 页配图
使用 MXAPI Nano Banana API
"""

import requests
import json
from pathlib import Path
import time

# 读取配置
config_path = Path.home() / ".openclaw" / "config" / "nanobanana-config.json"
with open(config_path) as f:
    config = json.load(f)

print("🎨 批量生成小红书配图")
print("=" * 60)
print(f"API: MXAPI Nano Banana")
print(f"余额：{config.get('balance', 'N/A')} 积分")
print(f"价格：{config.get('price', '¥0.07/张')}")
print()

# 7 页配图提示词
pages = [
    {
        "name": "封面页",
        "prompt": "简洁工作流图，左侧输入文章链接图标，右侧输出小红书图文图标，中间 OpenClaw 文字标识，蓝白色调，扁平化设计，现代简约风格，无其他文字，高清专业"
    },
    {
        "name": "第 2 页 - 痛点共鸣",
        "prompt": "崩溃打工人坐在办公桌前抓头，电脑屏幕显示很多待办事项，夸张漫画风格，高对比度，吸引眼球，蓝灰色调"
    },
    {
        "name": "第 3 页 - 解决方案",
        "prompt": "垂直流程图，5 个节点从上到下排列，箭头连接，每个节点有简洁图标，第一层输入链接，中间处理，最后输出图文，简洁现代风格"
    },
    {
        "name": "第 4 页 - 核心优势",
        "prompt": "四个图标网格排列 2x2 布局，每个图标下方有简短文字位置，蓝白配色，扁平化设计，现代简约"
    },
    {
        "name": "第 5 页 - 搭建步骤",
        "prompt": "步骤 1-2-3-4 数字图标，圆形背景，水平排列，从左到右箭头连接，简洁现代设计，蓝绿色调"
    },
    {
        "name": "第 6 页 - 效果展示",
        "prompt": "数据展示图表，柱状图显示增长趋势，配上百分比数字，蓝绿色调，科技感，清晰易读"
    },
    {
        "name": "第 7 页 - 行动号召",
        "prompt": "简洁行动号召设计，大按钮样式在中央，箭头指向右下角，简洁有力，蓝白主色调，现代设计"
    }
]

# API 配置
base_url = config['base_url']
api_key = config['api_key']
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# 输出目录
output_dir = Path.home() / ".openclaw" / "workspace" / "output" / "images" / "xiaohongshu-test-001"
output_dir.mkdir(exist_ok=True)

results = []

for i, page in enumerate(pages, 1):
    print(f"[{i}/7] 生成：{page['name']}")
    
    payload = {
        "messages": [{"role": "user", "content": page['prompt']}],
        "stream": False,
        "size": "1080x1440"
    }
    
    try:
        url = f"{base_url}/draw"
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        result = response.json()
        
        if result.get('code') == 200:
            image_url = result['data']['image_url']
            print(f"  ✅ 成功")
            print(f"     URL: {image_url}")
            
            # 下载图片
            img_response = requests.get(image_url, timeout=30)
            output_path = output_dir / f"page_{i:02d}.jpg"
            
            with open(output_path, 'wb') as f:
                f.write(img_response.content)
            
            print(f"     保存：{output_path.name}")
            
            results.append({
                "page": i,
                "name": page['name'],
                "url": image_url,
                "local_path": str(output_path)
            })
        else:
            print(f"  ❌ 失败：{result}")
            results.append({
                "page": i,
                "name": page['name'],
                "error": result
            })
        
        # 避免请求过快
        if i < len(pages):
            time.sleep(1)
            
    except Exception as e:
        print(f"  ❌ 错误：{e}")
        results.append({
            "page": i,
            "name": page['name'],
            "error": str(e)
        })

# 保存结果
print()
print("=" * 60)
print("批量生成完成！")
print()

success_count = sum(1 for r in results if 'url' in r)
print(f"成功：{success_count}/7")
print()

# 保存结果 JSON
result_file = output_dir / "results.json"
with open(result_file, 'w', encoding='utf-8') as f:
    json.dump({
        "task": "xiaohongshu-test-001",
        "total": 7,
        "success": success_count,
        "images": results
    }, f, ensure_ascii=False, indent=2)

print(f"结果已保存：{result_file}")
print()
print("下一步:")
print("1. 查看生成的图片")
print("2. 上传到飞书云文档")
print("3. 关联飞书多维表格记录")
