# Netlify 部署教程

本教程将指导你如何将房地产帝国项目部署到 Netlify 平台。

## 目录
1. [前置准备](#前置准备)
2. [方法一：通过 Git 仓库部署（推荐）](#方法一通过-git-仓库部署推荐)
3. [方法二：直接上传构建目录](#方法二直接上传构建目录)
4. [配置说明](#配置说明)
5. [常见问题](#常见问题)

---

## 前置准备

### 1. 项目准备
确保你的项目已经准备好部署：
- 项目已完成或处于可部署状态
- 本地构建测试通过

### 2. 账号准备
- 注册 Netlify 账号：[https://app.netlify.com/signup](https://app.netlify.com/signup)
  - 支持使用 GitHub、GitLab、Bitbucket 或邮箱注册
- （可选）准备 GitHub/GitLab 仓库用于自动部署

### 3. 本地测试
在部署前，先在本地进行构建测试：

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

确保预览时项目能正常运行。

---

## 方法一：通过 Git 仓库部署（推荐）

这种方式支持自动部署，每次推送到 Git 仓库都会触发重新部署。

### 步骤 1：准备 Git 仓库
1. 将项目推送到 GitHub、GitLab 或 Bitbucket
2. 确保仓库是公开的或私有（Netlify 支持私有仓库）

### 步骤 2：连接 Netlify
1. 登录 [Netlify](https://app.netlify.com)
2. 点击 "Add new site" → "Import an existing project"
3. 选择你的 Git 提供商（GitHub/GitLab/Bitbucket）
4. 授权 Netlify 访问你的仓库
5. 选择要部署的仓库

### 步骤 3：配置构建设置
在部署配置页面，设置以下参数：

**基础设置：**
- **Branch to deploy**: `main` 或你的主分支名
- **Base directory**: 留空（项目根目录）
- **Build command**: `npm run build`
- **Publish directory**: `dist`

**高级设置（可选）：**
- 如需添加环境变量，点击 "Show advanced" → "New variable"

### 步骤 4：部署
1. 点击 "Deploy site" 开始部署
2. 等待部署完成（通常 1-3 分钟）
3. 部署成功后，Netlify 会分配一个随机域名（如 `random-name-12345.netlify.app`）

### 步骤 5：自定义域名（可选）
1. 在 Netlify 仪表板中，点击 "Site settings" → "Domain management"
2. 点击 "Add custom domain"
3. 输入你的域名并按照提示配置 DNS

---

## 方法二：直接上传构建目录

如果你不想使用 Git 仓库，可以直接上传构建好的文件。

### 步骤 1：本地构建
```bash
# 构建项目
npm run build
```

### 步骤 2：上传到 Netlify
1. 登录 [Netlify](https://app.netlify.com)
2. 点击 "Add new site" → "Deploy manually"
3. 将 `dist` 文件夹拖拽到上传区域
4. 等待上传和部署完成

---

## 配置说明

### 1. 路由配置（SPA 回退）
由于这是一个单页应用（SPA），需要配置路由回退规则，防止刷新页面时出现 404。

**创建 `public/_redirects` 文件：**

```
/*    /index.html   200
```

或者创建 `netlify.toml` 配置文件：

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. netlify.toml 配置示例
在项目根目录创建 `netlify.toml` 文件，包含完整配置：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 3. 自动部署设置
通过 Git 仓库部署时，Netlify 会自动：
- 监听你指定的分支
- 每次推送时自动构建和部署
- 提供部署预览功能

---

## 常见问题

### Q: 部署后刷新页面出现 404？
**A:** 这是 SPA 应用的常见问题。确保已配置 `_redirects` 文件或 `netlify.toml`，添加路由回退规则。

### Q: 构建失败？
**A:** 检查以下几点：
- 确保 `package.json` 中的 build 命令正确
- 确保 Node.js 版本兼容（建议 18+）
- 查看 Netlify 部署日志获取详细错误信息

### Q: 如何查看部署日志？
**A:** 在 Netlify 仪表板中，点击 "Deploys" → 选择某次部署 → 查看 "Deploy log"

### Q: 如何回滚到之前的版本？
**A:** 在 Netlify 仪表板中：
1. 点击 "Deploys"
2. 找到要回滚的版本
3. 点击 "Publish deploy"

### Q: 如何设置环境变量？
**A:** 在 Netlify 仪表板中：
1. 进入 "Site settings" → "Environment variables"
2. 点击 "Add a variable"
3. 输入变量名和值
4. 重新部署使变量生效

### Q: 部署速度慢怎么办？
**A:** 
- 确保 `node_modules` 已添加到 `.gitignore`
- 使用 Netlify 的缓存功能
- 考虑使用 Netlify Edge Functions 优化

---

## 后续优化

### 1. 启用 HTTPS
Netlify 默认提供免费的 HTTPS 证书，无需额外配置。

### 2. 设置部署通知
在 "Site settings" → "Build & deploy" → "Deploy notifications" 中配置通知方式（邮件、Slack 等）。

### 3. 配置部署预览
Netlify 会自动为每个 Pull Request 创建预览部署，方便团队协作。

---

## 联系与支持
- Netlify 文档：[https://docs.netlify.com](https://docs.netlify.com)
- 项目问题：查看项目 README 或提交 Issue
