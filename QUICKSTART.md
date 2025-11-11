# 快速开始 - 创建两个独立仓库

## 🎯 目标

创建两个 GitHub 仓库并完成部署：
1. **chatbox-frontend** - 前端仓库
2. **chatbox-workers** - 后端仓库

---

## 📁 步骤 1: 准备后端仓库

### 1.1 后端文件位置

后端代码已经为你准备好在：
```
/Users/dany/chatbox-workers-repo/
```

### 1.2 创建后端 GitHub 仓库

1. 打开 GitHub: https://github.com/new
2. 仓库名: `chatbox-workers`
3. 选择 Public
4. **不要**初始化 README
5. 点击 "Create repository"

### 1.3 上传后端代码

```bash
cd /Users/dany/chatbox-workers-repo
git init
git add .
git commit -m "Initial commit - Cloudflare Workers backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chatbox-workers.git
git push -u origin main
```

---

## 📁 步骤 2: 准备前端仓库

### 2.1 前端文件位置

前端代码在当前目录：
```
/Users/dany/react/chartbox-test/
```

### 2.2 创建前端 GitHub 仓库

1. 打开 GitHub: https://github.com/new
2. 仓库名: `chatbox-frontend`
3. 选择 Public
4. **不要**初始化 README
5. 点击 "Create repository"

### 2.3 上传前端代码

```bash
cd /Users/dany/react/chartbox-test
git remote set-url origin https://github.com/YOUR_USERNAME/chatbox-frontend.git
git add .
git commit -m "Initial commit - React frontend"
git push -u origin main
```

---

## 🚀 步骤 3: 部署后端（Cloudflare Workers）

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 进入后端目录
cd /Users/dany/chatbox-workers-repo

# 安装依赖
npm install

# 配置 API Key（选择一个）
wrangler secret put DEEPSEEK_API_KEY
# 或
wrangler secret put OPENAI_API_KEY

# 部署
npm run deploy

# 记录输出的 URL，例如：
# https://chatbox-workers.YOUR_ACCOUNT.workers.dev
```

---

## 🌐 步骤 4: 部署前端（Cloudflare Pages）

### 通过 Cloudflare Dashboard

1. 访问 https://dash.cloudflare.com/
2. Workers & Pages → Create application → Pages
3. Connect to Git → 选择 `chatbox-frontend` 仓库
4. 配置：
   - Build command: `npm run build`
   - Build output: `build`
5. 环境变量：
   - Name: `REACT_APP_GRAPHQL_URL`
   - Value: `https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql`
6. Save and Deploy
7. 配置域名 `shidd.site`

---

## ✅ 步骤 5: 测试

### 测试后端
```bash
curl -X POST https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello }"}'
```

### 测试前端
访问: `https://shidd.site`

---

## 📋 提交作业

提交以下 3 个链接：

1. **前端仓库**: `https://github.com/YOUR_USERNAME/chatbox-frontend`
2. **后端仓库**: `https://github.com/YOUR_USERNAME/chatbox-workers`
3. **在线网站**: `https://shidd.site`

---

## 🆘 需要帮助？

查看完整文档: [DEPLOYMENT.md](DEPLOYMENT.md)

常见问题：
- API Key 获取: https://platform.deepseek.com/
- Cloudflare 文档: https://developers.cloudflare.com/
