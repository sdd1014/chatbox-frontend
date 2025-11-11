# ChatBox 完整部署指南

## 项目概述

这是一个基于 React + Cloudflare Workers + GraphQL 的 AI 聊天机器人项目。

- **前端**: React 应用，部署在 Cloudflare Pages
- **后端**: Cloudflare Workers，提供 GraphQL API
- **AI 服务**: 支持 DeepSeek 或 OpenAI
- **域名**: shidd.site

## 🏗️ 项目架构（两个独立仓库）

```
前端仓库 (chatbox-frontend)          后端仓库 (chatbox-workers)
├── src/                            ├── src/
│   ├── components/                 │   └── index.js (GraphQL API)
│   │   ├── ChatBox.js              ├── package.json
│   │   └── ChatBox.css             └── wrangler.toml
│   └── App.js
├── .github/workflows/
│   └── deploy.yml
└── package.json

部署平台:                           部署平台:
Cloudflare Pages                    Cloudflare Workers
域名: shidd.site                    URL: *.workers.dev
```

## 📝 准备工作

### 1. 创建两个 GitHub 仓库

在 GitHub 上创建两个仓库：
- `chatbox-frontend` - 前端仓库
- `chatbox-workers` - 后端仓库

### 2. 上传代码

**前端仓库** (当前仓库):
```bash
# 在 chatbox-test/ 目录
git remote set-url origin https://github.com/YOUR_USERNAME/chatbox-frontend.git
git add .
git commit -m "Initial commit - Frontend"
git push -u origin main
```

**后端仓库** (在 `../chatbox-workers-repo/` 目录):
```bash
cd ../chatbox-workers-repo
git init
git add .
git commit -m "Initial commit - Backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chatbox-workers.git
git push -u origin main
```

---

## 🚀 第一步：部署 Cloudflare Workers（后端）

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

浏览器会打开让你授权。

### 3. 克隆并进入后端仓库

```bash
git clone https://github.com/YOUR_USERNAME/chatbox-workers.git
cd chatbox-workers
npm install
```

### 4. 配置 AI API Key

选择你要使用的服务：

**使用 DeepSeek（推荐）：**
```bash
wrangler secret put DEEPSEEK_API_KEY
# 输入你的 DeepSeek API Key
```

**使用 OpenAI：**
```bash
wrangler secret put OPENAI_API_KEY
# 输入你的 OpenAI API Key

# 修改 wrangler.toml
# AI_SERVICE = "openai"
```

### 5. 部署 Workers

```bash
npm run deploy
```

部署成功后，记录 Workers URL：
```
https://chatbox-workers.YOUR_ACCOUNT.workers.dev
```

**GraphQL 端点：**
```
https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql
```

### 6. 测试后端

```bash
curl -X POST https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello }"}'
```

---

## 🌐 第二步：部署前端到 Cloudflare Pages

### 方式一：通过 Cloudflare Dashboard（推荐新手）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 进入 "Workers & Pages"

2. **创建 Pages 项目**
   - 点击 "Create application" → "Pages"
   - 选择 "Connect to Git"
   - 授权并选择 `chatbox-frontend` 仓库

3. **配置构建设置**
   ```
   Project name: chatbox-frontend
   Production branch: main
   Build command: npm run build
   Build output directory: build
   Root directory: /
   ```

4. **添加环境变量**
   - Settings → Environment variables → Add variable
   ```
   Name: REACT_APP_GRAPHQL_URL
   Value: https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql
   ```
   **重要**：替换为第一步获得的实际 Workers URL！

5. **保存并部署**
   - 点击 "Save and Deploy"
   - 等待构建完成

6. **配置自定义域名**
   - Custom domains → Set up a custom domain
   - 输入：`shidd.site`
   - Cloudflare 会自动配置 DNS

### 方式二：通过 GitHub Actions（自动化）

前端仓库已配置好 GitHub Actions，按以下步骤启用：

1. **获取 Cloudflare 凭证**
   - API Token: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Account ID: Workers & Pages 页面右侧可见

2. **在前端 GitHub 仓库添加 Secrets**
   - 仓库 Settings → Secrets and variables → Actions
   - 添加 3 个 secrets：
     - `CLOUDFLARE_API_TOKEN`
     - `CLOUDFLARE_ACCOUNT_ID`
     - `REACT_APP_GRAPHQL_URL`

3. **推送代码自动部署**
   ```bash
   git push origin main
   ```

---

## ✅ 第三步：测试完整系统

### 1. 测试后端 API

