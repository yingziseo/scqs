# SEO文章批量生成器

基于智谱GLM-4模型的SEO文章批量生成Web应用，具备Apple风格高级UI设计，支持中英双语界面。

## 功能特点

- 🎯 **智能标题生成** - 输入关键词自动生成20个SEO优化标题
- 📝 **批量文章生成** - 队列式逐篇生成，4-7个H2小标题结构
- 🌍 **20种语言支持** - 支持中英日韩等20种主流语言内容生成
- 📊 **字数可控** - 自由设置文章字数范围（200-2000字）
- 👁️ **在线预览** - 实时预览生成的文章内容
- 🔄 **重新生成** - 不满意可单篇重新生成
- 📦 **批量导出** - 打包下载ZIP，每篇文章一个TXT
- 🌐 **双语界面** - 支持中文/英文界面切换

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (状态管理)
- react-i18next (国际化)
- Framer Motion (动画)

### 后端
- Express.js
- SQLite3
- 智谱GLM-4 API

## 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖
npm run install:all
```

### 2. 配置API密钥

编辑 `server/.env` 文件：

```
GLM_API_KEY=your_api_key_here
PORT=3001
```

### 3. 启动开发服务器

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:client  # 前端 http://localhost:5173
npm run dev:server  # 后端 http://localhost:3001
```

## 项目结构

```
/seo-article-generator
├── /client              # 前端 React 应用
│   ├── /src
│   │   ├── /components  # UI组件
│   │   ├── /hooks       # 自定义Hooks
│   │   ├── /store       # Zustand状态
│   │   ├── /i18n        # 国际化文件
│   │   └── /lib         # 工具函数
│   └── package.json
├── /server              # 后端 Express 应用
│   ├── /src
│   │   ├── /routes      # API路由
│   │   ├── /services    # 业务逻辑
│   │   └── /db          # 数据库
│   └── package.json
└── package.json
```

## API接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/titles/generate | 生成20个SEO标题 |
| POST | /api/articles/generate | 生成单篇文章 |
| POST | /api/articles/regenerate/:id | 重新生成文章 |
| POST | /api/export/zip | 导出ZIP压缩包 |

## 使用流程

1. 输入目标关键词
2. 选择内容语言（20种可选）
3. 设置文章字数范围
4. 点击生成标题，获得20个SEO标题
5. 勾选需要的标题（支持全选）
6. 点击生成文章，等待队列完成
7. 在线预览文章，不满意可重新生成
8. 批量导出为ZIP压缩包

## 许可证

MIT
