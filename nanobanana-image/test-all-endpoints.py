#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MXAPI Nano Banana 图片生成测试
平台：https://open.mxapi.org
"""

import requests
import json
from pathlib import Path

# 读取配置
config_path = Path.home() / ".openclaw" / "config" / "nanobanana-config.json"
with open(config_path) as f:
    config = json.load(f)

print("🎨 MXAPI Nano Banana 图片生成测试")
print("=" * 60)
print(f"API Key: {config['api_key'][:10]}...{config['api_key'][-6:]}")
print(f"Base URL: {config['base_url']}")
print()

# 检查余额
print("1️⃣ 检查余额...")
balance_url = f"{config['base_url']}/points/balance"
balance_resp = requests.get(balance_url, headers={"Authorization": f"Bearer {config['api_key']}"}, timeout=10)
balance_data = balance_resp.json()
if balance_data.get('code') == 200:
    remaining = balance_data['data']['remaining_points']
    print(f"✅ 剩余积分：{remaining}")
else:
    print(f"❌ 余额查询失败：{balance_data}")
    exit(1)
print()

# 测试提示词
test_prompt = "简洁工作流图，左侧输入文章链接，右侧输出小红书图文，蓝白色调，扁平化设计，现代简约，无文字"
print(f"测试提示词：{test_prompt}")
print()

# 可能的端点列表
endpoints_to_try = [
    "/nano/draw",
    "/nano/generate",
    "/image/draw",
    "/image/generate",
    "/ai/draw",
    "/ai/generate",
    "/draw",
    "/generate",
]

headers = {
    "Authorization": f"Bearer {config['api_key']}",
    "Content-Type": "application/json"
}

payload = {
    "prompt": test_prompt,
    "size": "1080x1440",
    "n": 1
}

print("2️⃣ 尝试不同端点...")
print("-" * 60)

for endpoint in endpoints_to_try:
    url = f"{config['base_url']}{endpoint}"
    print(f"\n尝试：POST {endpoint}")
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"  状态码：{response.status_code}")
        
        # 检查是否是 JSON
        if 'application/json' in response.headers.get('Content-Type', ''):
            result = response.json()
            print(f"  返回：{json.dumps(result, ensure_ascii=False)[:200]}")
            
            # 检查是否成功
            if result.get('code') == 200 or result.get('success'):
                print(f"\n✅ 成功！端点：{endpoint}")
                if 'data' in result and 'url' in result['data']:
                    print(f"   图片 URL: {result['data']['url']}")
                    break
                elif 'image_url' in result:
                    print(f"   图片 URL: {result['image_url']}")
                    break
        else:
            print(f"  返回 HTML (可能是 404 或错误页面)")
            
    except requests.exceptions.Timeout:
        print(f"  ❌ 超时")
    except Exception as e:
        print(f"  ❌ 错误：{e}")

print()
print("=" * 60)
print("测试完成！")
print()
print("下一步:")
print("1. 找到正确的端点后，更新 SKILL.md")
print("2. 批量生成小红书配图")
print("3. 上传到飞书云文档")
print("4. 关联飞书多维表格")
