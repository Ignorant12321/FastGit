// FastGit for Cloudflare Workers.
// Paste this entire file into Workers & Pages > your Worker > Edit code.

const DEFAULT_ALLOW_LOGIN = false;
const DEFAULT_SOURCE_REPOSITORY = "ZhangShengFan/FastGit";
const DEFAULT_CACHE_TTL = 3600;
const DEFAULT_PROXY_COUNTRIES = "CN";
const PRIMARY_HOST = "github.com";
const PROXY_PREFIX = "/_proxy/";
const STATIC_CACHE_HOSTS = new Set(["github.githubassets.com"]);

const REWRITTEN_HOSTS = [
  "github.githubassets.com",
  "avatars.githubusercontent.com",
  "private-avatars.githubusercontent.com",
  "camo.githubusercontent.com",
  "codeload.github.com",
  "media.githubusercontent.com",
  "raw.githubusercontent.com",
  "objects.githubusercontent.com",
  "objects-origin.githubusercontent.com",
  "user-images.githubusercontent.com",
  "private-user-images.githubusercontent.com",
  "secured-user-images.githubusercontent.com",
  "release-assets.githubusercontent.com",
  "repository-images.githubusercontent.com",
  "marketplace-screenshots.githubusercontent.com",
  "opengraph.githubassets.com",
  "identicons.github.com",
  "api.github.com",
  "alive.github.com",
  "uploads.github.com",
  "gist.github.com",
  "collector.github.com",
];

