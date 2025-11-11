# ChatBox - AI 聊天机器人前端

基于 React 的 AI 聊天机器人前端应用，部署在 Cloudflare Pages。

## 功能特性

- ✅ 现代化聊天界面（深色主题）
- ✅ Markdown 消息渲染
- ✅ 代码高亮显示
- ✅ 实时消息加载状态
- ✅ 错误处理
- ✅ 自动滚动到最新消息
- ✅ GraphQL API 集成
- ✅ 响应式设计

## 技术栈

- **框架**: React 19.2.0
- **样式**: 自定义 CSS（玻璃态效果 + 渐变）
- **Markdown**: react-markdown
- **代码高亮**: react-syntax-highlighter
- **部署**: Cloudflare Pages
- **CI/CD**: GitHub Actions

## 项目结构

```
chatbox-frontend/
├── src/
│   ├── components/
│   │   ├── ChatBox.js       # 主聊天组件
│   │   └── ChatBox.css      # 聊天界面样式
│   ├── App.js               # 根组件
│   ├── App.css
│   └── index.js
├── public/
│   └── _redirects           # Cloudflare Pages 路由配置
├── .github/workflows/
│   └── deploy.yml           # CI/CD 配置
└── package.json
```

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/chatbox-frontend.git
cd chatbox-frontend
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
REACT_APP_GRAPHQL_URL=https://chatbox-workers.YOUR_ACCOUNT.workers.dev/graphql
```

**重要**: 替换为你的实际 Workers GraphQL 端点 URL！

### 4. 本地开发

```bash
npm start
```

访问 http://localhost:3000

### 5. 构建

```bash
npm run build
```

## 部署到 Cloudflare Pages

### 方式一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 进入 "Workers & Pages"

2. **创建 Pages 项目**
   - 点击 "Create application" → "Pages"
   - 选择 "Connect to Git"
   - 授权并选择此仓库

3. **配置构建设置**
   ```
   Project name: chatbox-frontend
   Production branch: main
   Build command: npm run build
   Build output directory: build
   Root directory: /
   ```

4. **添加环境变量**
   - Settings → Environment variables
   - 添加：`REACT_APP_GRAPHQL_URL`
   - 值：你的 Workers GraphQL 端点

5. **配置自定义域名**
   - Custom domains → Set up a custom domain
   - 输入：`shidd.site`

### 方式二：通过 GitHub Actions

仓库已配置好 GitHub Actions，只需：

1. 在 GitHub 仓库 Settings → Secrets 中添加：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `REACT_APP_GRAPHQL_URL`

2. 推送代码到 main 分支：
   ```bash
   git push origin main
   ```

## 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `REACT_APP_GRAPHQL_URL` | Workers GraphQL API 端点 | `https://chatbox-workers.xxx.workers.dev/graphql` |

## 界面设计

- 深色主题设计
- 玻璃态效果（Glassmorphism）
- 渐变色彩
- 平滑动画效果

## 功能说明

### 消息发送
1. 用户输入消息
2. 显示"正在思考..."加载状态
3. 调用 GraphQL API
4. 渲染 AI 响应（支持 Markdown）

### Markdown 支持
- 文本格式（粗体、斜体等）
- 代码块（带语法高亮）
- 列表
- 引用
- 链接

### 错误处理
- 网络错误提示
- API 错误提示
- 可点击关闭的错误横幅

## 相关项目

- **后端仓库**: https://github.com/YOUR_USERNAME/chatbox-workers
- **在线演示**: https://shidd.site

## 本地开发注意事项

确保后端 Workers 已部署并运行，或者在本地运行：

```bash
# 在后端仓库目录
cd ../chatbox-workers
npm run dev
```

然后在前端 `.env.local` 中使用本地端点：
```
REACT_APP_GRAPHQL_URL=http://localhost:8787/graphql
```

## 故障排除

### 问题 1: 无法连接到后端

检查环境变量 `REACT_APP_GRAPHQL_URL` 是否正确配置。

### 问题 2: CORS 错误

确保后端 Workers 已正确配置 CORS，允许你的前端域名。

### 问题 3: 构建失败

```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 更新部署

直接推送代码，CI/CD 会自动部署：

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

## License

MIT
