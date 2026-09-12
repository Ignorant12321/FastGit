# FastGit

[![一键部署到 Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ZhangShengFan/FastGit)
[![部署到阿里云 ESA Pages](https://img.shields.io/badge/部署到阿里云_ESA_Pages-FF6A00?style=for-the-badge)](https://esa.console.aliyun.com/edge/pages/list)

一个部署在 Cloudflare Workers 或阿里云 ESA Pages 上的 GitHub 镜像 Worker。

部署后，访问自己的域名就是 GitHub 的镜像入口。网页、头像、静态资源、Raw 文件、Release 附件、仓库压缩包，以及 Git Smart HTTP 请求都会转发到 GitHub 相关上游。

> FastGit 与 GitHub、Cloudflare、阿里云没有官方关系。请自行遵守所在地法律法规，以及 GitHub 和边缘服务商的服务条款。

## 有什么用

- 直接打开 GitHub 页面，不需要改前端地址
- 静态资源、Raw 文件、Release 下载和源码压缩包会自动走镜像
- 支持 `git clone`、`git fetch` 等 Smart HTTP 请求
- 提供 `/healthy` 状态页
- 默认不开放 GitHub 网页登录，也只缓存公开静态资源

仓库文件不多：

| 文件 | 用途 |
| --- | --- |
| `worker-cloudflare.js` | Cloudflare Workers 入口 |
| `wrangler.jsonc` | Cloudflare Workers 部署配置 |
| `worker-esa.js` | 阿里云 ESA Pages 入口 |
| `esa.jsonc` | 阿里云 ESA Pages 构建配置 |
| `DEPLOY.md` | Cloudflare Workers 完整部署教程 |
| `ESA-DEPLOY.md` | 阿里云 ESA Pages 完整部署教程 |

## 部署

### Cloudflare Workers

点上面的 **一键部署到 Cloudflare** 即可。部署配置会自动读取根目录中的 `wrangler.jsonc`。

如果想直接在 Dashboard 里部署：

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入 **Workers & Pages**，点击 **Create application**。
3. 选择 **Create Worker**，命名后部署。
4. 在 Worker 的 **Overview** 页面点击 **Edit code**。
5. 删除示例代码，复制 [worker-cloudflare.js](worker-cloudflare.js) 的全部内容。
6. 点击 **Deploy**。

详细的首次部署、环境变量和自定义域名配置见 [DEPLOY.md](DEPLOY.md)。

### 阿里云 ESA Pages

点上面的 ESA 按钮进入控制台，然后导入本仓库：

1. 进入 **边缘计算和 AI** > **函数和 Pages**。
2. 点击 **创建**，选择 **导入 GitHub 仓库**。
3. 选择本仓库和 `main` 分支。
4. `esa.jsonc` 会自动使用 `worker-esa.js` 作为入口。
5. 点击 **开始部署**，部署完成后绑定域名。

完整操作过程见 [ESA-DEPLOY.md](ESA-DEPLOY.md)。

## 使用

假设部署后的域名是：

```text
https://git.example.com
```

将 GitHub 链接里的 `github.com` 换成自己的域名：

```text
GitHub：https://github.com/cloudflare/workers-sdk
镜像：https://git.example.com/cloudflare/workers-sdk
```

克隆公开仓库：

```powershell
git clone https://git.example.com/owner/repository.git
```

将已有仓库的远程地址改为镜像：

```powershell
git remote set-url origin https://git.example.com/owner/repository.git
git fetch origin
```

如果网页能打开，但 Git 报 TLS 或 SSL 错误，优先检查域名是否通过 Worker 的 **Custom Domain** 直接绑定。不要在前面再套多层 CNAME 或第三方中转。

### 健康检查

访问：

```text
https://你的域名/healthy
```

正常时返回 `200` 和 `OK`；GitHub 上游不可用时返回 `503`。页面也会显示上游状态、当前版本、登录状态、检查耗时和检查时间。

版本信息默认读取 `SOURCE_REPOSITORY` 中仓库的 `main` 分支最新提交。

## 配置与注意事项

所有配置都在平台仪表盘通过环境变量修改，不需要改代码。

| 变量 | 默认值 | 作用 |
| --- | --- | --- |
| `ALLOW_LOGIN` | `false` | 设为 `true` 才允许通过镜像打开 GitHub 登录页 |
| `SOURCE_REPOSITORY` | `ZhangShengFan/FastGit` | `/healthy` 显示版本信息时读取的仓库 |
| `CACHE_TTL` | `3600` | 静态资源缓存时间，单位为秒；设为 `0` 关闭缓存，最大为 `86400` |

Cloudflare Workers 在 **Settings** > **Variables and Secrets** 中修改。

阿里云 ESA Pages 在项目 **基本信息** > **构建信息** > **修改** 中调整环境变量。保存后重新部署才会生效。

### 关于网页登录

默认不要开启 `ALLOW_LOGIN`。

开启后，GitHub 的登录表单、验证码和浏览器会话会经过你部署的边缘函数。这个功能只适合你自己控制、自己使用的实例，不适合公开提供给其他人。

即使开启登录，通行密钥、网页身份验证以及 GitHub 的部分风控流程仍可能要求使用原始 `github.com` 域名，不能保证都能在镜像域名下正常工作。

另外，不要记录 Cookie、Authorization、令牌、表单内容或请求正文；也不要缓存 API 响应、私有内容和下载文件。

## 友链

- [LINUX DO](https://linux.do/)：新的理想型社区

## License

[MIT License](LICENSE)