// <fastgit-assets> (generated from fastgit/ by tools/embed-fastgit.mjs — do not edit by hand)
const FASTGIT_INDEX_HTML = "<!doctype html>\n<html lang=\"zh-CN\" data-theme=\"dark\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>FastGit · 让 GitHub 下载不再等待</title>\n<meta name=\"description\" content=\"粘贴任意 GitHub 仓库、Release 或 Raw 文件地址，通过可切换的公共加速节点直接打开加速链接。纯前端实现。\">\n<meta name=\"color-scheme\" content=\"dark light\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\" rel=\"stylesheet\">\n<link rel=\"stylesheet\" href=\"./styles.css\">\n<link rel=\"icon\" href=\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%236aa8ff'/><stop offset='1' stop-color='%231a4fd0'/></linearGradient></defs><rect width='32' height='32' rx='9' fill='url(%23g)'/><g transform='translate(7 7) scale(.75)'><path fill='%23fff' d='M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'/></g></svg>\">\n<!-- 站点图标来自 icones.js.org 的 simple-icons/github，换图标只需改这里和 .brand-mark 两处 -->\n</head>\n<body>\n\n<div class=\"backdrop\" aria-hidden=\"true\">\n  <div class=\"grid-lines\"></div>\n  <div class=\"glow glow--a\"></div>\n  <div class=\"glow glow--b\"></div>\n</div>\n\n<header class=\"site-header\">\n  <a class=\"brand\" href=\"./\">\n    <span class=\"brand-mark\" aria-hidden=\"true\">\n      <svg viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"currentColor\">\n        <path d=\"M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12\"/>\n      </svg>\n    </span>\n    <span class=\"brand-text\">Fast<em>Git</em></span>\n  </a>\n\n  <nav class=\"nav\" aria-label=\"主导航\">\n    <a class=\"nav-ext\" id=\"navNode\" href=\"https://gh-proxy.com/\" target=\"_blank\" rel=\"noopener\">\n      <span id=\"navNodeHost\">gh-proxy.com</span>\n      <svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n        <path d=\"M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/>\n      </svg>\n    </a>\n    <a id=\"navRecent\" href=\"#recent\">\n      <svg class=\"nav-ico\" viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n        <circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>\n      </svg>\n      <span>最近访问</span>\n    </a>\n  </nav>\n\n  <button class=\"icon-btn\" id=\"themeToggle\" type=\"button\" aria-label=\"切换深色 / 浅色模式\" title=\"切换深色 / 浅色\">\n    <span class=\"theme-ico\">\n      <svg class=\"i-moon\" viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n        <path d=\"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401\"/>\n      </svg>\n      <svg class=\"i-sun\" viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n        <circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\"/>\n      </svg>\n    </span>\n  </button>\n</header>\n\n<main>\n  <section class=\"hero\">\n    <p class=\"eyebrow reveal\" style=\"--d:.05s\">\n      <span class=\"pulse\" aria-hidden=\"true\"></span>\n      公共加速节点 · 可随时切换 · 支持自定义\n    </p>\n\n    <h1 class=\"reveal\" style=\"--d:.12s\">\n      让每一次 <span class=\"grad\">GitHub</span> 访问<br class=\"br-lg\">都不必等待\n    </h1>\n\n    <p class=\"lede reveal\" style=\"--d:.19s\">\n      粘贴仓库、Release 或 Raw 文件地址，直接在新标签页打开加速链接。\n    </p>\n\n    <form class=\"composer reveal\" id=\"form\" style=\"--d:.26s\" novalidate>\n      <div class=\"field-wrap\">\n        <div class=\"field\" id=\"field\">\n          <span class=\"lead\" aria-hidden=\"true\">\n            <svg viewBox=\"0 0 24 24\" width=\"17\" height=\"17\" fill=\"currentColor\">\n              <path d=\"M15.914 4a1.5 1.5 0 0 0-2.474-1.561l-9 9A1.5 1.5 0 0 0 5.5 14h4.002a.5.5 0 0 1 .471.666L8.086 20a1.5 1.5 0 0 0 2.475 1.56l9-9A1.5 1.5 0 0 0 18.5 10h-3.997a.5.5 0 0 1-.472-.667z\"/>\n            </svg>\n          </span>\n\n          <button class=\"node\" id=\"nodeBtn\" type=\"button\" aria-haspopup=\"listbox\" aria-expanded=\"false\" title=\"切换加速节点\">\n            <span class=\"node-host\" id=\"nodeHost\">gh-proxy.com</span>\n            <svg class=\"node-caret\" viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n              <path d=\"m6 9 6 6 6-6\"/>\n            </svg>\n          </button>\n\n          <div class=\"input-wrap\">\n            <input id=\"url\" type=\"text\" inputmode=\"url\" autocomplete=\"off\" spellcheck=\"false\"\n                   aria-label=\"GitHub 链接\" aria-describedby=\"hint\">\n            <span class=\"ghost\" id=\"ghost\" aria-hidden=\"true\"></span>\n          </div>\n\n          <button class=\"clear\" id=\"clear\" type=\"button\" aria-label=\"清空输入\" hidden>\n            <svg viewBox=\"0 0 24 24\" width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n              <path d=\"M18 6 6 18M6 6l12 12\"/>\n            </svg>\n          </button>\n\n          <button class=\"go\" id=\"go\" type=\"submit\" aria-label=\"在新标签页打开\" title=\"在新标签页打开\">\n            <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\" aria-hidden=\"true\">\n              <path d=\"M10.586 3L4 9.586a2 2 0 0 0-.434 2.18l.068.145A2 2 0 0 0 5.414 13H8v7a2 2 0 0 0 2 2h4l.15-.005A2 2 0 0 0 16 20l-.001-7h2.587A2 2 0 0 0 20 9.586L13.414 3a2 2 0 0 0-2.828 0\"/>\n            </svg>\n          </button>\n        </div>\n\n        <div class=\"popover\" id=\"nodePop\" hidden>\n          <p class=\"pop-title\">选择加速节点</p>\n          <ul class=\"node-list\" id=\"nodeList\" role=\"listbox\" aria-label=\"加速节点\"></ul>\n          <div class=\"node-add\">\n            <input id=\"nodeAddInput\" type=\"text\" spellcheck=\"false\" autocomplete=\"off\"\n                   placeholder=\"自定义节点，如 gh-proxy.com\" aria-label=\"添加自定义节点\">\n            <button id=\"nodeAddBtn\" type=\"button\" aria-label=\"添加节点\">\n              <svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n                <path d=\"M5 12h14m-7-7v14\"/>\n              </svg>\n            </button>\n          </div>\n        </div>\n      </div>\n\n      <p class=\"error\" id=\"error\" role=\"alert\" hidden></p>\n      <p class=\"hint\" id=\"hint\">\n        按 <kbd>Enter</kbd> 在新标签页打开 · <kbd id=\"kbdMod\">Ctrl</kbd> <kbd>K</kbd> 聚焦输入框\n      </p>\n    </form>\n  </section>\n</main>\n\n<!-- 最近访问：独立一页，从右侧滑入盖住首页内容（顶栏保持不动） -->\n<section class=\"page-recent\" id=\"recent\" aria-labelledby=\"recentTitle\" aria-hidden=\"true\">\n  <div class=\"page-inner\">\n    <div class=\"page-head\">\n      <button class=\"back\" id=\"recentBack\" type=\"button\">\n        <svg viewBox=\"0 0 24 24\" width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n          <path d=\"M19 12H5m7-7-7 7 7 7\"/>\n        </svg>\n        <span>返回</span>\n      </button>\n\n      <h2 id=\"recentTitle\">\n        <svg viewBox=\"0 0 24 24\" width=\"15\" height=\"15\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n          <circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 6v6l4 2\"/>\n        </svg>\n        最近访问\n      </h2>\n\n      <button class=\"text-btn\" id=\"clearHistory\" type=\"button\">\n        <svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\">\n          <path d=\"M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/>\n        </svg>\n        <span>清空记录</span>\n      </button>\n    </div>\n\n    <p class=\"page-sub\" id=\"recentSub\"></p>\n    <ul class=\"recent-list\" id=\"recentList\"></ul>\n    <p class=\"page-empty\" id=\"recentEmpty\" hidden>\n      还没有记录 —— 在这里打开过的加速链接会出现在这一页。\n    </p>\n  </div>\n</section>\n\n<div class=\"toast\" id=\"toast\" role=\"status\" aria-live=\"polite\" hidden></div>\n\n<script src=\"./app.js\"></script>\n</body>\n</html>\n";
const FASTGIT_STYLES_CSS = "/* ==========================================================================\n   FastGit — design tokens\n   Direction: GitHub-native minimalism. Deep canvas, hairline borders,\n   monospace for anything that is a URL. One accent (blue) + one signal (green).\n   ========================================================================== */\n\n:root {\n  --bg:            #0a0c10;\n  --bg-elev:       #10141a;\n  --surface:       rgba(255, 255, 255, .028);\n  --surface-hi:    rgba(255, 255, 255, .055);\n  --border:        rgba(255, 255, 255, .09);\n  --border-strong: rgba(255, 255, 255, .16);\n  --text:          #e8edf3;\n  --text-dim:      #8b96a5;\n  --text-faint:    #5d6673;\n  --accent:        #3d8bfd;\n  --accent-hi:     #6aa8ff;\n  --accent-ink:    #ffffff;\n  --signal:        #3fb950;\n  --danger:        #f85149;\n\n  --shadow-sm: 0 1px 2px rgba(0, 0, 0, .4);\n  --shadow-md: 0 8px 24px -12px rgba(0, 0, 0, .7);\n  --shadow-lg: 0 32px 80px -32px rgba(0, 0, 0, .85);\n\n  --r-sm: 8px;\n  --r-md: 12px;\n  --r-lg: 18px;\n  --r-pill: 999px;\n\n  --font: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"PingFang SC\",\n          \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif;\n  --mono: \"JetBrains Mono\", ui-monospace, SFMono-Regular, \"SF Mono\", Menlo,\n          Consolas, monospace;\n\n  --shell: 1120px;\n  --ease: cubic-bezier(.22, 1, .36, 1);\n}\n\nhtml[data-theme=\"light\"] {\n  --bg:            #fbfcfd;\n  --bg-elev:       #ffffff;\n  --surface:       rgba(9, 15, 25, .022);\n  --surface-hi:    rgba(9, 15, 25, .05);\n  --border:        rgba(9, 15, 25, .1);\n  --border-strong: rgba(9, 15, 25, .2);\n  --text:          #11161d;\n  --text-dim:      #5c6672;\n  --text-faint:    #8a93a0;\n  --accent:        #0969da;\n  --accent-hi:     #0550ae;\n  --shadow-sm: 0 1px 2px rgba(9, 15, 25, .06);\n  --shadow-md: 0 10px 28px -16px rgba(9, 15, 25, .25);\n  --shadow-lg: 0 34px 90px -40px rgba(9, 15, 25, .35);\n}\n\n/* ------------------------------------------------------------------ reset */\n\n*, *::before, *::after { box-sizing: border-box; }\n\nhtml { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; scrollbar-gutter: stable; }\n/* scrollbar-gutter: 预留滚动条位置 —— 页面从「不可滚动」变成「可滚动」时\n   （比如刚打开下拉面板、或第一次出现最近访问），内容不会横向跳一下。 */\n\nbody {\n  margin: 0;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  background: var(--bg);\n  color: var(--text);\n  font-family: var(--font);\n  font-size: 16px;\n  line-height: 1.6;\n  -webkit-font-smoothing: antialiased;\n  text-rendering: optimizeLegibility;\n  overflow-x: hidden;\n}\n\n[hidden] { display: none !important; }\n\nh1, h2, h3 { margin: 0; font-weight: 600; letter-spacing: -.022em; line-height: 1.12; }\np { margin: 0; }\nul, ol { margin: 0; padding: 0; list-style: none; }\na { color: inherit; text-decoration: none; }\nbutton { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }\ncode { font-family: var(--mono); font-size: .88em; }\n\n::selection { background: color-mix(in srgb, var(--accent) 35%, transparent); }\n\n/* 焦点圈：只对没有自带圆角的可聚焦元素生效（同优先级下，后写的组件规则会覆盖这里），\n   例如 #url、.text-btn、导航链接。组件自己声明了 border-radius 的不需要再单独覆盖。 */\n:focus-visible {\n  outline: 2px solid var(--accent);\n  outline-offset: 2px;\n  border-radius: 4px;\n}\n\n/* --------------------------------------------------------------- backdrop */\n\n.backdrop { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }\n\n.grid-lines {\n  position: absolute; inset: -2px;\n  background-image:\n    linear-gradient(to right, var(--border) 1px, transparent 1px),\n    linear-gradient(to bottom, var(--border) 1px, transparent 1px);\n  background-size: 64px 64px;\n  opacity: .5;\n  -webkit-mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 5%, transparent 72%);\n          mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, #000 5%, transparent 72%);\n}\n\n.glow {\n  position: absolute;\n  width: 46rem; height: 46rem;\n  border-radius: 50%;\n  filter: blur(90px);\n  opacity: .5;\n}\n.glow--a {\n  top: -22rem; left: 50%; translate: -60% 0;\n  background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 62%);\n  animation: drift-a 26s var(--ease) infinite alternate;\n}\n.glow--b {\n  top: -14rem; left: 50%; translate: 6% 0;\n  background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--signal) 34%, transparent), transparent 62%);\n  opacity: .32;\n  animation: drift-b 32s var(--ease) infinite alternate;\n}\nhtml[data-theme=\"light\"] .glow { opacity: .3; }\nhtml[data-theme=\"light\"] .glow--b { opacity: .2; }\nhtml[data-theme=\"light\"] .grid-lines { opacity: .95; }\n\n@keyframes drift-a {\n  from { translate: -60% 0; scale: 1; }\n  to   { translate: -40% 4rem; scale: 1.12; }\n}\n@keyframes drift-b {\n  from { translate: 6% 0; scale: 1.05; }\n  to   { translate: 22% 3rem; scale: .95; }\n}\n\n/* ----------------------------------------------------------------- header */\n\n.site-header {\n  position: relative; z-index: 2;\n  flex: 0 0 auto;\n  display: flex; align-items: center; gap: 24px;\n  width: min(var(--shell), 100% - 48px);\n  margin: 0 auto;\n  padding: 22px 0;\n}\n\n.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -.02em; transition: transform .18s var(--ease); }\n.brand:active { transform: scale(.96); }\n.brand-mark {\n  display: grid; place-items: center;\n  width: 28px; height: 28px;\n  border-radius: 9px;\n  background: linear-gradient(150deg, var(--accent-hi), var(--accent) 55%, color-mix(in srgb, var(--signal) 70%, var(--accent)));\n  color: #fff;\n  box-shadow: var(--shadow-sm);\n}\n.brand-text { font-size: 1.02rem; }\n.brand-text em { font-style: normal; color: var(--text-dim); }\n\n.nav { --nav-gap: 22px; display: flex; align-items: center; gap: var(--nav-gap); margin-left: auto; font-size: .875rem; color: var(--text-dim); }\n.nav a { display: inline-flex; align-items: center; gap: 5px; transition: color .18s var(--ease), transform .18s var(--ease); }\n.nav a:hover { color: var(--text); }\n.nav a:active { transform: scale(.94); }\n.nav-ico { display: none; }   /* 窄屏才用图标形态 */\n\n/* 换节点：新地址从右往左被撕开（clip 边从右端一路走到左端），\n   箭头沿同一方向晚 90ms 跟上来，两件事看起来是同一个动作。\n   span 不用 forwards，动画结束后 clip-path 直接回到无裁剪，不会一直压着盒子。 */\n#navNode.is-swap > span { animation: host-tear .34s cubic-bezier(.2, 0, 0, 1); }\n#navNode.is-swap > svg  { animation: host-slide .3s var(--ease) .09s both; }\n@keyframes host-tear {\n  from { clip-path: inset(0 0 0 100%); transform: translateX(8px); }\n  to   { clip-path: inset(0 0 0 0);    transform: none; }\n}\n@keyframes host-slide {\n  from { opacity: 0; transform: translateX(9px); }\n  to   { opacity: 1; transform: none; }\n}\n\n/* 选中节点就是本站时，右上角外链没有意义要收起来。但 hidden 是 display:none，\n   打上就整帧消失，动画根本没地方演 —— 所以先按实测宽度（--nav-w 由 app.js 写入）\n   把盒子压到 0，margin-right 抵掉 .nav 的 gap，动画放完 JS 才补 hidden。\n   展开是反方向，配 is-swap 一起用：盒子撑开的同时域名撕开。\n   收拢要 forwards（撑到动画结束都得一直是 0 宽），展开不能 forwards（否则长域名会被上次的宽度夹住）。 */\n#navNode.is-tuck   { overflow: hidden; animation: nav-tuck   .3s var(--ease) forwards; }\n#navNode.is-untuck { overflow: hidden; animation: nav-untuck .34s var(--ease); }\n/* 宽度被压小时，域名的点号是断行点，不换行、不被压扁才是一道干净的擦除而不是文字重排 */\n#navNode.is-tuck > span, #navNode.is-untuck > span { flex: 0 0 auto; white-space: nowrap; }\n@keyframes nav-tuck {\n  from { max-width: var(--nav-w); margin-right: 0; opacity: 1; }\n  to   { max-width: 0; margin-right: calc(var(--nav-gap) * -1); opacity: 0; }\n}\n@keyframes nav-untuck {\n  from { max-width: 0; margin-right: calc(var(--nav-gap) * -1); opacity: 0; }\n  to   { max-width: var(--nav-w); margin-right: 0; opacity: 1; }\n}\n\n/* 主题按钮：图标缩放旋转着换成另一个 */\n.icon-btn {\n  position: relative;\n  display: grid; place-items: center;\n  width: 34px; height: 34px;\n  border: 1px solid var(--border);\n  border-radius: 10px;\n  background: var(--surface);\n  color: var(--text-dim);\n  transition: color .18s var(--ease), border-color .18s var(--ease), background .18s var(--ease), transform .18s var(--ease);\n}\n.icon-btn:hover { color: var(--text); border-color: var(--border-strong); background: var(--surface-hi); }\n.icon-btn:active { transform: scale(.92); }\n\n/* 图标外面包一层，这层才是 View Transition 的独立分组：\n   两枚 svg 用 display 互换，组里就是「旧月亮 / 新太阳」两张快照，\n   可以各自淡出淡入。直接命名单个 svg 时快照对不上，看起来就是瞬间跳变。 */\n.theme-ico {\n  display: grid;\n  view-transition-name: theme-toggle-icon;\n}\n.theme-ico svg { grid-area: 1 / 1; }\n.icon-btn .i-sun { display: none; }\nhtml[data-theme=\"light\"] .icon-btn .i-moon { display: none; }\nhtml[data-theme=\"light\"] .icon-btn .i-sun { display: block; }\n\n/* 只在不支持 View Transitions 的浏览器里用到：图标原地转一圈 */\n.anim-rotate { animation: icon-spin .5s ease-in-out; }\n@keyframes icon-spin {\n  from { transform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}\n\n/* 深浅色切换：以按钮为圆心的圆形扩散。\n   扩散曲线走 CSS 变量，省掉 JS 等 ready 再启动动画的那一帧延迟。 */\n@property --theme-reveal-x { syntax: '<length>'; inherits: true; initial-value: 50vw; }\n@property --theme-reveal-y { syntax: '<length>'; inherits: true; initial-value: 50vh; }\n@property --theme-reveal-r { syntax: '<length>'; inherits: true; initial-value: 150vmax; }\n\n::view-transition-old(root),\n::view-transition-new(root) { animation: none; mix-blend-mode: normal; }\n::view-transition-old(root) { z-index: 1; }\n::view-transition-new(root) {\n  z-index: 2;\n  clip-path: circle(0 at var(--theme-reveal-x) var(--theme-reveal-y));\n  animation: theme-circle-reveal .55s cubic-bezier(0.2, 0, 0, 1) forwards;\n}\n@keyframes theme-circle-reveal {\n  to { clip-path: circle(var(--theme-reveal-r) at var(--theme-reveal-x) var(--theme-reveal-y)); }\n}\n\n/* 旧新两张快照跑同一条自转：新快照画在旧快照之上，观感就是\"这一个图标\n   转着转着变成了另一个\"，和脚下撑开的扩散是同一个节奏。前提是名字挂在\n   .theme-ico 这层 span 上；挂在 svg 本身时组建不起来，就只剩瞬间替换。 */\n::view-transition-old(theme-toggle-icon),\n::view-transition-new(theme-toggle-icon) {\n  animation: icon-spin .5s ease-in-out;\n  mix-blend-mode: normal;\n  height: 100%;\n  overflow: clip;\n}\n::view-transition-group(theme-toggle-icon) { z-index: 3; animation-duration: .5s; }\n\n/* 扩散期间冻结全站 transition：否则快照揭开时卡片阴影、翻页位移这些\n   还在跑，扩散完了页面又自己变一遍，看着就是两段动画。 */\nhtml.theme-no-transition,\nhtml.theme-no-transition *,\nhtml.theme-no-transition *::before,\nhtml.theme-no-transition *::after { transition: none !important; }\n\n/* ------------------------------------------------------------------- hero */\n\nmain {\n  position: relative;\n  z-index: 1;\n  flex: 1 1 auto;            /* 占满顶栏剩下的高度 */\n  display: flex;\n  flex-direction: column;\n  padding-bottom: clamp(28px, 8vh, 92px);   /* 搜索框那一段距屏幕底部留多少 */\n}\n\n.hero {\n  width: min(var(--shell), 100% - 48px);\n  margin: 0 auto;\n  flex: 1 1 auto;                  /* 占满 main，把「最近访问」挤到最下面 */\n  display: flex;\n  flex-direction: column;\n  align-items: center;             /* 横向各自按内容宽度居中（否则会被拉满一整行） */\n  padding: clamp(20px, 3vh, 44px) 0 0;   /* 只留一个最小上边距 */\n  text-align: center;\n}\n\n/* main 分两区：\n   上区（eyebrow / 标题 / lede）在剩余空间里居中 —— 两个 auto 外边距均分多余高度；\n   下区（表单：搜索框 + 快捷键提示）自然落在底部，不再影响上面那居中的一组。 */\n.hero > .eyebrow { margin-top: auto; }\n.hero > .lede { margin-bottom: auto; }\n\n.eyebrow {\n  display: inline-flex; align-items: center; gap: 9px;\n  padding: 7px 15px 7px 12px;\n  border: 1px solid var(--border);\n  border-radius: var(--r-pill);\n  background: var(--surface);\n  font-size: .78rem;\n  color: var(--text-dim);\n  letter-spacing: .005em;\n}\n.pulse {\n  width: 6px; height: 6px; border-radius: 50%;\n  background: var(--signal);\n  box-shadow: 0 0 0 0 color-mix(in srgb, var(--signal) 60%, transparent);\n  animation: pulse 2.4s ease-out infinite;\n}\n@keyframes pulse {\n  0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--signal) 55%, transparent); }\n  70%  { box-shadow: 0 0 0 9px transparent; }\n  100% { box-shadow: 0 0 0 0 transparent; }\n}\n\n.hero h1 {\n  margin: clamp(28px, 4.2vh, 54px) auto 0;\n  font-size: clamp(2.05rem, 5.6vw, 4.5rem);\n  font-weight: 700;\n  letter-spacing: -.035em;\n  line-height: 1.16;\n  max-width: 22ch;\n}\n\n.grad {\n  background-image: linear-gradient(96deg, var(--accent-hi), color-mix(in srgb, var(--signal) 80%, var(--accent-hi)));\n  -webkit-background-clip: text;\n          background-clip: text;\n  color: transparent;\n}\n\n.lede {\n  margin: clamp(22px, 3.2vh, 40px) auto 0;\n  max-width: 38em;\n  text-wrap: balance;\n  color: var(--text-dim);\n  font-size: clamp(1rem, 1.35vw, 1.1rem);\n}\n\n/* --------------------------------------------------------------- composer */\n\n.composer {\n  position: relative;\n  z-index: 5;      /* 让节点下拉面板始终盖住下方内容 */\n  width: min(1000px, 100%);\n  margin: clamp(38px, 6.5vh, 78px) auto 0;\n}\n\n.field-wrap { position: relative; }\n\n.field {\n  display: flex; align-items: center; gap: 4px;\n  position: relative;\n  text-align: left;\n  padding: 7px 7px 7px 18px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--r-lg);\n  /* 不用 backdrop-filter：它在缩放动画里会重新采样背景，聚焦时会闪一下 */\n  background: color-mix(in srgb, var(--bg-elev) 93%, transparent);\n  box-shadow: var(--shadow-md);\n  transform-origin: center;\n  transition: transform .42s var(--ease), box-shadow .42s var(--ease), border-color .3s var(--ease);\n}\n/* 聚焦：边框高亮；只有真正聚焦到输入框才轻微放大（点节点按钮不该让整个框缩放） */\n.field:hover { box-shadow: var(--shadow-lg); }\n.field:focus-within {\n  border-color: color-mix(in srgb, var(--accent) 62%, var(--border-strong));\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent), var(--shadow-lg);\n}\n.field:has(#url:focus) { transform: scale(1.015); }\n\n.lead {\n  flex: 0 0 auto;\n  display: grid; place-items: center;\n  color: var(--accent);\n  opacity: .85;\n}\n\n/* 加速节点选择器 */\n.node {\n  flex: 0 1 auto;\n  display: inline-flex; align-items: center; gap: 5px;\n  min-width: 0;\n  max-width: 16rem;\n  padding: 8px 10px;\n  border-radius: 9px;\n  font-family: var(--mono);\n  font-size: .8rem;\n  color: var(--text-dim);\n  transition: background .18s var(--ease), color .18s var(--ease);\n}\n.node:hover { background: var(--surface-hi); color: var(--text); }\n.node-host { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.node-caret { flex: 0 0 auto; transition: transform .34s cubic-bezier(.34, 1.4, .64, 1); }\n.node[aria-expanded=\"true\"] .node-caret { transform: rotate(180deg); }\n\n.field.is-error {\n  border-color: color-mix(in srgb, var(--danger) 65%, transparent);\n  /* 出错时连聚焦光晕一起变红（否则仍是 :focus-within 的蓝色光圈） */\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 22%, transparent), var(--shadow-lg);\n  animation: shake .42s var(--ease);\n}\n@keyframes shake {\n  10%, 90% { transform: translateX(-2px); }\n  30%, 70% { transform: translateX(3px); }\n  50%      { transform: translateX(-4px); }\n}\n\n.input-wrap {\n  position: relative;\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  padding-left: 16px;\n}\n\n#url {\n  width: 100%;\n  padding: 15px 4px;\n  border: 0;\n  background: none;\n  color: var(--text);\n  font-family: var(--mono);\n  font-size: .95rem;\n  outline: none;\n}\n\n.ghost {\n  position: absolute; inset: 0;\n  display: flex; align-items: center;\n  /* 与 #url 内文字对齐：.input-wrap 左内边距 16px + input 左内边距 4px */\n  padding-left: 20px;\n  font-family: var(--mono);\n  font-size: .95rem;\n  color: var(--text-faint);\n  pointer-events: none;\n  white-space: nowrap;\n  overflow: hidden;\n  transition: opacity .26s var(--ease);\n}\n.ghost.is-hidden { opacity: 0; }\n.ghost .caret {\n  display: inline-block;\n  width: 7px; height: 1.05em;\n  margin-left: 2px;\n  background: var(--accent);\n  opacity: .9;\n  animation: blink 1.05s steps(1) infinite;\n}\n@keyframes blink { 50% { opacity: 0; } }\n\n.clear {\n  flex: 0 0 auto;\n  display: grid; place-items: center;\n  width: 28px; height: 28px;\n  border-radius: 50%;\n  color: var(--text-faint);\n  animation: pop-in .24s var(--ease);\n  transition: color .15s var(--ease), background .15s var(--ease);\n}\n.clear svg { transition: transform .25s var(--ease); }\n.clear:hover { color: var(--text); background: var(--surface-hi); }\n.clear:hover svg { transform: rotate(90deg); }\n@keyframes pop-in {\n  from { opacity: 0; transform: scale(.7); }\n  to   { opacity: 1; transform: none; }\n}\n\n/* 加速按钮：干净的圆形，无渐变无光晕 */\n.go {\n  flex: 0 0 auto;\n  display: grid; place-items: center;\n  width: 44px; height: 44px;\n  border-radius: 50%;\n  background: var(--accent);\n  color: var(--accent-ink);\n  transition: background .2s var(--ease), transform .25s var(--ease);\n}\n.go:hover { background: var(--accent-hi); transform: scale(1.06); }\n.go:active { transform: scale(.94); }\n.go svg { transition: transform .34s var(--ease); }\n/* 上箭头（↑）悬浮时顺时针转 90° 变为正右箭头（→），同时略微放大；按下回落并缩小 */\n.go:hover svg { transform: rotate(90deg) scale(1.08); }\n.go:active svg { transform: rotate(90deg); }\nhtml[data-theme=\"light\"] .go:hover { background: color-mix(in srgb, var(--accent) 82%, #000); }\n\n/* 节点下拉面板 */\n.popover {\n  position: absolute;\n  top: calc(100% + 8px); left: 0; right: 0;\n  z-index: 30;\n  display: flex; flex-direction: column;\n  /* 高度由 app.js 按「当前视口里还剩多少地方」写进 --pop-avail：\n     面板绝不超出视口，否则会把页面撑高、冒出滚动条，整页就左右抖一下 */\n  max-height: var(--pop-avail, 60vh);\n  padding: 8px;\n  text-align: left;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--r-md);\n  background: var(--bg-elev);\n  box-shadow: var(--shadow-lg);\n  opacity: 0;\n  transform: translateY(-6px) scale(.985);\n  transform-origin: top center;\n  transition: opacity .22s var(--ease), transform .28s var(--ease);\n}\n/* 下方放不下时翻到输入框上方 */\n.popover.is-up {\n  top: auto;\n  bottom: calc(100% + 8px);\n  transform-origin: bottom center;\n  transform: translateY(6px) scale(.985);\n}\n.popover.is-in { opacity: 1; transform: none; }\n\n.pop-title {\n  flex: 0 0 auto;\n  padding: 6px 10px 8px;\n  font-size: .72rem;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n  color: var(--text-faint);\n}\n\n.node-list {\n  flex: 0 1 auto;\n  min-height: 0;\n  display: grid; gap: 2px;\n  max-height: 18rem;\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--border-strong) transparent;\n}\n.node-list::-webkit-scrollbar { width: 8px; }\n.node-list::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }\n.node-list::-webkit-scrollbar-track { background: transparent; }\n\n.node-item {\n  display: flex; align-items: center; gap: 10px;\n  width: 100%;\n  padding: 9px 10px;\n  border-radius: 9px;\n  text-align: left;\n  font-family: var(--mono);\n  font-size: .82rem;\n  color: var(--text-dim);\n  transition: background .16s var(--ease), color .16s var(--ease);\n}\n.node-item:hover { background: var(--surface-hi); color: var(--text); }\n.node-item.is-active { color: var(--text); background: color-mix(in srgb, var(--accent) 12%, transparent); }\n.node-dot {\n  flex: 0 0 auto;\n  width: 6px; height: 6px;\n  border-radius: 50%;\n  background: var(--border-strong);\n}\n.node-item.is-active .node-dot { background: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }\n.node-name { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.node-note { flex: 0 0 auto; font-family: var(--font); font-size: .72rem; color: var(--text-faint); }\n.node-item.is-active .node-note { color: color-mix(in srgb, var(--accent) 70%, var(--text-dim)); }\n.node-del {\n  flex: 0 0 auto;\n  display: grid; place-items: center;\n  width: 20px; height: 20px;\n  border-radius: 6px;\n  color: var(--text-faint);\n  opacity: 0;\n  transition: opacity .16s var(--ease), color .16s var(--ease), background .16s var(--ease);\n}\n.node-item:hover .node-del { opacity: 1; }\n.node-del:hover { color: var(--danger); background: var(--surface-hi); }\n\n.node-add {\n  display: flex; align-items: center; gap: 6px;\n  margin-top: 8px;\n  padding-top: 10px;\n  border-top: 1px solid var(--border);\n}\n.node-add input {\n  flex: 1 1 auto; min-width: 0;\n  padding: 8px 10px;\n  border: 1px solid var(--border);\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--bg) 50%, transparent);\n  color: var(--text);\n  font-family: var(--mono);\n  font-size: .8rem;\n  outline: none;\n}\n.node-add input::placeholder { color: var(--text-faint); font-family: var(--font); }\n.node-add input:focus { border-color: var(--border-strong); }\n.node-add button {\n  flex: 0 0 auto;\n  display: grid; place-items: center;\n  width: 32px; height: 32px;\n  border: 1px solid var(--border-strong);\n  border-radius: 8px;\n  background: var(--surface);\n  color: var(--text-dim);\n  transition: color .18s var(--ease), background .18s var(--ease), border-color .18s var(--ease);\n}\n.node-add button:hover { color: var(--text); background: var(--surface-hi); border-color: color-mix(in srgb, var(--accent) 45%, var(--border-strong)); }\n\n.error {\n  margin: 12px 4px 0;\n  font-size: .84rem;\n  color: var(--danger);\n  text-align: center;\n  animation: err-in .3s var(--ease);\n}\n@keyframes err-in {\n  from { opacity: 0; transform: translateY(-4px); }\n  to   { opacity: 1; transform: none; }\n}\n\n.hint {\n  margin: clamp(13px, 1.9vh, 22px) 0 0;\n  font-size: .8rem;\n  color: var(--text-faint);\n}\nkbd {\n  display: inline-block;\n  padding: 1px 6px;\n  border: 1px solid var(--border);\n  border-radius: 5px;\n  background: var(--surface);\n  font-family: var(--mono);\n  font-size: .74rem;\n  color: var(--text-dim);\n}\n\n/* ----------------------------------------------------------- recent */\n\n/* --------------------------------------------- 最近访问（独立一页，滑入） */\n\n.page-recent {\n  position: fixed;\n  top: var(--header-h, 66px);   /* 顶栏保持可见，其余部分交给这一页 */\n  right: 0; bottom: 0; left: 0;\n  z-index: 20;\n  /* 背景保持透明：底下的网格/光晕延续过来，两页看起来是同一个页面在切换 */\n  overflow-x: hidden;\n  overflow-y: auto;\n  scrollbar-gutter: stable;     /* 行数变化时内容不横向跳 */\n  overscroll-behavior: contain;\n  /* 收起：滑到右边外面一点，同时不可见/不可聚焦 */\n  visibility: hidden;\n  opacity: 0;\n  transform: translateX(64px);\n  /* 退出时先淡掉再滑走（滑走的过程已经看不见了） */\n  transition: transform .34s var(--ease), opacity .18s var(--ease), visibility 0s linear .34s;\n}\n.page-recent.is-open {\n  visibility: visible;\n  opacity: 1;\n  transform: none;\n  /* 延迟 .07s 进来：等首页先退干净，避免两页内容叠成残影 */\n  transition: transform .46s var(--ease) .07s, opacity .3s var(--ease) .07s, visibility 0s;\n}\n\n/* 首页：打开时快速淡出（.18s 内退干净，别和新一页抢），关闭时稍后再淡回来 */\nmain { transition: transform .34s var(--ease) .04s, opacity .28s var(--ease) .08s; }\nbody.is-recent main {\n  transform: translateX(-30px);\n  opacity: 0;\n  pointer-events: none;\n  visibility: hidden;\n  transition: transform .34s var(--ease), opacity .18s var(--ease), visibility 0s linear .18s;\n}\nbody.is-recent { overflow: hidden; }\n\n.page-inner {\n  width: min(var(--shell), 100% - 48px);\n  margin: 0 auto;\n  padding: clamp(26px, 5vh, 56px) 0 clamp(40px, 8vh, 84px);\n}\n\n.page-head {\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  gap: 12px;\n}\n.page-head h2 {\n  justify-self: center;\n  display: inline-flex; align-items: center; gap: 8px;\n  font-size: 1.06rem; letter-spacing: -.01em;\n}\n.page-head h2 svg { color: var(--text-faint); }\n.page-head .text-btn { justify-self: end; }\n\n.back {\n  justify-self: start;\n  display: inline-flex; align-items: center; gap: 7px;\n  padding: 7px 14px 7px 11px;\n  border: 1px solid var(--border-strong);\n  border-radius: 999px;\n  background: var(--bg-elev);\n  font-size: .82rem;\n  color: var(--text-dim);\n  transition: color .18s var(--ease), border-color .18s var(--ease), transform .22s var(--ease);\n}\n.back svg { color: var(--accent); transition: transform .22s var(--ease); }\n.back:hover { color: var(--text); border-color: color-mix(in srgb, var(--accent) 55%, var(--border-strong)); }\n.back:hover svg { transform: translateX(-2px); }\n.back:active { transform: scale(.96); }\n.back:active svg { transform: translateX(-2px); }\n\n.page-sub { margin-top: 12px; font-size: .78rem; color: var(--text-faint); }\n\n.page-empty {\n  margin-top: 14px;\n  padding: clamp(28px, 7vh, 64px) 0;\n  border-top: 1px solid var(--border);\n  font-size: .84rem;\n  color: var(--text-faint);\n  text-align: center;\n}\n\n.text-btn {\n  display: inline-flex; align-items: center; gap: 6px;\n  font-size: .8rem;\n  color: var(--text-faint);\n  transition: color .18s var(--ease), transform .18s var(--ease);\n}\n.text-btn:hover { color: var(--danger); }\n.text-btn:active { transform: scale(.94); }\n\n.recent-list { margin-top: 18px; border-top: 1px solid var(--border); }\n.recent-item {\n  display: flex; align-items: center; gap: 14px;\n  padding: 14px 4px;\n  border-bottom: 1px solid var(--border);\n  transition: translate .2s var(--ease), background .2s var(--ease), box-shadow .2s var(--ease), border-radius .2s var(--ease), border-color .2s var(--ease);\n}\n/* 悬浮时轻微上抬 + 阴影，强调可点（用 translate 避开 row-in 动画对 transform 的占用） */\n.recent-item:hover {\n  translate: 0 -2px;\n  background: var(--surface);\n  box-shadow: var(--shadow-md);\n  border-radius: 12px;\n  border-bottom-color: transparent;\n}\n/* 只有最新插入的那一条入场，其余保持不变，避免整列表重播动画 */\n.recent-item.is-new { animation: row-in .42s var(--ease) both; }\n@keyframes row-in {\n  from { opacity: 0; transform: translateY(7px); }\n  to   { opacity: 1; transform: none; }\n}\n.recent-item .r-url {\n  flex: 1 1 auto; min-width: 0;\n  font-family: var(--mono);\n  font-size: .82rem;\n  color: var(--text-dim);\n  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\n  transition: color .18s var(--ease);\n}\n.recent-item:hover .r-url { color: var(--text); }\n.recent-item .r-time { flex: 0 0 auto; font-size: .74rem; color: var(--text-faint); }\n.recent-item .copy { padding: 5px 11px; font-size: .75rem; }\n.r-more {\n  flex: 0 0 auto;\n  display: inline-flex; align-items: center; gap: 4px;\n  font-size: .75rem; color: var(--text-faint);\n  transition: color .18s var(--ease), transform .18s var(--ease);\n}\n.r-more:hover { color: var(--accent-hi); }\n.r-more:active { transform: scale(.94); }\n\n.copy {\n  flex: 0 0 auto;\n  display: inline-flex; align-items: center; gap: 6px;\n  padding: 7px 14px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--r-sm);\n  background: var(--surface-hi);\n  font-size: .8rem;\n  color: var(--text);\n  transition: background .18s var(--ease), color .18s var(--ease), border-color .18s var(--ease), transform .18s var(--ease);\n  white-space: nowrap;\n}\n.copy:hover { background: color-mix(in srgb, var(--accent) 22%, transparent); border-color: color-mix(in srgb, var(--accent) 55%, transparent); }\n.copy:active { transform: scale(.95); }\n.copy.is-done { color: var(--signal); border-color: color-mix(in srgb, var(--signal) 55%, transparent); background: color-mix(in srgb, var(--signal) 14%, transparent); }\n.copy.is-done svg { animation: pop-in .3s var(--ease); }\n\n/* ------------------------------------------------------------------ toast */\n\n.toast {\n  position: fixed; left: 50%; bottom: 32px; z-index: 40;\n  display: inline-flex; align-items: center; gap: 8px;\n  max-width: calc(100vw - 48px);\n  translate: -50% 0;\n  padding: 10px 18px;\n  border: 1px solid var(--border-strong);\n  border-radius: var(--r-pill);\n  background: color-mix(in srgb, var(--bg-elev) 92%, transparent);\n  backdrop-filter: blur(12px);\n  box-shadow: var(--shadow-lg);\n  font-size: .84rem;\n  opacity: 0;\n  transform: translateY(10px);\n  transition: opacity .28s var(--ease), transform .32s var(--ease);\n}\n.toast svg { flex: 0 0 auto; }\n.toast.is-in { opacity: 1; transform: none; }\n\n/* -------------------------------------------------------------- motion in */\n\n.reveal { animation: rise .8s var(--ease) both; animation-delay: var(--d, 0s); }\n@keyframes rise {\n  from { opacity: 0; transform: translateY(16px); }\n  to   { opacity: 1; transform: none; }\n}\n\n/* ------------------------------------------------------------ responsive */\n\n@media (max-width: 900px) {\n  .composer { max-width: 100%; }\n}\n\n@media (max-width: 820px) {\n  .br-lg { display: none; }\n}\n\n@media (max-width: 600px) {\n  .site-header { gap: 12px; padding: 16px 0; }\n  .brand { margin-right: auto; }\n\n  /* 窄屏：导航只留「最近访问」，收成和主题按钮一样的方形图标按钮 */\n  .nav { --nav-gap: 10px; display: flex; margin-left: 0; }\n  .nav .nav-ext { display: none; }             /* 代理地址太长，窄屏不占位置（.nav a 权重更高，要带上 .nav） */\n  #navRecent {\n    display: grid; place-items: center;\n    width: 34px; height: 34px;\n    border: 1px solid var(--border);\n    border-radius: 10px;\n    background: var(--surface);\n  }\n  #navRecent > span { display: none; }\n  #navRecent .nav-ico { display: block; }\n  #navRecent:hover { border-color: var(--border-strong); background: var(--surface-hi); }\n\n  /* 窄屏输入框折行时，上区居中的配重由 auto 外边距自动处理，这里不需要单独调 */\n  .hero h1 { max-width: none; }\n\n  .field {\n    flex-wrap: wrap;\n    padding: 10px 12px;\n    gap: 6px;\n  }\n  .field:has(#url:focus) { transform: scale(1.01); }\n  .lead { margin-right: 2px; }\n  .node { flex: 1 1 auto; max-width: none; padding: 5px 7px; font-size: .8rem; }\n  .input-wrap { flex: 1 1 auto; padding-left: 4px; }\n  #url { padding: 7px 2px; font-size: .88rem; }\n  .ghost { padding-left: 6px; font-size: .88rem; }\n  .go { width: 38px; height: 38px; }\n  .popover { top: calc(100% - 2px); max-height: var(--pop-avail, 70vh); }\n  .recent-item { flex-wrap: wrap; gap: 6px 12px; }\n  .recent-item .r-url { flex: 1 1 100%; }\n  .recent-item .r-time { order: 1; margin-right: auto; }\n  .recent-item .copy { order: 2; }\n  .recent-item .r-more { order: 3; }\n  .node-del { opacity: .7; }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  html { scroll-behavior: auto; }\n  *, *::before, *::after {\n    animation-duration: .01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: .01ms !important;\n  }\n  /* 上面的 * 匹配不到 view transition 的伪元素，要单独压掉 */\n  ::view-transition-new(root),\n  ::view-transition-old(theme-toggle-icon),\n  ::view-transition-new(theme-toggle-icon) {\n    animation-duration: .01ms !important;\n  }\n}\n";
const FASTGIT_APP_JS = "/* ==========================================================================\n   FastGit — 加速地址生成逻辑\n   规则：https://<所选节点>/ + 原始 GitHub 地址，回车直接在新标签页打开\n   ========================================================================== */\n\n(() => {\n  'use strict';\n\n  /* ------------------------------------------------------------ 常量 */\n\n  // 默认节点用「当前域名」推导：把首页部署到镜像域名后，默认就走本站加速，\n  // 换成任何自定义域名都通用。file:// 或本地预览时回退到公共节点。\n  const FALLBACK_HOST = 'gh-proxy.com';\n  const SELF_HOST = (() => {\n    try {\n      const loc = window.location;\n      if (!loc || !/^https?:$/.test(loc.protocol)) return '';\n      const host = String(loc.host || '').toLowerCase();\n      if (!host) return '';\n      if (/^(localhost|127\\.0\\.0\\.1|0\\.0\\.0\\.0|\\[::1\\])(:\\d+)?$/i.test(host)) return '';\n      return host;\n    } catch (_) { return ''; }\n  })();\n\n  const DEFAULT_NODES = [];\n  if (SELF_HOST) DEFAULT_NODES.push({ host: SELF_HOST, note: '默认' });\n  if (!DEFAULT_NODES.some((n) => n.host === FALLBACK_HOST)) {\n    DEFAULT_NODES.push({ host: FALLBACK_HOST, note: SELF_HOST ? '备用' : '默认' });\n  }\n\n  /* 其它已知代理前缀：粘贴到这类地址时会自动去掉，避免双重加速 */\n  const OTHER_PROXIES = [\n    'ghproxy.com', 'ghproxy.net', 'gh-proxy.net', 'gh.llkk.cc', 'ghfast.top',\n    'github.moeyy.xyz', 'ghps.cc', 'hub.fastgit.xyz', 'fastgit.org',\n    'gh-proxy.com',\n    SELF_HOST,\n  ].filter(Boolean);\n\n  const NODE_KEY = 'fastgit.node.v2';\n  const CUSTOM_KEY = 'fastgit.nodes.v2';\n  const STORE_KEY = 'fastgit.history.v2';\n  const THEME_KEY = 'fastgit.theme';\n  const MAX_HISTORY = 8;\n\n  /* 节点下拉面板：贴合视口用的间距常量 */\n  const POP_GAP = 8;      // 与 CSS 里 top: calc(100% + 8px) 对应\n  const POP_EDGE = 12;    // 距视口边缘留白\n  const POP_CHROME = 104; // 面板固定部分：内边距 + 标题 + 添加行\n  const POP_ROW = 42;     // 列表每行大约高度\n  const NAV_TUCK_MS = 320; // 与 styles.css 里 nav-tuck .3s 对应：外链收拢动画放完才补 hidden\n\n  const ICON_COPY  = '<svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\"/><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/></svg>';\n  const ICON_CHECK = '<svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 6 9 17l-5-5\"/></svg>';\n  const ICON_ALERT = '<svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 8v4m0 4h.01\"/></svg>';\n  const ICON_OUT   = '<svg viewBox=\"0 0 24 24\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/></svg>';\n\n  const $ = (sel, root = document) => root.querySelector(sel);\n\n  const el = {\n    form:     $('#form'),\n    field:    $('#field'),\n    fieldWrap: $('.field-wrap'),\n    input:    $('#url'),\n    ghost:    $('#ghost'),\n    clear:    $('#clear'),\n    go:       $('#go'),\n    error:    $('#error'),\n    kbdMod:   $('#kbdMod'),\n    navRecent: $('#navRecent'),\n    recent:   $('#recent'),\n    recentList: $('#recentList'),\n    recentEmpty: $('#recentEmpty'),\n    recentBack: $('#recentBack'),\n    recentSub: $('#recentSub'),\n    clearHistoryBtn: $('#clearHistory'),\n    main:     $('main'),\n    header:   $('.site-header'),\n    themeToggle: $('#themeToggle'),\n    toast:    $('#toast'),\n    nodeBtn:  $('#nodeBtn'),\n    nodeHost: $('#nodeHost'),\n    nodePop:  $('#nodePop'),\n    nodeList: $('#nodeList'),\n    nodeAddInput: $('#nodeAddInput'),\n    nodeAddBtn:   $('#nodeAddBtn'),\n    navNode:      $('#navNode'),\n    navNodeHost:  $('#navNodeHost'),\n    brand:        $('.brand'),\n  };\n\n  // 品牌 logo 回首页：线上用根路径（地址栏不带 /index.html）；\n  // 本地 file:// 直接打开时根路径会显示目录列表，这里改回 index.html。\n  if (location.protocol === 'file:') el.brand.setAttribute('href', 'index.html');\n\n  /* ------------------------------------------------------------ 主题 */\n\n  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');\n\n  function applyTheme(theme) {\n    document.documentElement.dataset.theme = theme;\n    store(THEME_KEY, theme);\n  }\n\n  (function initTheme() {\n    const saved = read(THEME_KEY);\n    applyTheme(saved === 'light' || saved === 'dark' ? saved : (prefersLight.matches ? 'light' : 'dark'));\n  })();\n\n  /* 图标自转 + 整页圆形扩散：扩散由 CSS 变量驱动的 @keyframes 完成，点击后立即开始 */\n  let themeTransition = null;\n\n  el.themeToggle.addEventListener('click', (event) => {\n    const root = document.documentElement;\n    const btn = event.currentTarget;\n    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';\n    const r = btn.getBoundingClientRect();\n    const x = r.left + r.width / 2;\n    const y = r.top + r.height / 2;\n    const radius = Math.ceil(Math.hypot(\n      Math.max(x, window.innerWidth - x),\n      Math.max(y, window.innerHeight - y)\n    ));\n\n    root.style.setProperty('--theme-reveal-x', `${Math.round(x)}px`);\n    root.style.setProperty('--theme-reveal-y', `${Math.round(y)}px`);\n    root.style.setProperty('--theme-reveal-r', `${radius}px`);\n\n    let applied = false;\n    const applyUpdate = () => {\n      applied = true;\n      applyTheme(next);\n    };\n\n    const spinIcon = () => {\n      const icon = Array.from(btn.children).find(n => n.nodeType === 1 && n.offsetParent !== null);\n      if (!icon) return;\n      icon.classList.remove('anim-rotate');\n      void icon.offsetWidth;\n      icon.classList.add('anim-rotate');\n    };\n\n    const fallback = () => {\n      spinIcon();\n      applyUpdate();\n    };\n\n    if (typeof document.startViewTransition !== 'function') { fallback(); return; }\n\n    if (themeTransition) {\n      try { themeTransition.skipTransition(); } catch (err) {}\n      themeTransition = null;\n    }\n\n    root.classList.add('theme-no-transition');\n    try {\n      const transition = document.startViewTransition(applyUpdate);\n      themeTransition = transition;\n      const settle = () => {\n        if (themeTransition === transition) themeTransition = null;\n        root.classList.remove('theme-no-transition');\n        if (!applied) applyUpdate();\n      };\n      transition.finished.then(settle, settle);\n      transition.ready.catch(() => {});\n    } catch (err) {\n      root.classList.remove('theme-no-transition');\n      fallback();\n    }\n  });\n\n  /* --------------------------------------------------------- 节点管理 */\n\n  let customNodes = loadCustomNodes();\n  let currentHost = read(NODE_KEY) || DEFAULT_NODES[0].host;\n\n  function loadCustomNodes() {\n    try {\n      const raw = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');\n      return Array.isArray(raw) ? raw.filter((h) => typeof h === 'string' && isHostLike(h)) : [];\n    } catch (_) { return []; }\n  }\n\n  function nodes() {\n    return [\n      ...DEFAULT_NODES.map((n) => ({ ...n })),\n      ...customNodes.map((h) => ({ host: h, note: '自定义', custom: true })),\n    ];\n  }\n\n  function isHostLike(v) {\n    const h = String(v || '').trim().toLowerCase();\n    return /^[a-z0-9][a-z0-9.-]*\\.[a-z]{2,}$/.test(h) && !h.includes('..');\n  }\n\n  function cleanHost(v) {\n    return String(v || '')\n      .trim().toLowerCase()\n      .replace(/^[a-z]+:\\/\\//, '')\n      .replace(/\\/.*$/, '')\n      .replace(/\\/+$/, '');\n  }\n\n  const baseURL = (host = currentHost) => `https://${host}/`;\n  const proxy = (target) => baseURL() + target;\n\n  function allProxies() {\n    return [...new Set([...OTHER_PROXIES, ...customNodes, currentHost])];\n  }\n\n  function setNode(host, { silent = false } = {}) {\n    if (!host) return;\n    currentHost = host;\n    store(NODE_KEY, host);\n    syncNodeUI();\n    renderHistory();\n    if (!silent) toast(`已切换到 ${host}`);\n  }\n\n  let lastNavHost = null;\n  let navHideTimer = 0;\n\n  /** 外链整项收起来：hidden 是 display:none，直接打会跳过过渡，所以先演一段收拢再收起 */\n  function tuckNavNode() {\n    const nav = el.navNode;\n    // 实测宽度写进 --nav-w：用估算值的话，动画前半段会因为没有可见变化而空跑\n    nav.style.setProperty('--nav-w', `${nav.offsetWidth}px`);\n    nav.classList.add('is-tuck');\n    navHideTimer = setTimeout(() => {\n      navHideTimer = 0;\n      nav.hidden = true;\n      nav.classList.remove('is-tuck');\n    }, NAV_TUCK_MS);\n  }\n\n  function syncNodeUI() {\n    el.nodeHost.textContent = currentHost;\n    el.navNodeHost.textContent = currentHost;\n    el.navNode.href = baseURL();\n\n    const nav = el.navNode;\n    // 选中的节点就是本站时，右上角的外链没有意义，收起它\n    const isSelf = Boolean(SELF_HOST) && currentHost === SELF_HOST;\n    const changed = lastNavHost !== null && lastNavHost !== currentHost;\n    const wasTucked = nav.hidden;\n    lastNavHost = currentHost;\n\n    clearTimeout(navHideTimer);\n    navHideTimer = 0;\n    nav.classList.remove('is-swap', 'is-tuck', 'is-untuck');\n\n    if (isSelf) {\n      // 首次进站（changed 为 false）直接收起，不放动画\n      if (changed && !wasTucked) tuckNavNode();\n      else nav.hidden = true;\n    } else {\n      nav.hidden = false;\n      if (wasTucked) nav.style.setProperty('--nav-w', `${nav.offsetWidth}px`);\n      void nav.offsetWidth;\n      if (changed) nav.classList.add('is-swap');\n      if (wasTucked) nav.classList.add('is-untuck');\n    }\n    renderNodeList();\n  }\n\n  function renderNodeList() {\n    el.nodeList.innerHTML = nodes().map((n) => `\n      <li>\n        <button class=\"node-item${n.host === currentHost ? ' is-active' : ''}\" type=\"button\"\n                role=\"option\" aria-selected=\"${n.host === currentHost}\"\n                data-host=\"${escapeHtml(n.host)}\">\n          <span class=\"node-dot\" aria-hidden=\"true\"></span>\n          <span class=\"node-name\">${escapeHtml(n.host)}</span>\n          <span class=\"node-note\">${escapeHtml(n.note || '')}</span>\n          ${n.custom ? `<span class=\"node-del\" data-remove=\"${escapeHtml(n.host)}\" title=\"删除该节点\">\n              <svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6 6 18M6 6l12 12\"/></svg>\n            </span>` : ''}\n        </button>\n      </li>`).join('');\n  }\n\n  function openNodePop() {\n    placeNodePop();\n    el.nodePop.hidden = false;\n    el.nodePop.classList.remove('is-in');\n    requestAnimationFrame(() => requestAnimationFrame(() => el.nodePop.classList.add('is-in')));\n    el.nodeBtn.setAttribute('aria-expanded', 'true');\n  }\n\n  function closeNodePop() {\n    el.nodeBtn.setAttribute('aria-expanded', 'false');\n    el.nodePop.classList.remove('is-in');\n    setTimeout(() => { el.nodePop.hidden = true; }, 200);\n  }\n\n  const nodePopOpen = () => !el.nodePop.hidden && el.nodePop.classList.contains('is-in');\n\n  /** 把面板限制在当前视口内：下方不够就翻到上方，绝不把页面撑高 */\n  function placeNodePop() {\n    const wrap = el.fieldWrap.getBoundingClientRect();\n    const vh = document.documentElement.clientHeight;\n    const below = vh - wrap.bottom - POP_GAP - POP_EDGE;\n    const above = wrap.top - POP_GAP - POP_EDGE;\n\n    // 面板「自然高度」≈ 固定部分（标题+添加行+内边距）+ 可见行数 × 行高\n    const rows = Math.min(el.nodeList.children.length, 7);\n    const need = POP_CHROME + rows * POP_ROW;\n    const up = below < Math.min(need, 300) && above > below;\n\n    el.nodePop.classList.toggle('is-up', up);\n    el.nodePop.style.setProperty('--pop-avail', Math.max(132, Math.min(up ? above : below, 560)) + 'px');\n  }\n\n  el.nodeBtn.addEventListener('click', (e) => {\n    e.stopPropagation();\n    nodePopOpen() ? closeNodePop() : openNodePop();\n  });\n\n  el.nodeList.addEventListener('click', (e) => {\n    const del = e.target.closest('[data-remove]');\n    if (del) {\n      e.stopPropagation();\n      const host = del.dataset.remove;\n      customNodes = customNodes.filter((h) => h !== host);\n      store(CUSTOM_KEY, JSON.stringify(customNodes));\n      if (currentHost === host) setNode(DEFAULT_NODES[0].host, { silent: true });\n      renderNodeList();\n      toast(`已移除 ${host}`);\n      return;\n    }\n    const item = e.target.closest('.node-item');\n    if (!item) return;\n    setNode(item.dataset.host);\n    closeNodePop();\n  });\n\n  function addCustomNode() {\n    const host = cleanHost(el.nodeAddInput.value);\n    if (!isHostLike(host)) {\n      toast('节点格式不正确，例如 gh-proxy.com', true);\n      el.nodeAddInput.focus();\n      return;\n    }\n    if (!nodes().some((n) => n.host === host)) {\n      customNodes.push(host);\n      store(CUSTOM_KEY, JSON.stringify(customNodes));\n    }\n    el.nodeAddInput.value = '';\n    setNode(host);\n    closeNodePop();\n  }\n\n  el.nodeAddBtn.addEventListener('click', addCustomNode);\n  el.nodeAddInput.addEventListener('keydown', (e) => {\n    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); addCustomNode(); }\n  });\n\n  document.addEventListener('click', (e) => {\n    if (!nodePopOpen()) return;\n    if (el.nodePop.contains(e.target) || el.nodeBtn.contains(e.target)) return;\n    closeNodePop();\n  });\n\n  // 窗口尺寸变化时重新贴合视口（面板开着才需要）\n  window.addEventListener('resize', () => {\n    if (!el.nodePop.hidden) placeNodePop();\n    syncHeaderVar();\n  });\n\n  /* ------------------------------------------------- 输入框光标提示动画 */\n\n  const SAMPLES = [\n    'https://github.com/torvalds/linux',\n    'https://github.com/microsoft/vscode/releases/latest',\n    'https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore',\n  ];\n\n  const ghostHint = { text: '', typed: 0, sample: 0, timer: null, focused: false };\n\n  function renderGhost() {\n    const show = !el.input.value && !ghostHint.focused;\n    // 隐藏时用淡出，而不是瞬间清空，避免聚焦「闪一下」\n    if (show) el.ghost.innerHTML = escapeHtml(ghostHint.text) + '<span class=\"caret\" aria-hidden=\"true\"></span>';\n    el.ghost.classList.toggle('is-hidden', !show);\n  }\n\n  function tickGhost() {\n    if (el.input.value || ghostHint.focused) return;\n    const full = SAMPLES[ghostHint.sample % SAMPLES.length];\n    if (ghostHint.typed <= full.length) {\n      ghostHint.typed += 1;\n      ghostHint.text = full.slice(0, ghostHint.typed);\n      renderGhost();\n      ghostHint.timer = setTimeout(tickGhost, 26 + Math.random() * 34);\n    } else {\n      ghostHint.timer = setTimeout(() => {\n        ghostHint.sample += 1;\n        ghostHint.typed = 0;\n        ghostHint.text = '';\n        renderGhost();\n        tickGhost();\n      }, 1900);\n    }\n  }\n\n  function startGhost() {\n    stopGhost();\n    ghostHint.timer = setTimeout(tickGhost, 500);\n  }\n  function stopGhost() {\n    clearTimeout(ghostHint.timer);\n    ghostHint.timer = null;\n  }\n\n  el.input.addEventListener('focus', () => {\n    ghostHint.focused = true;\n    stopGhost();\n    renderGhost();\n  });\n  el.input.addEventListener('blur', () => {\n    ghostHint.focused = false;\n    renderGhost();\n    if (!el.input.value && !ghostHint.timer) startGhost();\n  });\n\n  startGhost();\n\n  /* --------------------------------------------------------- 地址解析 */\n\n  /** 去掉已有代理前缀、补全协议，得到干净的 GitHub 原始地址 */\n  function normalize(raw) {\n    let v = String(raw || '').trim();\n    if (!v) return { ok: false, reason: 'empty' };\n\n    const proxyRe = new RegExp('^https?://(?:' + allProxies().map(escapeRe).join('|') + ')/+', 'i');\n    while (proxyRe.test(v)) v = v.replace(proxyRe, '');\n    v = v.replace(/^\\/+/, '').trim();\n\n    if (/^(www\\.)?github\\.com\\//i.test(v)) v = 'https://' + v.replace(/^www\\./i, '');\n    else if (/^(github\\.com|gist\\.github\\.com)$/i.test(v)) v = 'https://' + v;\n    else if (/^(?:raw\\.githubusercontent\\.com|codeload\\.github\\.com|gist\\.githubusercontent\\.com|objects\\.githubusercontent\\.com)\\//i.test(v)) {\n      v = 'https://' + v;\n    }\n\n    if (!/^https?:\\/\\//i.test(v)) return { ok: false, reason: 'scheme' };\n\n    let url;\n    try { url = new URL(v); } catch (_) { return { ok: false, reason: 'invalid' }; }\n\n    const host = url.hostname.toLowerCase();\n    const allowed =\n      host === 'github.com' || host === 'www.github.com' || host === 'gist.github.com' ||\n      host.endsWith('.githubusercontent.com') || host === 'codeload.github.com';\n\n    if (!allowed) return { ok: false, reason: 'host', host };\n\n    url.hostname = host.replace(/^www\\./, '');\n    url.hash = '';\n    return { ok: true, url: url.toString() };\n  }\n\n  /** 判断链接类型 + 可派生的素材（ZIP / Raw） */\n  function inspect(u) {\n    const s = u.toString();\n    const host = u.hostname.toLowerCase();\n    const parts = u.pathname.split('/').filter(Boolean);\n\n    if (host === 'gist.github.com') return { kind: 'Gist', raw: rawFromGist(u) };\n    if (host !== 'github.com') return { kind: 'Raw 文件' };\n\n    if (/\\/releases\\/download\\//.test(s)) return { kind: 'Release 文件' };\n    if (/\\/releases\\/latest\\/?$/.test(s)) return { kind: '最新 Release' };\n    if (/\\/releases\\/tag\\//.test(s)) return { kind: 'Release 标签' };\n    if (/\\/releases\\/?$/.test(s)) return { kind: 'Release 列表' };\n    if (/\\/archive\\//.test(s)) return { kind: '源码压缩包' };\n    if (/\\.git\\/?$/.test(s)) return { kind: 'Git Clone' };\n\n    if (/\\/blob\\//.test(s)) {\n      // github.com/u/r/blob/branch/path → raw.githubusercontent.com/u/r/branch/path\n      const m = u.pathname.match(/^\\/([^/]+)\\/([^/]+)\\/blob\\/(.+)$/);\n      const raw = m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}${u.search}` : null;\n      return { kind: '文件页面', raw };\n    }\n\n    if (/\\/tree\\//.test(s)) return { kind: '目录' };\n    if (parts.length === 2) {\n      return { kind: '仓库页面', zip: `https://github.com/${parts[0]}/${parts[1]}/archive/HEAD.zip` };\n    }\n    if (parts.length === 1) return { kind: '用户主页' };\n    return { kind: 'GitHub 页面' };\n  }\n\n  function rawFromGist(u) {\n    const m = u.pathname.match(/^\\/([^/]+)\\/([a-f0-9]+)(?:\\/(.*))?$/i);\n    if (!m) return null;\n    const tail = m[3] ? `/raw/${m[3]}` : '/raw';\n    return `https://gist.githubusercontent.com/${m[1]}/${m[2]}${tail}`;\n  }\n\n  /* ------------------------------------------------------------ 主流程 */\n\n  function showError(message) {\n    el.error.textContent = message;\n    el.error.hidden = false;\n    /* 报错期间保持红色：边框与聚焦光晕一起变红，直到 clearError 才恢复 */\n    el.field.classList.remove('is-error');\n    void el.field.offsetWidth; /* 强制重排，让连续报错也能重播抖动动画 */\n    el.field.classList.add('is-error');\n  }\n\n  function clearError() {\n    el.field.classList.remove('is-error');\n    el.error.hidden = true;\n    el.error.textContent = '';\n  }\n\n  /** 加速 = 直接在新标签页打开拼接后的地址 */\n  function submit(value) {\n    const source = value ?? el.input.value;\n    const res = normalize(source);\n\n    if (!res.ok) {\n      const messages = {\n        empty: '先粘贴一条 GitHub 链接吧！',\n        scheme: '无法识别的地址，请以 github.com/… 或 https:// 开头。',\n        invalid: '这个地址看起来不太对，请检查后重试。',\n        host: `只支持 GitHub 域名，当前是 ${res.host || '未知域名'}。`,\n      };\n      showError(messages[res.reason] || '链接格式不正确。');\n      return;\n    }\n\n    clearError();\n    const origin = res.url;\n    const info = inspect(new URL(origin));\n    const acc = proxy(origin);\n\n    if (el.input.value !== source) el.input.value = source;\n    el.clear.hidden = false;\n    pushHistory(origin);\n\n    // 注意：window.open(..., 'noopener') 永远返回 null，会导致每次都误判为「被拦截」\n    // 从而去调剪贴板（浏览器就会弹权限）。这里保留句柄来判断，再手动切断 opener。\n    const win = window.open(acc, '_blank');\n    if (win) {\n      try { win.opener = null; } catch (_) { /* 跨域时忽略 */ }\n      toast(`已在新标签页打开 · ${info.kind}`);\n    } else if (legacyCopy(acc)) {\n      // 只用不触发权限提示的传统复制，绝不在这里调用 clipboard API\n      toast('新标签页被拦截，加速链接已复制', true);\n    } else {\n      toast('新标签页被拦截，可在下方「最近访问」里复制或打开', true);\n    }\n  }\n\n  el.form.addEventListener('submit', (e) => {\n    e.preventDefault();\n    submit();\n  });\n\n  el.input.addEventListener('input', () => {\n    el.clear.hidden = !el.input.value;\n    if (!el.input.value) {\n      ghostHint.typed = 0;\n      ghostHint.text = '';\n      if (!ghostHint.timer) startGhost();\n    }\n    renderGhost();\n    if (!el.error.hidden) clearError();\n  });\n\n  el.clear.addEventListener('click', () => {\n    el.input.value = '';\n    el.clear.hidden = true;\n    clearError();\n    ghostHint.typed = 0;\n    ghostHint.text = '';\n    if (!ghostHint.timer) startGhost();\n    renderGhost();\n    el.input.focus();\n  });\n\n  document.addEventListener('keydown', (e) => {\n    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {\n      e.preventDefault();\n      if (recentPageOpen()) focusOnClose = 'input';   // 直接回首页输入框\n      clearHash();\n      el.input.focus();\n      el.input.select();\n    }\n    if (e.key === 'Escape') {\n      if (recentPageOpen()) { clearHash(); return; }   // 先退「最近访问」这一页\n      if (nodePopOpen()) { closeNodePop(); return; }\n      if (document.activeElement === el.input) el.input.blur();\n    }\n  });\n\n  /* ---------------------------------------------------------- 复制/提示 */\n\n  function setCopyState(button, done) {\n    const label = button.dataset.label || '复制';\n    button.classList.toggle('is-done', done);\n    button.innerHTML = (done ? ICON_CHECK : ICON_COPY) + `<span>${done ? '已复制' : escapeHtml(label)}</span>`;\n  }\n\n  async function copyText(text, button) {\n    const ok = await writeClipboard(text);\n    if (ok) {\n      if (button) {\n        setCopyState(button, true);\n        clearTimeout(button._copyTimer);\n        button._copyTimer = setTimeout(() => setCopyState(button, false), 1600);\n      }\n      toast('加速链接已复制');\n    } else {\n      toast('复制失败，请手动选中链接', true);\n    }\n    return ok;\n  }\n\n  /**\n   * 写剪贴板。\n   * 优先用不会触发任何权限弹窗的传统方案（临时 textarea + execCommand），\n   * 只有当它不可用时，才退回到 navigator.clipboard.writeText。\n   */\n  async function writeClipboard(text) {\n    if (legacyCopy(text)) return true;\n\n    try {\n      if (navigator.clipboard && window.isSecureContext) {\n        await navigator.clipboard.writeText(text);\n        return true;\n      }\n    } catch (_) { /* 用户拒绝或环境不支持 */ }\n    return false;\n  }\n\n  /** 传统复制：同步、不请求权限，也不会因为移出视口而滚屏 */\n  function legacyCopy(text) {\n    const active = document.activeElement;\n    let ta = null;\n    try {\n      ta = document.createElement('textarea');\n      ta.value = text;\n      ta.setAttribute('readonly', '');\n      ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none';\n      document.body.appendChild(ta);\n      ta.select();\n      ta.setSelectionRange(0, text.length);\n      return document.execCommand('copy');\n    } catch (_) {\n      return false;\n    } finally {\n      if (ta && ta.parentNode) ta.parentNode.removeChild(ta);\n      // 把焦点还给原来的输入框，避免一次视觉跳动\n      if (active && typeof active.focus === 'function') active.focus({ preventScroll: true });\n    }\n  }\n\n  let toastTimer = null;\n  function toast(message, isError = false) {\n    el.toast.innerHTML = (isError ? ICON_ALERT : ICON_CHECK) + `<span>${escapeHtml(message)}</span>`;\n    el.toast.style.color = isError ? 'var(--danger)' : 'var(--text)';\n    el.toast.hidden = false;\n    requestAnimationFrame(() => el.toast.classList.add('is-in'));\n    clearTimeout(toastTimer);\n    toastTimer = setTimeout(() => {\n      el.toast.classList.remove('is-in');\n      setTimeout(() => { el.toast.hidden = true; }, 320);\n    }, 2400);\n  }\n\n  /* -------------------------------------------------------------- 历史 */\n\n  let history = loadHistory();\n\n  function loadHistory() {\n    try {\n      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');\n      if (!Array.isArray(raw)) return [];\n      // 同时校验 at：旧版本或外部写入的坏数据缺了时间戳，相对时间会算成 NaN\n      return raw\n        .filter((it) => it && typeof it.url === 'string' && Number.isFinite(it.at))\n        .slice(0, MAX_HISTORY);\n    } catch (_) { return []; }\n  }\n\n  function saveHistory() {\n    store(STORE_KEY, JSON.stringify(history));\n  }\n\n  let flashUrl = null;   // 只给最新插入的那一条加入场动画，避免整列表重播\n\n  function pushHistory(url) {\n    history = [{ url, at: Date.now() }, ...history.filter((it) => it.url !== url)].slice(0, MAX_HISTORY);\n    flashUrl = url;\n    saveHistory();\n    renderHistory();\n  }\n\n  function relativeTime(ts) {\n    if (!Number.isFinite(ts)) return '';\n    const diff = Date.now() - ts;\n    if (diff < 60e3) return '刚刚';\n    if (diff < 3600e3) return `${Math.floor(diff / 60e3)} 分钟前`;\n    if (diff < 864e5) return `${Math.floor(diff / 3600e3)} 小时前`;\n    return `${Math.floor(diff / 864e5)} 天前`;\n  }\n\n  function renderHistory() {\n    // 入口常驻：没有记录时也进得去，那一页会显示空状态\n    el.recentEmpty.hidden = history.length > 0;\n    el.clearHistoryBtn.hidden = !history.length;\n\n    if (!history.length) {\n      el.recentList.innerHTML = '';\n      el.recentSub.textContent = '';\n      flashUrl = null;\n      return;\n    }\n\n    el.recentSub.textContent = `共 ${history.length} 条 · 只保存在本地浏览器里`;\n\n    el.recentList.innerHTML = history.map((item) => {\n      const acc = proxy(item.url);\n      const isNew = item.url === flashUrl;\n      return `\n        <li class=\"recent-item${isNew ? ' is-new' : ''}\">\n          <span class=\"r-url\" title=\"${escapeHtml(item.url)}\">${escapeHtml(item.url)}</span>\n          <span class=\"r-time\" data-at=\"${item.at}\">${relativeTime(item.at)}</span>\n          <button class=\"copy\" type=\"button\" data-copy=\"${escapeHtml(acc)}\" data-label=\"复制\">${ICON_COPY}<span>复制</span></button>\n          <a class=\"r-more\" href=\"${escapeHtml(acc)}\" target=\"_blank\" rel=\"noopener\">打开${ICON_OUT}</a>\n        </li>`;\n    }).join('');\n\n    flashUrl = null;\n  }\n\n  /**\n   * 只把「几分钟前」这类文本重写一遍。\n   * 不能整个列表重绘：那样会清掉「已复制 ✓」状态、用户选中的文本和列表的入场动画。\n   */\n  function refreshRelativeTimes() {\n    if (!history.length) return;\n    for (const node of el.recentList.querySelectorAll('.r-time')) {\n      node.textContent = relativeTime(Number(node.dataset.at));\n    }\n  }\n\n  el.recentList.addEventListener('click', (e) => {\n    const btn = e.target.closest('button[data-copy]');\n    if (!btn) return;\n    copyText(btn.dataset.copy, btn);\n  });\n\n  el.clearHistoryBtn.addEventListener('click', () => {\n    history = [];\n    saveHistory();\n    renderHistory();\n    toast('已清空本地记录');\n  });\n\n  /* ------------------------------------ 最近访问：独立一页 + 滑入过渡 */\n\n  function recentPageOpen() {\n    return el.recent.classList.contains('is-open');\n  }\n\n  /** 页面顶部留出的高度 = 顶栏高度（这一页从顶栏下面开始，顶栏始终可用） */\n  function syncHeaderVar() {\n    document.documentElement.style.setProperty('--header-h', el.header.offsetHeight + 'px');\n  }\n\n  let focusOnClose = 'nav';   // 退出这一页时焦点去哪：'nav' 回导航链接，'input' 直接回输入框\n\n  function setRecentPage(open) {\n    if (open === recentPageOpen()) return;\n\n    el.recent.classList.toggle('is-open', open);\n    document.body.classList.toggle('is-recent', open);\n    if (open) el.navRecent.setAttribute('aria-current', 'page');\n    else el.navRecent.removeAttribute('aria-current');\n    el.main.inert = open;                 // 首页在下面，别让 Tab 钻进去\n\n    if (open) {\n      // 列表可能是几分钟前渲染的，先把相对时间对一遍（只改文本，不重绘）\n      refreshRelativeTimes();\n      el.recent.scrollTop = 0;\n      if (document.activeElement === el.input) el.input.blur();\n      // 下一帧再聚焦：页面刚加载就带 #recent 时，浏览器随后会把焦点收回 BODY，这里补一次\n      requestAnimationFrame(() => {\n        if (recentPageOpen()) el.recentBack.focus({ preventScroll: true });\n      });\n    } else {\n      // 退出：焦点先回到触发处（或直接回输入框），再隐藏这一页\n      const target = focusOnClose === 'input' ? el.input : el.navRecent;\n      focusOnClose = 'nav';\n      target.focus({ preventScroll: true });\n      if (target === el.input) el.input.select();\n    }\n\n    // 放在焦点处理之后：别让 aria-hidden 落在还持有焦点的元素上\n    el.recent.setAttribute('aria-hidden', open ? 'false' : 'true');\n  }\n\n  /** 退出「最近访问」这一页时清掉地址栏的 hash。\n      收尾用 replaceState，否则 `location.hash = ''` 会在地址栏留下一个裸露的 #。\n      （局部数组变量 `history` 会遮蔽全局，所以这里显式写 window.history。） */\n  function clearHash() {\n    if (location.href.indexOf('#') === -1) return;\n    location.hash = '';   // 触发 hashchange，页面按原逻辑收起\n    try { window.history.replaceState(window.history.state, '', location.pathname + location.search); } catch (_) {}\n  }\n\n  /** 地址栏 #recent 和页面状态保持同步：浏览器后退键、直接分享链接都能用 */\n  function syncRecentFromHash() {\n    setRecentPage(location.hash === '#recent');\n  }\n\n  el.recentBack.addEventListener('click', clearHash);\n\n  // 已经在这一页时，再点「最近访问」就收回去（默认行为只是重复设同一个 hash，不会触发切换）\n  el.navRecent.addEventListener('click', (e) => {\n    if (!recentPageOpen()) return;\n    e.preventDefault();\n    clearHash();\n  });\n\n  window.addEventListener('hashchange', syncRecentFromHash);\n\n  // 相对时间每分钟走一格：只改文本，而且没停在「最近访问」那一页时不用刷\n  setInterval(() => { if (recentPageOpen()) refreshRelativeTimes(); }, 60e3);\n\n  /* ------------------------------------------------------------ 工具函数 */\n\n  function store(key, value) {\n    try { localStorage.setItem(key, value); } catch (_) {}\n  }\n  function read(key) {\n    try { return localStorage.getItem(key); } catch (_) { return null; }\n  }\n  function escapeHtml(s) {\n    return String(s).replace(/[&<>\"']/g, (c) => ({\n      '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;',\n    }[c]));\n  }\n  function escapeRe(s) {\n    return s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');\n  }\n\n  /* 初始化 */\n  if (!nodes().some((n) => n.host === currentHost)) currentHost = DEFAULT_NODES[0].host;\n  syncNodeUI();\n  renderHistory();\n  syncHeaderVar();\n\n  syncRecentFromHash();   // 直接用 #recent 打开时直接落在这一页\n  if (location.hash !== '#recent') clearHash();   // 顺手清掉旧版本遗留在地址栏的裸 #\n\n  if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) el.kbdMod.textContent = '⌘';\n})();\n";
// </fastgit-assets>