```bash
# 测试连接
curl -X POST https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { hello }"}'

# 测试 AI 聊天
curl -X POST https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { sendMessage(message: \"你好\") { content role } }"}'
```

### 2. 访问前端

- Cloudflare Pages: `https://chatbox-frontend.pages.dev`
- 自定义域名: `https://shidd.site`

### 3. 验证功能

在浏览器打开前端，测试：
- ✅ 输入消息并发送
- ✅ 看到"正在思考..."加载状态
- ✅ 收到 AI 回复
- ✅ Markdown 和代码高亮正常显示

---

## 📦 项目仓库结构

### 前端仓库 (chatbox-frontend)
```
chatbox-frontend/
├── src/
│   ├── components/
│   │   ├── ChatBox.js
│   │   └── ChatBox.css
│   ├── App.js
│   └── index.js
├── public/
│   └── _redirects
├── .github/workflows/
│   └── deploy.yml
└── package.json
```

### 后端仓库 (chatbox-workers)
```
chatbox-workers/
├── src/
│   └── index.js
├── package.json
├── wrangler.toml
└── .gitignore
```

---

## 获取 API Keys

### DeepSeek API Key
1. 访问 https://platform.deepseek.com/
2. 注册账号并登录
3. 进入 "API Keys" 页面创建新的 API Key

### OpenAI API Key
1. 访问 https://platform.openai.com/
2. 注册账号并登录
3. 进入 "API Keys" 页面创建新的 API Key

---

## 常见问题

### 1. Workers 部署后提示 "API key is not configured"

确保你已经设置了环境变量：
```bash
cd workers
wrangler secret put DEEPSEEK_API_KEY  # 或 OPENAI_API_KEY
```

### 2. 前端无法连接到后端

- 检查 `REACT_APP_GRAPHQL_URL` 环境变量是否正确配置
- 确保 Workers URL 包含 `/graphql` 路径
- 检查浏览器控制台的错误信息

### 3. CORS 错误

Workers 代码中已经配置了 CORS，如果仍有问题，可以在 `workers/src/index.js` 中修改 `cors.origin` 为你的具体域名。

### 4. 修改 AI 模型

编辑 `workers/src/index.js` 中的以下参数：
- DeepSeek: `model: 'deepseek-chat'`
- OpenAI: `model: 'gpt-3.5-turbo'` 或 `'gpt-4'`

---

## 本地开发

### 前端开发
```bash
# 项目根目录
npm start
# 访问 http://localhost:3000
```

### Workers 本地测试
```bash
cd workers
npm install
npm run dev
# Workers 会运行在 http://localhost:8787
```

确保在本地开发时，前端的 `REACT_APP_GRAPHQL_URL` 指向 `http://localhost:8787/graphql`。

---

## 📤 提交作业

### 需要提交的内容

1. **前端 GitHub 仓库链接**
   - `https://github.com/YOUR_USERNAME/chatbox-frontend`

2. **后端 GitHub 仓库链接**
   - `https://github.com/YOUR_USERNAME/chatbox-workers`

3. **部署的网站链接**
   - 域名: `https://shidd.site`
   - 或 Pages URL: `https://chatbox-frontend.pages.dev`

### 验证清单

- ✅ 购买并配置域名 `shidd.site`
- ✅ React 前端部署在 Cloudflare Pages
- ✅ CI/CD 配置完成（GitHub Actions）
- ✅ Workers 后端部署成功
- ✅ Workers 使用 GraphQL API
- ✅ Workers 调用 DeepSeek 或 OpenAI
- ✅ 前端和 Workers 成功通信
- ✅ 聊天功能正常运行

---

## 技术栈总结

- **前端框架**: React 19.2.0
- **UI**: 自定义 CSS（深色主题 + 玻璃态效果）
- **Markdown 渲染**: react-markdown + react-syntax-highlighter
- **后端**: Cloudflare Workers
- **API 层**: GraphQL (graphql-yoga)
- **AI 服务**: DeepSeek API / OpenAI API
- **部署平台**: Cloudflare Pages + Workers
- **CI/CD**: GitHub Actions
- **域名**: shidd.site

---

## 更新和维护

### 更新前端
直接推送代码到 GitHub，CI/CD 会自动部署：
```bash
git add .
git commit -m "Update frontend"
git push
```

### 更新 Workers
```bash
cd workers
# 修改代码后
npm run deploy
```

### 更新环境变量
```bash
# Workers
cd workers
wrangler secret put VARIABLE_NAME

# Pages (通过 Dashboard)
Cloudflare Dashboard → Pages → Settings → Environment variables
```

---

祝你部署成功！🚀
