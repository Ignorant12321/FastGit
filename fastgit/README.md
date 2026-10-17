# FastGit

一个纯前端的 GitHub 加速地址生成器。粘贴任意 GitHub 链接，自动在地址前拼上所选加速节点（默认使用当前域名，`gh-proxy.com` 作为备用），回车即在新标签页打开加速链接。

直接用浏览器打开 `index.html` 即可，无需构建、无需后端。镜像 Worker 会把这个首页内联进去（由仓库根目录的 `node tools/embed-fastgit.mjs` 生成），所以本地看到的文件就是线上根路径返回的同一份。

## 文件

| 文件 | 作用 |
| --- | --- |
| `index.html` | 页面结构（图标均为内联 SVG） |
| `styles.css` | 设计系统与全部样式（深浅双主题） |
| `app.js` | 地址解析、节点切换、历史记录等逻辑 |

## 功能

- **可切换加速节点**：默认取当前域名（首页部署到哪个域名，默认就用哪个域名加速，因此换成任何自定义域名都通用），`gh-proxy.com` 作为备用保留；也可以在面板底部添加自己的节点（保存在浏览器里，可删除）。用 `file://` 或 `localhost` 打开时自动回退到 `gh-proxy.com`。
- **自动去重**：粘贴已经带代理前缀的地址（例如 `https://gh-proxy.com/https://github.com/...`）会自动剥掉旧前缀，避免双重加速。
- **直接打开**：回车或点右侧箭头即在新标签页打开加速链接（浏览器拦截弹窗时才退回复制，并提示）。
- **链接识别**：仓库 / Release / 最新 Release / 标签 / 文件页面 / Raw / 归档包 / Git Clone / Gist 都会被识别，并在打开时提示类型。
- **宽松输入**：`github.com/xxx`、缺少 `https://`、带 `www.` 都能识别；非 GitHub 域名会给出明确提示。
- **本地历史**：最近 8 条记录存在浏览器 `localStorage`，不经过任何服务器。每行只有「复制」和「打开」两个动作；列表单独占一页（顶栏「最近访问」进去），所以它不会挤压首屏布局。入口一直显示，没有记录时那一页会给出空状态（而不是把入口藏掉，否则清空之后就再也进不去了）。
  > 注意：`localStorage` 是按「协议 + 域名 + 端口」隔离的。用 `file://` 直接打开、和之前用 `http://localhost:8000/` 打开，是两份互不相通的记录。
- **不碰剪贴板读取**：提交时是「先写入最近访问，再 `window.open` 打开」，全程不读剪贴板、也没有 paste 监听。复制用临时 `textarea` + `execCommand('copy')`（不触发浏览器权限弹窗），只有它不可用时才退回 `navigator.clipboard.writeText`。
- **页面结构**：顶栏 + 首屏（标题、搜索框）+ 独立的「最近访问」页；首屏内容在顶栏剩余空间里垂直居中，间距随视口高度伸缩。
- **「最近访问」是一页**：顶栏点进去以后，列表页从右侧滑入、淡入，首屏同时左移淡出，而背景的网格/光晕原地不动，所以看起来是翻页而不是换站；顶栏在这两页之间始终可用。`Esc`、左上角「返回」、浏览器后退键都能退出，**再点一次「最近访问」（窄屏是那时钟图标）也会收回去**；地址栏是 `index.html#recent`，退出时用 `replaceState` 收尾，所以首页地址栏不会留下裸露的 `#`。
- **键盘**：`Enter` 直接打开、`Ctrl/⌘ + K` 聚焦输入框、`Esc` 关闭节点面板 / 退出最近访问那一页。
- **深浅色主题**：跟随系统，右上角按钮缩放旋转着换成另一个图标，切换时以按钮为圆心做圆形扩散并记住选择。
- **输入框**：聚焦时轻微放大 + 边框高亮（强调色）；打字提示在聚焦时淡出而不是瞬间消失。
- **节点面板**：按当前视口空间决定向上还是向下展开，展开时不会撑高页面（否则会冒出滚动条、整页横向抖一下）。

## 常用修改点

