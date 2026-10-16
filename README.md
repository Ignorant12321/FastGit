<div align="center">

# FastGit — GitHub 镜像加速

**部署一个边缘函数，把 `github.com` 换成你自己的域名即可访问。**  
网页、静态资源、Raw 文件、Release 附件、仓库压缩包，以及 Git Smart HTTP 请求全部走镜像代理。

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Runtime-Cloudflare_Workers-f6821f.svg?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![阿里云 ESA](https://img.shields.io/badge/Runtime-阿里云_ESA-FF6A00.svg?logo=alibabacloud&logoColor=white)](https://www.aliyun.com/product/esa)
[![Linux Do](https://img.shields.io/badge/Linux%20Do-Community-ffb003?style=flat&logo=data:image/svg%2Bxml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNsaXBQYXRoIGlkPSJhIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI0NyIvPjwvY2xpcFBhdGg+PGNpcmNsZSBmaWxsPSIjZjBmMGYwIiBjeD0iNjAiIGN5PSI2MCIgcj0iNTAiLz48cmVjdCBmaWxsPSIjMWMxYzFlIiBjbGlwLXBhdGg9InVybCgjYSkiIHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzMCIvPjxyZWN0IGZpbGw9IiNmMGYwZjAiIGNsaXAtcGF0aD0idXJsKCNhKSIgeD0iMTAiIHk9IjQwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIi8+PHJlY3QgZmlsbD0iI2ZmYjAwMyIgY2xpcC1wYXRoPSJ1cmwoI2EpIiB4PSIxMCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiLz48L3N2Zz4=)](https://linux.do)

**[📖 Cloudflare 部署教程](DEPLOY.md)　·　[📖 阿里云 ESA 部署教程](ESA-DEPLOY.md)**

</div>

---

## 功能特性

| 功能 | 说明 |
|------|------|
| GitHub 网页镜像 | 打开镜像域名即可访问 GitHub 官方界面 |
| 静态资源代理 | 头像、图片、CSS/JS 等静态资源自动改写到镜像 |
| Raw 文件代理 | `raw.githubusercontent.com` 内容通过镜像访问 |
| Release 代理 | 版本发布附件、源码压缩包可正常下载 |
| Git Smart HTTP | 支持 `git clone`、`git fetch` 等命令 |
| 完整链接透传 | 支持 `<镜像域名>/https://github.com/owner/repo` 写法 |
| 双平台部署 | 同时支持 Cloudflare Workers 与阿里云 ESA Pages |
| 可选网页登录 | 默认关闭，按需通过环境变量开启 |
| 域名白名单 | 只允许访问 GitHub 相关上游域名 |
| 国内外分流 | 海外访客直接跳转 GitHub，国内访客走镜像代理 |
| 健康检查页 | `/healthy` 显示上游状态、版本、耗时 |

---

## 架构说明

```
浏览器
  │
  ▼
Cloudflare Workers / 阿里云 ESA
  │  worker-cloudflare.js / worker-esa.js
  │  代理网页、静态资源、Raw、Release、Git Smart HTTP
  ▼
GitHub 上游（github.com / raw.githubusercontent.com / codeload.github.com ...）
```

---

## 项目结构

```
FastGit/
├── worker-cloudflare.js     # Cloudflare Workers 入口
├── wrangler.jsonc           # Cloudflare Workers 部署配置
├── worker-esa.js            # 阿里云 ESA Pages 入口
├── esa.jsonc                # 阿里云 ESA Pages 构建配置
├── DEPLOY.md                # Cloudflare Workers 部署教程
├── ESA-DEPLOY.md            # 阿里云 ESA Pages 部署教程
└── LICENSE
```

---

## 快速部署

> 完整教程见 **[Cloudflare 部署教程](DEPLOY.md)** / **[阿里云 ESA 部署教程](ESA-DEPLOY.md)**

### Cloudflare Workers

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. **Workers & Pages** → **Create application** → **Create Worker**，命名后部署。
3. Worker **Overview** → **Edit code**，删除示例代码，粘贴 [worker-cloudflare.js](worker-cloudflare.js) 全部内容。
4. 点击 **Deploy**。
5. 打开 `*.workers.dev` 地址验证是否可用，需要自定义域名参考 [DEPLOY.md](DEPLOY.md)。

### 阿里云 ESA Pages

1. 进入 ESA 控制台 **边缘计算和 AI** → **函数和 Pages**。
2. **创建** → **导入 GitHub 仓库**，选择本仓库 `main` 分支。
3. `esa.jsonc` 会自动指定 `worker-esa.js` 为入口，无需额外配置。
4. **开始部署**，完成后绑定自定义域名。

---

## 使用方式

假设部署后的域名是 `git.example.com`，把链接里的 `github.com` 换成它即可：

```text
GitHub：https://github.com/cloudflare/workers-sdk
镜像：https://git.example.com/cloudflare/workers-sdk
```

克隆仓库：

```powershell
git clone https://git.example.com/owner/repository.git
```

替换已有仓库的远程地址：

```powershell
git remote set-url origin https://git.example.com/owner/repository.git
git fetch origin
```

---

## 配置项

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `ALLOW_LOGIN` | `false` | 设为 `true` 才允许通过镜像打开 GitHub 登录页 |
| `SOURCE_REPOSITORY` | `ZhangShengFan/FastGit` | `/healthy` 显示版本信息时读取的仓库 |
| `CACHE_TTL` | `3600` | 静态资源缓存秒数，`0` 关闭缓存，最大 `86400` |
| `PROXY_COUNTRIES` | `CN` | 逗号分隔的国家/地区代码（ISO 3166-1 alpha-2），仅这些地区走代理，其余直接跳转 GitHub；设为 `*` 表示所有访客都走代理（关闭分流）|

Cloudflare Workers：**Settings** → **Variables and Secrets**  
阿里云 ESA：项目 **基本信息** → **构建信息** → **修改**

---

## 注意事项

- 默认不要开启 `ALLOW_LOGIN`；开启后 GitHub 登录表单、验证码、浏览器会话都会经过你的边缘函数，只适合自用实例
- 分流依赖访客 IP 归属地：Cloudflare 读取 `cf.country`，ESA 需在站点开启**添加访问者位置标头**（注入 `ali-ip-country`）。使用代理或 VPN 的访客可能被判定为海外而直接跳转 GitHub
- 海外访客返回 `302`（GET/HEAD）或 `307`（其它方法，保证 git 等请求不丢方法与正文）跳转到真实 GitHub；`/healthy`、登录禁用页等本地页面不受影响
- 通行密钥、部分风控流程仍可能要求原始 `github.com` 域名，镜像下不保证生效
- 自定义域名建议直接用平台的 Custom Domain，不要叠加多层 CNAME，否则 Git 客户端可能 TLS 握手失败
- 不记录 Cookie、Authorization、令牌、表单内容或请求正文；不缓存私有内容和下载文件

---

## License

[MIT License](LICENSE)

## 友链

[![Linux Do](https://img.shields.io/badge/Linux%20Do-Community-ffb003?style=flat&logo=data:image/svg%2Bxml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNsaXBQYXRoIGlkPSJhIj48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI0NyIvPjwvY2xpcFBhdGg+PGNpcmNsZSBmaWxsPSIjZjBmMGYwIiBjeD0iNjAiIGN5PSI2MCIgcj0iNTAiLz48cmVjdCBmaWxsPSIjMWMxYzFlIiBjbGlwLXBhdGg9InVybCgjYSkiIHg9IjEwIiB5PSIxMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIzMCIvPjxyZWN0IGZpbGw9IiNmMGYwZjAiIGNsaXAtcGF0aD0idXJsKCNhKSIgeD0iMTAiIHk9IjQwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIi8+PHJlY3QgZmlsbD0iI2ZmYjAwMyIgY2xpcC1wYXRoPSJ1cmwoI2EpIiB4PSIxMCIgeT0iODAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiLz48L3N2Zz4=)](https://linux.do)

## 改进

### 网址拼接

也支持把完整的 GitHub 链接直接拼在镜像域名后面（gh-proxy 风格的链接透传）：

```text
镜像：https://git.example.com/https://github.com/cloudflare/workers-sdk
```

| 请求                                                     | 转发到                           |
| -------------------------------------------------------- | -------------------------------- |
| xxx.com/A/B                                              | github.com/A/B                   |
| xxx.com/https://github.com/A/B                           | github.com/A/B                   |
| xxx.com/http://github.com/A/B                            | github.com/A/B（自动升级 https） |
| xxx.com/https://github.com/A/B?tab=readme                | github.com/A/B?tab=readme        |
| xxx.com/https%3A%2F%2Fgithub.com%2FA%2FB                 | github.com/A/B                   |
| xxx.com/https://raw.githubusercontent.com/A/B/main/x.txt | raw.githubusercontent.com/...    |
| xxx.com/https://evil.com/A/B 等 4 个恶意样例             | 全部被拦截 ✅                     |

### 国内外分流

通过 `PROXY_COUNTRIES` 按访客 IP 归属地分流：国内访客走镜像代理，海外访客直接跳转真实 GitHub。

```text
国内（默认 CN）：https://git.example.com/cloudflare/workers-sdk  →  走代理
海外（其它地区）：https://git.example.com/cloudflare/workers-sdk  →  跳转 https://github.com/cloudflare/workers-sdk
```

- 默认 `PROXY_COUNTRIES=CN`，只代理中国大陆；可改为 `CN,HK,MO,TW` 等逗号分隔列表
- 设为 `*` 关闭分流，所有访客都走代理
- 无法识别归属地时一律走代理，避免误伤国内访客
- 归属地来源：Cloudflare 读取 `cf.country`；ESA 需在站点开启**添加访问者位置标头**（`ali-ip-country`）
- `GET`/`HEAD` 返回 `302`，其它方法（如 git push）返回 `307`，保证方法与请求体不丢失；`/healthy`、登录禁用页等本地页面不受影响
