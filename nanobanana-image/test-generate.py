#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nano Banana 图片生成测试
"""

import requests
import json
from pathlib import Path

# 读取配置
config_path = Path.home() / ".openclaw" / "config" / "nanobanana-config.json"
with open(config_path) as f:
    config = json.load(f)

print("🎨 Nano Banana 图片生成测试")
print("=" * 50)
print(f"API Key: {config['api_key'][:10]}...{config['api_key'][-6:]}")
print(f"Base URL: {config['base_url']}")
print(f"默认尺寸：{config['default_size']}")
print()

# 先检查余额
print("检查余额...")
balance_url = f"{config['base_url']}/points/balance"
balance_resp = requests.get(balance_url, headers={"Authorization": f"Bearer {config['api_key']}"}, timeout=10)
balance_data = balance_resp.json()
if balance_data.get('code') == 200:
    remaining = balance_data['data']['remaining_points']
    print(f"✅ 剩余点数：{remaining}")
else:
    print(f"❌ 余额查询失败：{balance_data}")
    exit(1)
print()

# 测试提示词（小红书封面）
test_prompt = "简洁工作流图，左侧输入文章链接，右侧输出小红书图文，中间 OpenClaw logo，蓝白色调，扁平化设计，现代简约，无文字"

print(f"测试提示词：{test_prompt}")
print()
print("正在生成图片...")

# API 调用 - 使用正确的端点
url = f"{config['base_url']}/ai/draw"
headers = {
    "Authorization": f"Bearer {config['api_key']}",
    "Content-Type": "application/json"
}

# Nano Banana API 格式
payload = {
    "prompt": test_prompt,
    "size": "1080x1440",
    "n": 1,
    "style": "photographic"
}

try:
    response = requests.post(url, headers=headers, json=payload, timeout=60)
    result = response.json()
    
    print()
    if result.get('success') or result.get('image_url'):
        image_url = result.get('image_url')
        gen_time = result.get('generation_time', 'N/A')
        
        print(f"✅ 生成成功！")
        print(f"   图片 URL: {image_url}")
        print(f"   生成时间：{gen_time}s")
        print(f"   尺寸：{config['default_size']}")
        
        # 下载图片到本地
        output_dir = Path.home() / ".openclaw" / "workspace" / "output" / "images"
        output_dir.mkdir(exist_ok=True)
        
        img_response = requests.get(image_url, timeout=30)
        output_path = output_dir / "test-cover.png"
        
        with open(output_path, 'wb') as f:
            f.write(img_response.content)
        
        print(f"   本地保存：{output_path}")
        print()
        print("下一步:")
        print("1. 查看生成的图片")
        print("2. 上传到飞书云文档")
        print("3. 关联到飞书多维表格记录")
    else:
        print(f"❌ 生成失败：{result}")
        if 'error' in result:
            print(f"   错误信息：{result['error']}")
except requests.exceptions.Timeout:
    print("❌ 请求超时，请重试")
except Exception as e:
    print(f"❌ 错误：{e}")

