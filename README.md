# Web3 University App

基于 Next.js 15 构建的 Web3 大学应用程序，集成了以太坊钱包连接功能和现代前端开发实践。

## 功能特点

- 基于 Next.js 15 和 React 19
- 集成 RainbowKit 和 wagmi 实现以太坊钱包连接
- 使用 Tailwind CSS 4 构建响应式界面
- 支持 TypeScript
- 使用 Cloudflare Workers 部署

## 环境要求

- Node.js >= 20.0.0
- Yarn 1.22.19 (推荐的包管理器)

## 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/web3-university-app.git
cd web3-university-app

# 安装依赖
yarn install
```

### 开发

```bash
# 使用 Turbopack 启动开发服务器
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用程序。

### 构建与部署

```bash
# 构建应用
yarn build

# 启动生产环境服务器
yarn start

# 部署到 Cloudflare Workers
yarn deploy
```

## Cloudflare Workers 开发

```bash
# 构建 Worker 并启动本地预览
yarn preview

# 仅构建 Worker
yarn build:worker

# 本地开发 Worker
yarn dev:worker

# 生成 Cloudflare 环境类型定义
yarn cf-typegen
```

## 代码规范

项目使用严格的代码规范配置，包括 ESLint（基于 Airbnb 规范）、Prettier、Stylelint 和 Husky。

### 代码检查和格式化

```bash
# 运行 ESLint
yarn lint

# 运行 Stylelint
yarn lint:style

# 格式化代码
yarn format
```

Git 提交前会自动运行 lint-staged，确保代码符合规范。

## 主要依赖

### 核心框架

- [Next.js](https://nextjs.org/) - React 框架
- [React](https://react.dev/) - 用户界面库

### Web3 集成

- [RainbowKit](https://www.rainbowkit.com/) - 以太坊钱包连接 UI 组件
- [wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [viem](https://viem.sh/) - 以太坊交互工具库
- [web3-react](https://github.com/Uniswap/web3-react) - 以太坊钱包连接库

### UI 组件

- [Radix UI](https://www.radix-ui.com/) - 无样式、可访问的 UI 组件
- [Lucide React](https://lucide.dev/) - 图标库
- [React Hot Toast](https://react-hot-toast.com/) - 通知组件
- [React Jazzicon](https://github.com/NoahZinsmeister/react-jazzicon) - 以太坊风格头像

### 开发工具

- [TypeScript](https://www.typescriptlang.org/) - JavaScript 类型系统
- [ESLint](https://eslint.org/) - 代码检查工具
- [Prettier](https://prettier.io/) - 代码格式化工具
- [Stylelint](https://stylelint.io/) - CSS 检查工具
- [Husky](https://typicode.github.io/husky/) - Git hooks 工具
- [lint-staged](https://github.com/okonet/lint-staged) - 对暂存的 Git 文件运行检查

## 项目结构

```
web3-university-app/
├── .husky/                # Git hooks
├── public/                # 静态资源
├── src/
│   ├── app/               # 应用路由和页面
│   ├── components/        # React 组件
│   ├── config/            # 应用配置
│   ├── hooks/             # 自定义 React Hooks
│   ├── lib/               # 工具函数和库
│   ├── services/          # API 服务
│   ├── store/             # 状态管理
│   └── types/             # TypeScript 类型定义
├── .eslintrc.js           # ESLint 配置
├── .prettierrc.js         # Prettier 配置
├── .stylelintrc.js        # Stylelint 配置
├── next.config.js         # Next.js 配置
├── tailwind.config.js     # Tailwind CSS 配置
└── tsconfig.json          # TypeScript 配置
```

