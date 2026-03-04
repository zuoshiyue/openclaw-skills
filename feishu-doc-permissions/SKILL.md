---
name: feishu-doc-permissions
description: >
  飞书文档权限管理工具。设置文档/云文档的协作者权限、分享链接、公开访问等。
  Use when: 需要分享飞书文档、设置协作者权限、管理文档访问控制。
  配置：需要飞书 App Token 和 Secret
---

# 飞书文档权限管理

管理飞书文档的协作者权限和分享设置。

## 功能

- 添加/移除协作者
- 设置权限级别（只读/编辑/管理员）
- 生成分享链接
- 管理公开访问设置

## 快速开始

### 添加协作者

```bash
node {baseDir}/feishu-share.js add <doc_token> <user_id> --permission edit
```

### 移除协作者

```bash
node {baseDir}/feishu-share.js remove <doc_token> <user_id>
```

### 生成分享链接

```bash
node {baseDir}/feishu-share.js share <doc_token> --public
```

### 查看权限列表

```bash
node {baseDir}/feishu-share.js list <doc_token>
```

## 权限级别

| 级别 | 说明 |
|------|------|
| `readonly` | 只读 |
| `edit` | 可编辑 |
| `admin` | 管理员 |

## 配置

详见 [setup-guide.md](setup-guide.md)

### 环境变量

```bash
export FEISHU_APP_TOKEN="your_app_token"
export FEISHU_APP_SECRET="your_app_secret"
```

## 注意事项

1. 需要飞书开放平台 App 权限
2. 用户 ID 使用 open_id 或 user_id
3. 公开分享谨慎使用