const FASTGIT_ASSETS = {
  "/": { contentType: "text/html; charset=utf-8", body: FASTGIT_INDEX_HTML },
  "/index.html": { contentType: "text/html; charset=utf-8", body: FASTGIT_INDEX_HTML },
  "/styles.css": { contentType: "text/css; charset=utf-8", body: FASTGIT_STYLES_CSS },
  "/app.js": { contentType: "text/javascript; charset=utf-8", body: FASTGIT_APP_JS },
};

// The mirror's own landing page. It is embedded because the worker is deployed
// as a single pasted file, so no static assets are available at runtime.
function createFastGitAssetResponse(pathname, method) {
  const asset = FASTGIT_ASSETS[pathname];
  if (!asset) return null;
  return new Response(method === "HEAD" ? null : asset.body, {
    status: 200,
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=600",
      "X-FastGit-Route": "local",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    try {
      const loginEnabled = readBoolean(env?.ALLOW_LOGIN, DEFAULT_ALLOW_LOGIN);
      const sourceRepository = readRepository(env?.SOURCE_REPOSITORY, DEFAULT_SOURCE_REPOSITORY);
      const cacheTtl = readInteger(env?.CACHE_TTL, DEFAULT_CACHE_TTL, 0, 86400);
      const proxyCountries = readCountries(env?.PROXY_COUNTRIES, DEFAULT_PROXY_COUNTRIES);
      const routing = getRoutingInfo(request, proxyCountries);
      const response = await proxyRequest(request, ctx, { loginEnabled, sourceRepository, cacheTtl, routing });
      return withRoutingHeaders(response, routing);
    } catch (error) {
      // 请求里的上游域名不在白名单：这是调用方的问题，不是镜像故障，不该报 500
      if (error?.code === "UPSTREAM_NOT_ALLOWED") return createUpstreamNotAllowedResponse();
      const errorId = createErrorId();
      const message = error instanceof Error ? error.message : "Unknown error";
      writeLog("error", JSON.stringify({ errorId, name: error?.name || "Error", message: message.slice(0, 300) }));
      return new Response(`Mirror error. Error ID: ${errorId}`, {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Mirror-Error-ID": errorId,
        },
      });
    }
  },
};

function createErrorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function writeLog(level, ...args) {
  if (typeof console === "undefined") return;
  const logger = typeof console[level] === "function" ? console[level] : console.log;
  if (typeof logger === "function") logger.apply(console, args);
}

function readBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["true", "1", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function readRepository(value, fallback) {
  const repository = String(value || "").trim();
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) ? repository : fallback;
}

function readInteger(value, fallback, min, max) {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

// Parses a comma separated list of ISO 3166-1 alpha-2 codes.
// Returns null to mean "proxy every visitor" (feature disabled).
function readCountries(value, fallback) {
  const raw = String(value ?? fallback).trim() || String(fallback).trim();
  if (raw === "*") return null;
  const countries = raw
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter((item) => /^[A-Z]{2}$/.test(item));
  return new Set(countries.length > 0 ? countries : String(fallback).split(",").map((item) => item.trim().toUpperCase()));
}

async function proxyRequest(request, ctx, settings) {
  const { loginEnabled, sourceRepository, cacheTtl, routing } = settings;
  const publicUrl = new URL(request.url);

  if (publicUrl.pathname === "/__fastgit/diagnostics") {
    return createRoutingDiagnostics(routing, request.method);
  }

  // 健康检查放在 /__fastgit/ 下：GitHub 用户名不允许下划线，这个前缀永远不会
  // 撞上真实的用户/仓库路径；放在 /healthy 会遮蔽同名的 GitHub 用户主页。
  if (publicUrl.pathname === "/__fastgit/healthy") {
    return createHealthResponse(loginEnabled, sourceRepository);
  }

  // Serve the mirror's own landing page instead of proxying github.com's home.
  if (request.method === "GET" || request.method === "HEAD") {
    const assetResponse = createFastGitAssetResponse(publicUrl.pathname, request.method);
    if (assetResponse) return assetResponse;
  }

  const embeddedUpstreamUrl = getEmbeddedUpstreamUrl(publicUrl);
  const upstreamUrl = embeddedUpstreamUrl || getUpstreamUrl(publicUrl);

  if (!loginEnabled && isLoginPath(upstreamUrl.pathname)) {
    return createLoginDisabledResponse();
  }

  if (routing.route === "direct") {
    return createDirectRedirect(upstreamUrl, request.method);
  }

  // GitHub's client router expects /owner/repo to match the browser pathname.
  // A wrapped /https://github.com/... URL leaves deferred queries uninitialized.
  if (embeddedUpstreamUrl && (request.method === "GET" || request.method === "HEAD")) {
    return createCanonicalRedirect(publicUrl, upstreamUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("Host");
  requestHeaders.delete("CF-Connecting-IP");
  requestHeaders.delete("CF-IPCountry");
  requestHeaders.delete("Ali-Ip-Country");
  requestHeaders.delete("Ali-Ip-City");
  requestHeaders.delete("Ali-Real-Client-Ip");
  requestHeaders.delete("CF-Ray");
  requestHeaders.delete("CF-Visitor");
  requestHeaders.delete("X-Forwarded-For");
  requestHeaders.delete("X-Forwarded-Host");
  requestHeaders.delete("Cf-Access-Jwt-Assertion");

  const incomingCookie = requestHeaders.get("Cookie");
  if (incomingCookie) {
    const filteredCookie = incomingCookie
      .split(";")
      .map((part) => part.trim())
      .filter((part) => !/^(?:CF_Authorization|CF_Binding)=/i.test(part))
      .join("; ");
    if (filteredCookie) requestHeaders.set("Cookie", filteredCookie);
    else requestHeaders.delete("Cookie");
  }

  if (upstreamUrl.hostname !== PRIMARY_HOST) {
    requestHeaders.delete("Cookie");
  }

  if (upstreamUrl.hostname !== PRIMARY_HOST && upstreamUrl.hostname !== "api.github.com") {
    requestHeaders.delete("Authorization");
  }

  if (requestHeaders.has("Origin")) {
    requestHeaders.set("Origin", "https://github.com");
  }

  const referer = requestHeaders.get("Referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host === publicUrl.host) {
        requestHeaders.set("Referer", getUpstreamUrl(refererUrl).toString());
      }
    } catch {
      requestHeaders.delete("Referer");
    }
  }

  const fetchOptions = {
    method: request.method,
    headers: requestHeaders,
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    fetchOptions.body = request.body;
  }

  const cacheable = cacheTtl > 0 && request.method === "GET" && STATIC_CACHE_HOSTS.has(upstreamUrl.hostname);
  const edgeCache = typeof caches !== "undefined" ? caches.default : null;
  const cacheKey = new Request(publicUrl.toString(), { method: "GET" });

  if (cacheable && edgeCache) {
    try {
      const cached = await edgeCache.match(cacheKey);
      if (cached) {
        const cacheHitResponse = new Response(cached.body, cached);
        cacheHitResponse.headers.set("X-Mirror-Cache", "HIT");
        return cacheHitResponse;
      }
    } catch (error) {
      writeLog("warn", "Mirror cache read failed:", error instanceof Error ? error.message : "Unknown error");
    }
  }

  const upstreamResponse = await fetch(upstreamUrl.toString(), fetchOptions);

  if (upstreamResponse.status === 101 && upstreamResponse.webSocket) {
    return upstreamResponse;
  }

  const response = await buildResponse(upstreamResponse, publicUrl, upstreamUrl, request.method);

  if (cacheable && edgeCache && response.ok && !response.headers.has("Set-Cookie")) {
    const cachedResponse = new Response(response.body, response);
    cachedResponse.headers.set("Cache-Control", `public, max-age=${cacheTtl}`);
    cachedResponse.headers.set("X-Mirror-Cache", "MISS");
    const cacheWrite = edgeCache.put(cacheKey, cachedResponse.clone()).catch((error) => {
      writeLog("warn", "Mirror cache write failed:", error instanceof Error ? error.message : "Unknown error");
    });
    if (ctx && typeof ctx.waitUntil === "function") ctx.waitUntil(cacheWrite);
    else await cacheWrite;
    return cachedResponse;
  }

  return response;
}

function createLoginDisabledResponse() {
  return new Response(renderLoginDisabledPage(), {
    status: 403,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "X-FastGit-Login": "disabled",
      "X-FastGit-Route": "blocked",
    },
  });
}

