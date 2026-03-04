# 图片生成方案说明

## 当前状态

### ⚠️ Nano Banana API

**问题：** API 端点无法连接

**已配置：**
- API Key: `EIFa200qOlby0INBTPxXADDqEDywfuGL`
- 端点：`https://api.nanobanana.ai/v1` (❌ 无法连接)

**可能原因：**
1. API 地址不正确
2. 服务未公开
3. 需要特殊认证方式

**需要确认：**
- 正确的 API 端点地址
- 认证方式（Bearer Token / API Key header）
- 请求格式

---

## ✅ 当前可用方案：人工配图

### 工作流程

```
1. AI 生成图文内容
   └─ 包含每页的配图建议（文字描述）

2. 人工根据建议配图
   ├─ 使用 Canva/稿定设计 等工具
   ├─ 或使用免费图库（Unsplash/Pexels）
   └─ 或用 AI 绘画工具（Midjourney/Stable Diffusion）

3. 上传到飞书云文档
   └─ 获取链接关联到表格记录
```

### 配图建议示例

**封面页：**
> 简洁工作流图，左侧输入（文章链接），右侧输出（小红书图文），
> 中间 OpenClaw logo，蓝白色调，扁平化设计

**痛点页：**
> 崩溃打工人表情包，办公桌前抓头，电脑屏幕显示待办事项，
> 夸张漫画风格

**流程图页：**
> 5 个节点垂直排列，箭头连接，每个节点有图标，简洁现代风格

---

## 🔧 替代图片生成方案

### 方案 A：Canva（推荐）

**网址：** https://www.canva.com

**优点：**
- ✅ 大量小红书模板
- ✅ 拖拽式编辑
- ✅ 免费素材多
- ✅ 支持中文

**流程：**
1. 搜索"小红书封面"模板
2. 替换文字和配色
3. 下载 PNG 上传飞书

---

### 方案 B：稿定设计

**网址：** https://www.gaoding.com

**优点：**
- ✅ 更多中文模板
- ✅ 一键抠图
- ✅ 批量套模板

---

### 方案 C：Stable Diffusion（本地）

**安装：**
```bash
# 需要 NVIDIA GPU
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
./webui.sh
```

**优点：**
- ✅ 完全免费
- ✅ 本地运行
- ✅ 高度可控

**缺点：**
- ❌ 需要 GPU
- ❌ 学习曲线陡

---

### 方案 D：Midjourney（质量最好）

**流程：**
1. Discord 登录 Midjourney
2. `/imagine prompt: [配图描述]`
3. 下载图片

**费用：** $10-30/月

---

### 方案 E：DALL-E 3（最简单）

**网址：** https://chat.openai.com

**提示词示例：**
```
Create a simple workflow diagram for Xiaohongshu (Little Red Book) 
content automation. Left side shows input (article link), right side 
shows output (social media post), center has OpenClaw logo. 
Blue and white color scheme, flat design, modern minimalist style.
No text in the image.
```

---

## 📋 建议流程

### 阶段 1：现在就能用

1. AI 生成内容 + 配图建议 ✅
2. 用 Canva/稿定设计 快速配图
3. 上传飞书云文档
4. 关联到表格记录

### 阶段 2：确认 Nano Banana

1. 联系 Nano Banana 获取正确 API 端点
2. 更新配置文件
3. 测试自动生成
4. 集成到 SOP 流程

### 阶段 3：完全自动化

1. AI 生成内容
2. 自动调用图片 API
3. 自动上传飞书
4. 自动创建表格记录
5. 人工审核后发布

---

## 💡 下一步

**请选择：**
1. 先用 Canva 手动配图测试完整流程？
2. 还是先确认 Nano Banana 的正确 API 地址？
