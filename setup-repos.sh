#!/bin/bash

# ChatBox 项目 - 仓库设置脚本
# GitHub 用户名: sdd1014

echo "======================================"
echo "  ChatBox 项目仓库设置"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}步骤 1: 创建 GitHub 仓库${NC}"
echo ""
echo "请在浏览器中打开以下链接创建两个仓库："
echo ""
echo -e "${BLUE}前端仓库:${NC}"
echo "https://github.com/new?name=chatbox-frontend&description=AI+Chatbot+Frontend+-+React+%2B+Cloudflare+Pages&visibility=public"
echo ""
echo -e "${BLUE}后端仓库:${NC}"
echo "https://github.com/new?name=chatbox-workers&description=AI+Chatbot+Backend+-+Cloudflare+Workers+%2B+GraphQL&visibility=public"
echo ""
echo -e "${YELLOW}注意: 创建时不要勾选 'Add a README file'${NC}"
echo ""
read -p "按回车键继续，当你创建完两个仓库后..."

echo ""
echo -e "${YELLOW}步骤 2: 上传后端代码${NC}"
echo ""
cd /Users/dany/chatbox-workers-repo

if [ ! -d ".git" ]; then
    echo "初始化后端仓库..."
    git init
    git add .
    git commit -m "Initial commit - Cloudflare Workers GraphQL backend with DeepSeek/OpenAI integration"
    git branch -M main
fi

echo "设置后端 remote..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/sdd1014/chatbox-workers.git

echo "推送后端代码到 GitHub..."
git push -u origin main -f

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 后端代码上传成功！${NC}"
    echo -e "仓库地址: ${BLUE}https://github.com/sdd1014/chatbox-workers${NC}"
else
    echo "上传失败，请检查网络连接或仓库权限"
    exit 1
fi

echo ""
echo -e "${YELLOW}步骤 3: 上传前端代码${NC}"
echo ""
cd /Users/dany/react/chartbox-test

echo "更新前端 remote..."
git remote set-url origin https://github.com/sdd1014/chatbox-frontend.git

echo "提交并推送前端代码..."
git add .
git commit -m "Split repositories - React frontend with GraphQL integration" 2>/dev/null || echo "No changes to commit"
git push -u origin main -f

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 前端代码上传成功！${NC}"
    echo -e "仓库地址: ${BLUE}https://github.com/sdd1014/chatbox-frontend${NC}"
else
    echo "上传失败，请检查网络连接或仓库权限"
    exit 1
fi

echo ""
echo -e "${GREEN}======================================"
echo "  ✓ 仓库设置完成！"
echo "======================================${NC}"
echo ""
echo "接下来的步骤："
echo ""
echo "1. 前端仓库: https://github.com/sdd1014/chatbox-frontend"
echo "2. 后端仓库: https://github.com/sdd1014/chatbox-workers"
echo ""
echo "现在可以开始部署了！查看 QUICKSTART.md 了解部署步骤。"
echo ""