- **默认节点 / 节点列表**：`app.js` 顶部的 `SELF_HOST`（取当前域名）、`FALLBACK_HOST` 与 `OTHER_PROXIES`。改完 `fastgit/` 下任意文件后，回到仓库根目录运行 `node tools/embed-fastgit.mjs`，把首页重新内联进两个 Worker 入口。
- **站点图标**：`index.html` 中 `.brand-mark` 内的 SVG 和 `<link rel="icon">` 的 data URI 两处；图标可以从 <https://icones.js.org/> 复制 SVG 路径替换。
- **配色与字体**：`styles.css` 顶部的 CSS 变量（`--accent` 主色、`--signal` 状态色、`--bg` 背景、`--shell` 内容宽度等）。
- **输入框打字提示**：`app.js` 里的 `SAMPLES`。
- **垂直分区 / 首屏留白**：`main` 里 `.hero` 是 `flex: 1` 的纵向 flex 容器，分成两区 ——
  - 上区（`.eyebrow` / 标题 / `.lede`）：靠 `.hero > .eyebrow { margin-top: auto }` + `.hero > .lede { margin-bottom: auto }` 两个 auto 外边距均分多余高度，于是这组在「上区」里居中；
  - 下区（`#form`：搜索框 + 快捷键提示）：自然落在底部，不再影响上面那组的居中。

  搜索框距屏幕底部多远看 `main` 的 `padding-bottom`；想让文字组整体更靠上/靠下，可以只保留一个 auto 外边距（两个都留 = 上区居中，只留 `margin-top: auto` = 整组靠下）。`.composer / .hint` 的 `clamp(...vh...)` 管它们之间的疏密。
- **节点面板开合位置**：`app.js` 里的 `POP_GAP / POP_EDGE / POP_CHROME / POP_ROW`（面板高度按当前视口算：下方放得下就往下开，放不下就翻到输入框上方，始终不会把页面撑高）。
- **「最近访问」的滑入动效**：`styles.css` 的 `.page-recent`（收起态是 `translateX(64px)` + `opacity 0`）和 `body.is-recent main`（首屏被推开多少：`translateX(-30px)`）。**两个方向的 `transition` 都带延迟，时序不要改反**：打开时首页先 `.18s` 淡出干净，这一页延迟 `.07s` 再滑入；关闭时这一页先淡掉（`.18s`），首页延迟 `.08s` 再淡回来 —— 否则两页会同时半透明，看起来是残影。窄屏顶栏只留一个时钟图标按钮，见 `styles.css` 底部 `@media (max-width: 600px)` 里 `#navRecent` 那几条。翻页用 hash（`#recent`），逻辑在 `app.js` 的 `setRecentPage / syncRecentFromHash / clearHash`。
- **主题扩散动画时长**：`styles.css` 里 `::view-transition-new(root)` 的 `theme-circle-reveal .55s`（圆心和半径由 `app.js` 写成 `--theme-reveal-x/y/r` 三个变量，初值在文件里的 `@property`）；图标旋转时长是同文件的 `icon-spin .5s`，它同时是不支持 View Transitions 时 `.anim-rotate` 的退路。两个要点别动：`view-transition-name: theme-toggle-icon` 必须挂在 `.theme-ico` 那层 span（不是 svg），旧新两张快照跑**同一条**旋转、不加 opacity，才融成"一个图标转着变成另一个"；`html.theme-no-transition` 在扩散期间冻结全站 `transition`，删掉它扩散结束后页面会自己再变一遍。
- **顶栏节点名的动效**：`app.js` 的 `syncNodeUI` 里给 `#navNode` 打 `is-swap`（首次加载不打，避免一进站就闪），动画在 `styles.css` 的 `host-tear`（域名从右往左撕开）+ `host-slide`（外链箭头晚 90ms 同方向跟上来）。选中的节点就是本站时外链没有意义要收起，但 `hidden` 是 `display:none`，直接打上就没有任何过渡，所以先用 `nav-tuck` 按实测宽度（`--nav-w` 由 JS 写入）把盒子压到 0、`margin-right` 抵掉 `.nav` 的 gap（`--nav-gap`，两处要一起改），`NAV_TUCK_MS` 到点才补 `hidden`；切回代理节点时反过来演 `nav-untuck` 和 `is-swap` 同时跑（撑开盒子的同时撕开域名）。

## 说明

默认节点是当前域名（把首页部署为镜像 Worker 时，加速由本站完成）；切到第三方公共节点时，可用性和速度取决于对方服务，随时可能失效——节点面板里换一个或添加自己的节点即可。页面本身不上传、不存储任何数据。