// 上游域名不在白名单：镜像只代理 GitHub 相关域名，这属于请求错误，返回 400。
function createUpstreamNotAllowedResponse() {
  return new Response("Upstream host is not allowed. This mirror only proxies GitHub hosts.", {
    status: 400,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-FastGit-Route": "blocked",
    },
  });
}

function renderLoginDisabledPage() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>FastGit 登录未开放</title>
  <style>
    *{box-sizing:border-box}html{background:#f5f5f7}body{margin:0;min-height:100vh;background:#fff;color:#1d1d1f;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif}.nav{height:44px;background:#000;color:#fff}.nav-inner,.main-inner,.footer-inner{width:min(980px,calc(100% - 48px));margin:0 auto}.nav-inner{display:flex;height:44px;align-items:center;justify-content:space-between;font-size:12px}.brand{font-weight:600}.label{color:#ccc}.hero{text-align:center}.main-inner{padding:88px 0 72px}.badge{display:inline-flex;padding:6px 12px;border-radius:999px;background:#f5f5f7;color:#6e6e73;font-size:13px;font-weight:600}h1{margin:20px 0 0;font-size:52px;line-height:1.08;letter-spacing:-.02em}.lead{max-width:680px;margin:18px auto 0;color:#6e6e73;font-size:21px;line-height:1.5}.actions{display:flex;justify-content:center;gap:12px;margin-top:32px}.button{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:11px 22px;border:1px solid #0066cc;border-radius:999px;color:#0066cc;font-size:17px;text-decoration:none}.button.primary{background:#0066cc;color:#fff}.features{background:#f5f5f7}.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;width:min(980px,calc(100% - 48px));margin:0 auto;padding:56px 0}.feature{padding:28px;background:#fff;text-align:center}.feature span{display:block;color:#6e6e73;font-size:14px}.feature strong{display:block;margin-top:8px;font-size:18px}footer{background:#f5f5f7}.footer-inner{padding:24px 0 40px;border-top:1px solid #ddd;color:#6e6e73;font-size:12px;text-align:center}@media(max-width:640px){.nav-inner,.main-inner,.footer-inner,.feature-grid{width:calc(100% - 32px)}.main-inner{padding:64px 0 52px}h1{font-size:40px}.lead{font-size:19px}.actions{align-items:stretch;flex-direction:column}.button{width:100%}.feature-grid{grid-template-columns:1fr}.feature{text-align:left}}
  </style>
</head>
<body>
  <header class="nav"><div class="nav-inner"><span class="brand">FastGit</span><span class="label">非官方 GitHub 镜像</span></div></header>
  <main>
    <section class="hero"><div class="main-inner"><span class="badge">HTTP 403</span><h1>登录未开放</h1><p class="lead">当前镜像未开启 GitHub 登录功能。你仍然可以浏览公开仓库、下载公开文件并使用 Git Clone 或 Fetch。</p><nav class="actions" aria-label="页面操作"><a class="button primary" href="/">返回首页</a><a class="button" href="/__fastgit/healthy">服务状态</a></nav></div></section>
    <section class="features"><div class="feature-grid"><div class="feature"><span>公开仓库</span><strong>可以访问</strong></div><div class="feature"><span>公开下载与 Clone</span><strong>可以使用</strong></div><div class="feature"><span>登录与 Push</span><strong>当前关闭</strong></div></div></section>
  </main>
  <footer><div class="footer-inner">FastGit 登录状态</div></footer>
</body>
</html>`;
}

async function createHealthResponse(loginEnabled, sourceRepository) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  let upstreamStatus = null;
  let commitVersion = "unknown";
  let healthy = false;

  try {
    const [upstreamResult, commitResult] = await Promise.allSettled([
      fetch("https://github.com/", {
        method: "HEAD",
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": "FastGit-Health-Check" },
      }),
      fetch(`https://api.github.com/repos/${sourceRepository}/commits/main`, {
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "FastGit-Health-Check",
        },
      }),
    ]);

    if (upstreamResult.status === "fulfilled") {
      upstreamStatus = upstreamResult.value.status;
      healthy = upstreamStatus >= 200 && upstreamStatus < 400;
    }

    if (commitResult.status === "fulfilled" && commitResult.value.ok) {
      try {
        const commit = await commitResult.value.json();
        if (typeof commit.sha === "string") commitVersion = commit.sha.slice(0, 7);
      } catch {
        commitVersion = "unknown";
      }
    }
  } catch {
    healthy = false;
  } finally {
    clearTimeout(timeout);
  }

  const duration = Date.now() - startedAt;
  const checkedAt = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  return new Response(renderHealthPage({
    healthy,
    upstreamStatus,
    duration,
    checkedAt,
    loginEnabled,
    commitVersion,
  }), {
    status: healthy ? 200 : 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      "X-FastGit-Commit": commitVersion,
      "X-FastGit-Route": "local",
    },
  });
}

