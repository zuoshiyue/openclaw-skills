# 飞书图片上传方案（无需阿里云 OSS）

## 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|---------|
| **飞书云文档** | 免费、集成好、无需额外配置 | 需要飞书 API 权限 | 推荐 ✅ |
| **飞书附件** | 简单直接 | 有大小限制 | 小图片 |
| **本地存储** | 完全控制 | 需要额外同步 | 开发测试 |

---

## 方案 A：飞书云文档 API

### 前置条件

1. 飞书应用已创建
2. 开通「云文档」权限
3. 获取 App Token 和 App Secret

### 上传流程

```python
import requests
import base64

# 配置
APP_ID = "cli_xxxxx"
APP_SECRET = "xxxxx"
FOLDER_TOKEN = "xxxxx"  # 云文档文件夹 token

# 1. 获取 tenant_access_token
def get_tenant_token():
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    payload = {
        "app_id": APP_ID,
        "app_secret": APP_SECRET
    }
    resp = requests.post(url, json=payload).json()
    return resp['tenant_access_token']

# 2. 上传图片到云文档
def upload_image(file_path, file_name):
    token = get_tenant_token()
    url = "https://open.feishu.cn/open-apis/drive/v1/medias/upload"
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    files = {
        "file": (file_name, open(file_path, 'rb')),
        "file_type": (None, "image")
    }
    
    data = {
        "parent_type": "folder",
        "parent_node": FOLDER_TOKEN
    }
    
    resp = requests.post(url, headers=headers, files=files, data=data)
    return resp.json()

# 3. 获取公开链接（可选）
def get_public_link(file_token):
    token = get_tenant_token()
    url = f"https://open.feishu.cn/open-apis/drive/v1/files/{file_token}/public_link"
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(url, headers=headers, json={"type": "anyone_can_view"})
    return resp.json()
```

### 输出

```json
{
  "file_token": "xxxxx",
  "file_name": "image.jpg",
  "size": 123456,
  "public_url": "https://xxxx.feishu.cn/drive/file/xxxxx"
}
```

---

## 方案 B：飞书多维表格附件字段

### 流程

1. 在多维表格创建「附件」类型字段
2. 通过 API 上传文件并关联到记录

```python
# 上传并创建记录
def create_record_with_image(table_id, fields):
    token = get_tenant_token()
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{APP_TOKEN}/tables/{table_id}/records"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "fields": fields
        # 附件字段格式：{"attachment": [{"file_token": "xxxx"}]}
    }
    
    resp = requests.post(url, headers=headers, json=payload)
    return resp.json()
```

---

## 方案 C：使用飞书机器人直接发送

### 最简单方案

如果只需要在飞书内查看，可以直接让机器人发送图文消息：

```python
def send_image_message(user_id, image_path, text):
    token = get_tenant_token()
    url = "https://open.feishu.cn/open-apis/im/v1/messages"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 先上传图片
    image_token = upload_image(image_path)
    
    # 发送富文本消息
    payload = {
        "receive_id": user_id,
        "msg_type": "image",
        "content": json.dumps({"image_key": image_token})
    }
    
    params = {"receive_id_type": "user"}
    resp = requests.post(url, headers=headers, params=params, json=payload)
    return resp.json()
```

---

## 推荐方案

**对于小红书 SOP，推荐组合使用：**

1. **图片存储** → 飞书云文档（方案 A）
2. **数据管理** → 飞书多维表格（关联云文档链接）
3. **内容审核** → 飞书机器人发送预览

**优势：**
- ✅ 完全免费
- ✅ 无需额外配置
- ✅ 飞书生态内闭环
- ✅ 权限可控
