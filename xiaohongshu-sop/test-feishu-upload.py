#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试飞书图片上传功能
无需阿里云 OSS，使用飞书云文档存储
"""

import requests
import json
import os
from pathlib import Path

# 配置
CONFIG_PATH = Path.home() / ".openclaw" / "config" / "feishu-app-config.json"

def load_config():
    """加载飞书配置"""
    if not CONFIG_PATH.exists():
        print(f"❌ 配置文件不存在：{CONFIG_PATH}")
        print("\n请创建配置文件：")
        print(f"mkdir -p ~/.openclaw/config")
        print(f"cat > {CONFIG_PATH} << 'EOF'")
        print("""{
  "feishu": {
    "app_id": "cli_xxxxx",
    "app_secret": "xxxxx",
    "folder_token": "xxxxx"  // 云文档文件夹 token（可选）
  }
}""")
        print("EOF")
        return None
    
    with open(CONFIG_PATH) as f:
        return json.load(f)['feishu']

def get_tenant_token(app_id, app_secret):
    """获取 tenant_access_token"""
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    payload = {
        "app_id": app_id,
        "app_secret": app_secret
    }
    resp = requests.post(url, json=payload).json()
    
    if resp.get('code') != 0:
        print(f"❌ 获取 token 失败：{resp}")
        return None
    
    return resp['tenant_access_token']

def upload_image(file_path, folder_token=None):
    """上传图片到飞书云文档"""
    config = load_config()
    if not config:
        return None
    
    token = get_tenant_token(config['app_id'], config['app_secret'])
    if not token:
        return None
    
    # 上传 API
    url = "https://open.feishu.cn/open-apis/drive/v1/medias/upload"
    headers = {"Authorization": f"Bearer {token}"}
    
    # 准备文件
    file_name = os.path.basename(file_path)
    files = {
        "file": (file_name, open(file_path, 'rb')),
        "file_type": (None, "image")
    }
    
    data = {"parent_type": "folder"}
    if folder_token:
        data["parent_node"] = folder_token
    
    resp = requests.post(url, headers=headers, files=files, data=data)
    result = resp.json()
    
    if result.get('code') != 0:
        print(f"❌ 上传失败：{result}")
        return None
    
    print(f"✅ 上传成功！")
    print(f"   文件 Token: {result['data']['file_token']}")
    print(f"   文件名：{file_name}")
    print(f"   大小：{result['data']['size']} bytes")
    
    return result['data']

def main():
    print("🧪 飞书图片上传测试（无需阿里云 OSS）")
    print("=" * 50)
    
    # 创建测试图片
    test_dir = Path.home() / ".openclaw" / "workspace" / "test-images"
    test_dir.mkdir(exist_ok=True)
    
    # 生成一个简单的测试图片（1x1 红色像素）
    test_image = test_dir / "test.png"
    
    # 使用 PIL 创建测试图片（如果可用）
    try:
        from PIL import Image
        img = Image.new('RGB', (100, 100), color='red')
        img.save(test_image)
        print(f"✅ 创建测试图片：{test_image}")
    except ImportError:
        print("⚠️  PIL 未安装，跳过图片创建测试")
        print("   请手动放置一张图片到测试目录")
        return
    
    # 测试上传
    print("\n📤 开始上传测试...")
    result = upload_image(str(test_image))
    
    if result:
        print("\n✅ 测试通过！飞书图片上传功能正常")
        print("\n下一步：")
        print("1. 在飞书多维表格中添加「附件」字段")
        print("2. 使用返回的 file_token 关联到记录")
        print("3. 开始生成小红书图文内容")
    else:
        print("\n❌ 测试失败，请检查配置")

if __name__ == "__main__":
    main()