function renderHealthPage({ healthy, upstreamStatus, duration, checkedAt, loginEnabled, commitVersion }) {
  const stateClass = healthy ? "healthy" : "unhealthy";
  const stateTitle = healthy ? "OK" : "暂不可用";
  const kicker = healthy ? "所有系统运行正常" : "检测到服务异常";
  const description = healthy
    ? "FastGit 已成功连接 GitHub 上游服务。"
    : "FastGit 暂时无法正常连接 GitHub 上游服务。";
  const upstreamText = upstreamStatus === null
    ? "连接失败"
    : `${healthy ? "正常" : "异常"}（HTTP ${upstreamStatus}）`;
  const commitText = commitVersion === "unknown" ? "无法获取" : commitVersion;

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>FastGit 服务状态</title>
  <style>
    *{box-sizing:border-box}
    html{background:#f5f5f7}
    body{margin:0;min-height:100vh;background:#fff;color:#1d1d1f;font-family:"SF Pro Text",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif;letter-spacing:0}
    .global-nav{height:44px;background:#000;color:#fff}
    .nav-inner,.subnav-inner,.hero-inner,.metrics-inner,.footer-inner{width:min(980px,calc(100% - 48px));margin:0 auto}
    .nav-inner{display:flex;height:44px;align-items:center;justify-content:space-between;font-size:12px}
    .nav-brand{font-weight:600}.nav-label{color:#ccc}
    .subnav{height:52px;background:rgba(245,245,247,.88);border-bottom:1px solid rgba(0,0,0,.08);backdrop-filter:saturate(180%) blur(20px)}
    .subnav-inner{display:flex;height:52px;align-items:center;justify-content:space-between}
    .subnav-title{font-size:21px;font-weight:600}.subnav-meta{color:#333;font-size:14px}
    .hero{background:#fff;text-align:center}
    .unhealthy .hero{background:#272729;color:#fff}
    .hero-inner{padding:80px 0 72px}
    .kicker{display:flex;align-items:center;justify-content:center;gap:8px;margin:0 0 17px;color:#333;font-size:14px;font-weight:600}
    .unhealthy .kicker{color:#ccc}
    .status-dot{width:8px;height:8px;border-radius:50%;background:#0066cc}
    h1{margin:0;font-family:"SF Pro Display",system-ui,-apple-system,sans-serif;font-size:56px;font-weight:600;line-height:1.07;letter-spacing:0}
    .lead{max-width:680px;margin:17px auto 0;color:#333;font-family:"SF Pro Display",system-ui,-apple-system,sans-serif;font-size:24px;font-weight:300;line-height:1.5;letter-spacing:0}
    .unhealthy .lead{color:#ccc}
    .actions{display:flex;justify-content:center;gap:12px;margin-top:32px}
    .button{display:inline-flex;min-height:44px;align-items:center;justify-content:center;padding:11px 22px;border:1px solid #0066cc;border-radius:9999px;color:#0066cc;font-size:17px;text-decoration:none;transition:transform .15s ease,background-color .15s ease}
    .button.primary{background:#0066cc;color:#fff}
    .button:active{transform:scale(.95)}
    .button:focus-visible{outline:2px solid #0071e3;outline-offset:3px}
    .unhealthy .button:not(.primary){color:#2997ff;border-color:#2997ff}
    .metrics{background:#f5f5f7}
    .metrics-inner{padding:64px 0}
    h2{margin:0 0 32px;font-family:"SF Pro Display",system-ui,-apple-system,sans-serif;font-size:34px;font-weight:600;line-height:1.47;letter-spacing:0;text-align:center}
    dl{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin:0;border-top:1px solid #e0e0e0}
    .metric{min-width:0;padding:24px 20px;border-bottom:1px solid #e0e0e0;text-align:center}
    dt{margin-bottom:8px;color:#7a7a7a;font-size:14px;line-height:1.43}
    dd{margin:0;color:#1d1d1f;font-size:17px;font-weight:600;line-height:1.47;overflow-wrap:anywhere}
    footer{background:#f5f5f7;color:#7a7a7a}
    .footer-inner{padding:24px 0 48px;border-top:1px solid #e0e0e0;font-size:12px;text-align:center}
    @media(max-width:640px){.nav-inner,.subnav-inner,.hero-inner,.metrics-inner,.footer-inner{width:min(100% - 32px,980px)}.hero-inner{padding:64px 0 56px}h1{font-size:40px}.lead{font-size:21px;line-height:1.4}.actions{align-items:stretch;flex-direction:column}.button{width:100%}dl{grid-template-columns:1fr}.metric{text-align:left;padding:20px 0}h2{font-size:28px;text-align:left}.metrics-inner{padding:48px 0}}
  </style>
</head>
<body class="${stateClass}">
  <header class="global-nav"><div class="nav-inner"><span class="nav-brand">FastGit</span><span class="nav-label">非官方 GitHub 镜像</span></div></header>
  <div class="subnav"><div class="subnav-inner"><span class="subnav-title">服务状态</span><span class="subnav-meta">实时检查</span></div></div>
  <main>
    <section class="hero" aria-labelledby="status-title">
      <div class="hero-inner">
        <p class="kicker"><span class="status-dot" aria-hidden="true"></span>${kicker}</p>
        <h1 id="status-title">${stateTitle}</h1>
        <p class="lead">${description}</p>
        <nav class="actions" aria-label="页面操作">
          <a class="button primary" href="/__fastgit/healthy">重新检查</a>
          <a class="button" href="/">返回首页</a>
        </nav>
      </div>
    </section>
    <section class="metrics" aria-labelledby="metrics-title">
      <div class="metrics-inner">
        <h2 id="metrics-title">实时状态</h2>
        <dl>
          <div class="metric"><dt>Worker 服务</dt><dd>正常</dd></div>
          <div class="metric"><dt>GitHub 上游</dt><dd>${upstreamText}</dd></div>
          <div class="metric"><dt>提交版本</dt><dd>${commitText}</dd></div>
          <div class="metric"><dt>网页登录</dt><dd>${loginEnabled ? "已开启" : "已关闭"}</dd></div>
          <div class="metric"><dt>检查耗时</dt><dd>${duration} 毫秒</dd></div>
          <div class="metric"><dt>检查时间</dt><dd>${checkedAt}</dd></div>
        </dl>
      </div>
    </section>
  </main>
  <footer><div class="footer-inner">FastGit 服务状态</div></footer>
</body>
</html>`;
}

function upstreamNotAllowedError() {
  const error = new Error("Upstream host is not allowed");
  error.code = "UPSTREAM_NOT_ALLOWED";
  return error;
}

function getUpstreamUrl(publicUrl) {
  const embedded = getEmbeddedUpstreamUrl(publicUrl);
  if (embedded) return embedded;

  if (!publicUrl.pathname.startsWith(PROXY_PREFIX)) {
    return new URL(`https://${PRIMARY_HOST}${publicUrl.pathname}${publicUrl.search}`);
  }

  const rest = publicUrl.pathname.slice(PROXY_PREFIX.length);
  const slash = rest.indexOf("/");
  const hostname = decodeURIComponent(slash === -1 ? rest : rest.slice(0, slash)).toLowerCase();
  const pathname = slash === -1 ? "/" : rest.slice(slash);

  if (!isGithubHost(hostname)) {
    throw upstreamNotAllowedError();
  }

  return new URL(`https://${hostname}${pathname}${publicUrl.search}`);
}

// Supports the gh-proxy style "https://<mirror>/https://github.com/owner/repo".
function getEmbeddedUpstreamUrl(publicUrl) {
  const candidate = publicUrl.pathname.replace(/^\/+/, "");
  const decoded = candidate.includes("%") ? safeDecode(candidate) : candidate;
  if (!/^https?:\/\//i.test(decoded)) return null;

  let target;
  try {
    target = new URL(decoded);
  } catch {
    return null;
  }

  if (!isGithubHost(target.hostname)) {
    throw upstreamNotAllowedError();
  }

  target.protocol = "https:";
  if (publicUrl.search) target.search = publicUrl.search;
  target.hash = "";
  return target;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isGithubHost(hostname) {
  const host = hostname.toLowerCase();
  return (
    host === "github.com" ||
    host.endsWith(".github.com") ||
    host === "githubusercontent.com" ||
    host.endsWith(".githubusercontent.com") ||
    host === "githubassets.com" ||
    host.endsWith(".githubassets.com")
  );
}

function isLoginPath(pathname) {
  return /^\/(?:login|session|sessions|signup|password_reset)(?:\/|$)/.test(pathname);
}

// Country metadata can be absent in previews or behind another proxy.
// Keep unknown visitors on the mirror and expose the decision for diagnosis.
function getRoutingInfo(request, proxyCountries) {
  const candidates = [
    ["request.cf.country", request.cf?.country],
    ["cf-ipcountry", request.headers.get("cf-ipcountry")],
    ["ali-ip-country", request.headers.get("ali-ip-country")],
    ["x-client-country", request.headers.get("x-client-country")],
  ];
  let country = "UNKNOWN";
  let countrySource = "none";
  for (const [source, value] of candidates) {
    const candidate = String(value ?? "").trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(candidate) || candidate === "XX") continue;
    country = candidate;
    countrySource = source;
    break;
  }

  let route = "proxy";
  let reason = "country-proxied";
  if (!proxyCountries) reason = "split-disabled";
  else if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") reason = "websocket";
  else if (country === "UNKNOWN") reason = "country-unknown";
  else if (!proxyCountries.has(country)) {
    route = "direct";
    reason = "country-not-proxied";
  }
  return { country, countrySource, proxyCountries: proxyCountries ? [...proxyCountries] : ["*"], route, reason };
}

function withRoutingHeaders(response, routing) {
  if (response.status === 101) return response;
  response.headers.set("X-FastGit-Country", routing.country);
  response.headers.set("X-FastGit-Proxy-Countries", routing.proxyCountries.join(","));
  if (!response.headers.has("X-FastGit-Route")) response.headers.set("X-FastGit-Route", routing.route);
  return response;
}

function createRoutingDiagnostics(routing, method) {
  return new Response(method === "HEAD" ? null : JSON.stringify(routing, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-FastGit-Route": "local",
    },
  });
}

function createCanonicalRedirect(publicUrl, upstreamUrl) {
  const canonicalUrl = new URL(publicUrl.origin);
  canonicalUrl.pathname = upstreamUrl.hostname === PRIMARY_HOST
    ? upstreamUrl.pathname
    : `${PROXY_PREFIX}${upstreamUrl.hostname}${upstreamUrl.pathname}`;
  canonicalUrl.search = upstreamUrl.search;
  return new Response(null, {
    status: 302,
    headers: {
      Location: canonicalUrl.toString(),
      "Cache-Control": "no-store",
    },
  });
}

function createDirectRedirect(upstreamUrl, method) {
  const status = method === "GET" || method === "HEAD" ? 302 : 307;
  return new Response(null, {
    status,
    headers: {
      Location: upstreamUrl.toString(),
      "Cache-Control": "no-store",
      "X-FastGit-Direct": "redirect",
    },
  });
}

async function buildResponse(upstreamResponse, publicUrl, upstreamUrl, method) {
  const headers = new Headers(upstreamResponse.headers);

  for (const headerName of ["Location", "Content-Location", "Link", "Refresh", "Access-Control-Allow-Origin"]) {
    const value = headers.get(headerName);
    if (value) headers.set(headerName, rewriteText(value, publicUrl));
  }

  rewriteCookies(upstreamResponse.headers, headers, upstreamUrl.hostname);

  for (const headerName of ["Content-Security-Policy", "Content-Security-Policy-Report-Only"]) {
    const value = headers.get(headerName);
    if (value) headers.set(headerName, rewriteContentSecurityPolicy(value, publicUrl));
  }
  headers.delete("Report-To");
  headers.delete("NEL");
  if (method === "HEAD" || [204, 205, 304].includes(upstreamResponse.status)) {
    headers.delete("Content-Length");
    headers.delete("Content-Encoding");
    return new Response(null, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  }

  const contentType = (headers.get("Content-Type") || "").toLowerCase();
  const rewriteBody = [
    "text/html",
    "text/css",
    "javascript",
    "application/json",
    "application/manifest+json",
    "image/svg+xml",
  ].some((type) => contentType.includes(type));

  if (!rewriteBody) {
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  }

  const originalBody = await upstreamResponse.text();
  const body = rewriteText(originalBody, publicUrl);
  if (contentType.includes("text/html")) {
    await rewriteInlineScriptHashes(originalBody, headers, publicUrl);
  }
  headers.delete("Content-Length");
  headers.delete("Content-Encoding");
  headers.delete("ETag");

  return new Response(body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}

function rewriteText(input, publicUrl) {
  let output = input;
  const origin = publicUrl.origin;
  const wsOrigin = `wss://${publicUrl.host}`;

  for (const host of REWRITTEN_HOSTS) {
    const path = `${PROXY_PREFIX}${host}`;
    output = output.replaceAll(`https://${host}`, `${origin}${path}`);
    output = output.replaceAll(`http://${host}`, `${origin}${path}`);
    output = output.replaceAll(`wss://${host}`, `${wsOrigin}${path}`);
    output = output.replaceAll(`https:\\/\\/${host}`, `${origin}${path}`.replaceAll("/", "\\/"));
  }

  output = output.replaceAll("https://github.com", origin);
  output = output.replaceAll("http://github.com", origin);
  output = output.replaceAll("https:\\/\\/github.com", origin.replaceAll("/", "\\/"));
  return output;
}

// URL rewriting changes inline import maps and scripts. Keep their existing CSP
// authorizations valid without allowing any additional inline script content.
async function rewriteInlineScriptHashes(html, headers, publicUrl) {
  const headerNames = ["Content-Security-Policy", "Content-Security-Policy-Report-Only"];
  const scriptDirectives = new Set(["default-src", "script-src", "script-src-elem"]);
  const authorizedHashes = new Set();
  const algorithms = new Set();

  for (const headerName of headerNames) {
    for (const directive of (headers.get(headerName) || "").split(";")) {
      const [name, ...sources] = directive.trim().split(/\s+/);
      if (!scriptDirectives.has(name.toLowerCase())) continue;
      for (const source of sources) {
        const match = /^'sha(256|384|512)-[A-Za-z0-9+/]+={0,2}'$/.exec(source);
        if (!match) continue;
        authorizedHashes.add(source);
        algorithms.add(match[1]);
      }
    }
  }
  if (authorizedHashes.size === 0) return;

  const replacements = new Map();
  const scripts = /<script\b(?:[^"'<>]|"[^"]*"|'[^']*')*>([\s\S]*?)<\/script\s*>/gi;
  for (const match of html.matchAll(scripts)) {
    // HTML parsing normalizes line endings before the browser checks CSP hashes.
    const original = match[1].replace(/\r\n?/g, "\n");
    const rewritten = rewriteText(original, publicUrl);
    if (original === rewritten) continue;

    for (const algorithm of algorithms) {
      const originalHash = await hashInlineScript(original, algorithm);
      if (!authorizedHashes.has(originalHash)) continue;
      replacements.set(originalHash, await hashInlineScript(rewritten, algorithm));
    }
  }
  if (replacements.size === 0) return;

  for (const headerName of headerNames) {
    const policy = headers.get(headerName);
    if (!policy) continue;
    headers.set(headerName, policy.split(";").map((directive) => {
      const name = directive.trim().split(/\s+/, 1)[0].toLowerCase();
      if (!scriptDirectives.has(name)) return directive;
      return directive.replace(/'sha(?:256|384|512)-[A-Za-z0-9+/]+={0,2}'/g,
        (source) => replacements.get(source) || source);
    }).join(";"));
  }
}

async function hashInlineScript(text, algorithm) {
  const digest = await crypto.subtle.digest(`SHA-${algorithm}`, new TextEncoder().encode(text));
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return `'sha${algorithm}-${base64}'`;
}

function rewriteContentSecurityPolicy(policy, publicUrl) {
  return policy
    .split(";")
    .map((directive) => {
      const tokens = directive.trim().split(/\s+/).filter(Boolean);
      if (publicUrl.protocol === "http:" && tokens[0]?.toLowerCase() === "upgrade-insecure-requests") {
        return "";
      }
      if (tokens.length < 2) return directive.trim();

      const sources = tokens.slice(1);
      const containsGithubSource = sources.some((source) => {
        const withoutScheme = source.replace(/^(?:https?|wss?):\/\//i, "");
        const hostname = withoutScheme.split("/", 1)[0].replace(/^\*\./, "");
        return isGithubHost(hostname);
      });

      if (containsGithubSource && !sources.includes("'self'")) sources.unshift("'self'");
      return [tokens[0], ...new Set(sources)].join(" ");
    })
    .filter(Boolean)
    .join("; ");
}

function rewriteCookies(sourceHeaders, targetHeaders, upstreamHost) {
  targetHeaders.delete("Set-Cookie");
  if (upstreamHost !== PRIMARY_HOST) return;

  for (const cookie of getSetCookieValues(sourceHeaders)) {
    targetHeaders.append("Set-Cookie", rewriteSetCookie(cookie));
  }
}

function getSetCookieValues(headers) {
  if (typeof headers.getSetCookie === "function") {
    const cookies = headers.getSetCookie();
    if (Array.isArray(cookies) && cookies.length > 0) return cookies;
  }

  const combined = headers.get("Set-Cookie");
  if (!combined) return [];

  return combined
    .split(/,(?=\s*[!#$%&'*+\-.^_`|~0-9A-Za-z]+=)/g)
    .map((cookie) => cookie.trim())
    .filter(Boolean);
}

function rewriteSetCookie(cookie) {
  const parts = cookie.split(";");
  const cookiePair = parts.shift()?.trim();
  if (!cookiePair) return cookie;

  const attributes = parts
    .map((attribute) => attribute.trim())
    .filter((attribute) => attribute && !/^Domain\s*=/i.test(attribute));

  return [cookiePair, ...attributes].join("; ");
}
