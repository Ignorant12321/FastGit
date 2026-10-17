/* ==========================================================================
   FastGit — 加速地址生成逻辑
   规则：https://<所选节点>/ + 原始 GitHub 地址，回车直接在新标签页打开
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------------------ 常量 */

  // 默认节点用「当前域名」推导：把首页部署到镜像域名后，默认就走本站加速，
  // 换成任何自定义域名都通用。file:// 或本地预览时回退到公共节点。
  const FALLBACK_HOST = 'gh-proxy.com';
  const SELF_HOST = (() => {
    try {
      const loc = window.location;
      if (!loc || !/^https?:$/.test(loc.protocol)) return '';
      const host = String(loc.host || '').toLowerCase();
      if (!host) return '';
      if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(host)) return '';
      return host;
    } catch (_) { return ''; }
  })();

  const DEFAULT_NODES = [];
  if (SELF_HOST) DEFAULT_NODES.push({ host: SELF_HOST, note: '默认' });
  if (!DEFAULT_NODES.some((n) => n.host === FALLBACK_HOST)) {
    DEFAULT_NODES.push({ host: FALLBACK_HOST, note: SELF_HOST ? '备用' : '默认' });
  }

  /* 其它已知代理前缀：粘贴到这类地址时会自动去掉，避免双重加速 */
  const OTHER_PROXIES = [
    'ghproxy.com', 'ghproxy.net', 'gh-proxy.net', 'gh.llkk.cc', 'ghfast.top',
    'github.moeyy.xyz', 'ghps.cc', 'hub.fastgit.xyz', 'fastgit.org',
    'gh-proxy.com', 'fastgit.ignrt.shop',
    SELF_HOST,
  ].filter(Boolean);

  const NODE_KEY = 'fastgit.node.v2';
  const CUSTOM_KEY = 'fastgit.nodes.v2';
  const STORE_KEY = 'fastgit.history.v2';
  const THEME_KEY = 'fastgit.theme';
  const MAX_HISTORY = 8;

  /* 节点下拉面板：贴合视口用的间距常量 */
  const POP_GAP = 8;      // 与 CSS 里 top: calc(100% + 8px) 对应
  const POP_EDGE = 12;    // 距视口边缘留白
  const POP_CHROME = 104; // 面板固定部分：内边距 + 标题 + 添加行
  const POP_ROW = 42;     // 列表每行大约高度

  const ICON_COPY  = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const ICON_ALERT = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>';
  const ICON_OUT   = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6m-11 5L21 3m-3 10v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';

  const $ = (sel, root = document) => root.querySelector(sel);

  const el = {
    form:     $('#form'),
    field:    $('#field'),
    fieldWrap: $('.field-wrap'),
    input:    $('#url'),
    ghost:    $('#ghost'),
    clear:    $('#clear'),
    go:       $('#go'),
    error:    $('#error'),
    kbdMod:   $('#kbdMod'),
    navRecent: $('#navRecent'),
    recent:   $('#recent'),
    recentList: $('#recentList'),
    recentEmpty: $('#recentEmpty'),
    recentBack: $('#recentBack'),
    recentSub: $('#recentSub'),
    clearHistoryBtn: $('#clearHistory'),
    main:     $('main'),
    header:   $('.site-header'),
    themeToggle: $('#themeToggle'),
    toast:    $('#toast'),
    nodeBtn:  $('#nodeBtn'),
    nodeHost: $('#nodeHost'),
    nodePop:  $('#nodePop'),
    nodeList: $('#nodeList'),
    nodeAddInput: $('#nodeAddInput'),
    nodeAddBtn:   $('#nodeAddBtn'),
    navNode:      $('#navNode'),
    navNodeHost:  $('#navNodeHost'),
    brand:        $('.brand'),
  };

  // 品牌 logo 回首页：线上用根路径（地址栏不带 /index.html）；
  // 本地 file:// 直接打开时根路径会显示目录列表，这里改回 index.html。
  if (location.protocol === 'file:') el.brand.setAttribute('href', 'index.html');

  /* ------------------------------------------------------------ 主题 */

  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    store(THEME_KEY, theme);
  }

  (function initTheme() {
    const saved = read(THEME_KEY);
    applyTheme(saved === 'light' || saved === 'dark' ? saved : (prefersLight.matches ? 'light' : 'dark'));
  })();

  /* 图标缩放旋转着换成另一个 + 整页圆形扩散 */
  el.themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const btn = el.themeToggle;

    btn.classList.add('is-swapping');

    setTimeout(() => {
      const swap = () => {
        applyTheme(next);
        btn.classList.remove('is-swapping');
      };

      if (typeof document.startViewTransition !== 'function') { swap(); return; }

      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      const transition = document.startViewTransition(swap);
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 560, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => {});
    }, 230);
  });

  /* --------------------------------------------------------- 节点管理 */

  let customNodes = loadCustomNodes();
  let currentHost = read(NODE_KEY) || DEFAULT_NODES[0].host;

  function loadCustomNodes() {
    try {
      const raw = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
      return Array.isArray(raw) ? raw.filter((h) => typeof h === 'string' && isHostLike(h)) : [];
    } catch (_) { return []; }
  }

  function nodes() {
    return [
      ...DEFAULT_NODES.map((n) => ({ ...n })),
      ...customNodes.map((h) => ({ host: h, note: '自定义', custom: true })),
    ];
  }

  function isHostLike(v) {
    const h = String(v || '').trim().toLowerCase();
    return /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(h) && !h.includes('..');
  }

  function cleanHost(v) {
    return String(v || '')
      .trim().toLowerCase()
      .replace(/^[a-z]+:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/\/+$/, '');
  }

  const baseURL = (host = currentHost) => `https://${host}/`;
  const proxy = (target) => baseURL() + target;

  function allProxies() {
    return [...new Set([...OTHER_PROXIES, ...customNodes, currentHost])];
  }

  function setNode(host, { silent = false } = {}) {
    if (!host) return;
    currentHost = host;
    store(NODE_KEY, host);
    syncNodeUI();
    renderHistory();
    if (!silent) toast(`已切换到 ${host}`);
  }

  function syncNodeUI() {
    el.nodeHost.textContent = currentHost;
    el.navNodeHost.textContent = currentHost;
    el.navNode.href = baseURL();
    // 选中的节点就是本站时，右上角的外链没有意义，收起它
    el.navNode.hidden = Boolean(SELF_HOST) && currentHost === SELF_HOST;
    renderNodeList();
  }

  function renderNodeList() {
    el.nodeList.innerHTML = nodes().map((n) => `
      <li>
        <button class="node-item${n.host === currentHost ? ' is-active' : ''}" type="button"
                role="option" aria-selected="${n.host === currentHost}"
                data-host="${escapeHtml(n.host)}">
          <span class="node-dot" aria-hidden="true"></span>
          <span class="node-name">${escapeHtml(n.host)}</span>
          <span class="node-note">${escapeHtml(n.note || '')}</span>
          ${n.custom ? `<span class="node-del" data-remove="${escapeHtml(n.host)}" title="删除该节点">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </span>` : ''}
        </button>
      </li>`).join('');
  }

  function openNodePop() {
    placeNodePop();
    el.nodePop.hidden = false;
    el.nodePop.classList.remove('is-in');
    requestAnimationFrame(() => requestAnimationFrame(() => el.nodePop.classList.add('is-in')));
    el.nodeBtn.setAttribute('aria-expanded', 'true');
  }

  function closeNodePop() {
    el.nodeBtn.setAttribute('aria-expanded', 'false');
    el.nodePop.classList.remove('is-in');
    setTimeout(() => { el.nodePop.hidden = true; }, 200);
  }

  const nodePopOpen = () => !el.nodePop.hidden && el.nodePop.classList.contains('is-in');

  /** 把面板限制在当前视口内：下方不够就翻到上方，绝不把页面撑高 */
  function placeNodePop() {
    const wrap = el.fieldWrap.getBoundingClientRect();
    const vh = document.documentElement.clientHeight;
    const below = vh - wrap.bottom - POP_GAP - POP_EDGE;
    const above = wrap.top - POP_GAP - POP_EDGE;

    // 面板「自然高度」≈ 固定部分（标题+添加行+内边距）+ 可见行数 × 行高
    const rows = Math.min(el.nodeList.children.length, 7);
    const need = POP_CHROME + rows * POP_ROW;
    const up = below < Math.min(need, 300) && above > below;

    el.nodePop.classList.toggle('is-up', up);
    el.nodePop.style.setProperty('--pop-avail', Math.max(132, Math.min(up ? above : below, 560)) + 'px');
  }

  el.nodeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nodePopOpen() ? closeNodePop() : openNodePop();
  });

  el.nodeList.addEventListener('click', (e) => {
    const del = e.target.closest('[data-remove]');
    if (del) {
      e.stopPropagation();
      const host = del.dataset.remove;
      customNodes = customNodes.filter((h) => h !== host);
      store(CUSTOM_KEY, JSON.stringify(customNodes));
      if (currentHost === host) setNode(DEFAULT_NODES[0].host, { silent: true });
      renderNodeList();
      toast(`已移除 ${host}`);
      return;
    }
    const item = e.target.closest('.node-item');
    if (!item) return;
    setNode(item.dataset.host);
    closeNodePop();
  });

  function addCustomNode() {
    const host = cleanHost(el.nodeAddInput.value);
    if (!isHostLike(host)) {
      toast('节点格式不正确，例如 gh-proxy.com', true);
      el.nodeAddInput.focus();
      return;
    }
    if (!nodes().some((n) => n.host === host)) {
      customNodes.push(host);
      store(CUSTOM_KEY, JSON.stringify(customNodes));
    }
    el.nodeAddInput.value = '';
    setNode(host);
    closeNodePop();
  }

  el.nodeAddBtn.addEventListener('click', addCustomNode);
  el.nodeAddInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); addCustomNode(); }
  });

  document.addEventListener('click', (e) => {
    if (!nodePopOpen()) return;
    if (el.nodePop.contains(e.target) || el.nodeBtn.contains(e.target)) return;
    closeNodePop();
  });

  // 窗口尺寸变化时重新贴合视口（面板开着才需要）
  window.addEventListener('resize', () => {
    if (!el.nodePop.hidden) placeNodePop();
    syncHeaderVar();
  });

  /* ------------------------------------------------- 输入框光标提示动画 */

  const SAMPLES = [
    'https://github.com/torvalds/linux',
    'https://github.com/microsoft/vscode/releases/latest',
    'https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore',
  ];

  const ghostHint = { text: '', typed: 0, sample: 0, timer: null, focused: false };

  function renderGhost() {
    const show = !el.input.value && !ghostHint.focused;
    // 隐藏时用淡出，而不是瞬间清空，避免聚焦「闪一下」
    if (show) el.ghost.innerHTML = escapeHtml(ghostHint.text) + '<span class="caret" aria-hidden="true"></span>';
    el.ghost.classList.toggle('is-hidden', !show);
  }

  function tickGhost() {
    if (el.input.value || ghostHint.focused) return;
    const full = SAMPLES[ghostHint.sample % SAMPLES.length];
    if (ghostHint.typed <= full.length) {
      ghostHint.typed += 1;
      ghostHint.text = full.slice(0, ghostHint.typed);
      renderGhost();
      ghostHint.timer = setTimeout(tickGhost, 26 + Math.random() * 34);
    } else {
      ghostHint.timer = setTimeout(() => {
        ghostHint.sample += 1;
        ghostHint.typed = 0;
        ghostHint.text = '';
        renderGhost();
        tickGhost();
      }, 1900);
    }
  }

  function startGhost() {
    stopGhost();
    ghostHint.timer = setTimeout(tickGhost, 500);
  }
  function stopGhost() {
    clearTimeout(ghostHint.timer);
    ghostHint.timer = null;
  }

  el.input.addEventListener('focus', () => {
    ghostHint.focused = true;
    stopGhost();
    renderGhost();
  });
  el.input.addEventListener('blur', () => {
    ghostHint.focused = false;
    renderGhost();
    if (!el.input.value && !ghostHint.timer) startGhost();
  });

  startGhost();

  /* --------------------------------------------------------- 地址解析 */

  /** 去掉已有代理前缀、补全协议，得到干净的 GitHub 原始地址 */
  function normalize(raw) {
    let v = String(raw || '').trim();
    if (!v) return { ok: false, reason: 'empty' };

    const proxyRe = new RegExp('^https?://(?:' + allProxies().map(escapeRe).join('|') + ')/+', 'i');
    while (proxyRe.test(v)) v = v.replace(proxyRe, '');
    v = v.replace(/^\/+/, '').trim();

    if (/^(www\.)?github\.com\//i.test(v)) v = 'https://' + v.replace(/^www\./i, '');
    else if (/^(github\.com|gist\.github\.com)$/i.test(v)) v = 'https://' + v;
    else if (/^(?:raw\.githubusercontent\.com|codeload\.github\.com|gist\.githubusercontent\.com|objects\.githubusercontent\.com)\//i.test(v)) {
      v = 'https://' + v;
    }

    if (!/^https?:\/\//i.test(v)) return { ok: false, reason: 'scheme' };

    let url;
    try { url = new URL(v); } catch (_) { return { ok: false, reason: 'invalid' }; }

    const host = url.hostname.toLowerCase();
    const allowed =
      host === 'github.com' || host === 'www.github.com' || host === 'gist.github.com' ||
      host.endsWith('.githubusercontent.com') || host === 'codeload.github.com';

    if (!allowed) return { ok: false, reason: 'host', host };

    url.hostname = host.replace(/^www\./, '');
    url.hash = '';
    return { ok: true, url: url.toString() };
  }

  /** 判断链接类型 + 可派生的素材（ZIP / Raw） */
  function inspect(u) {
    const s = u.toString();
    const host = u.hostname.toLowerCase();
    const parts = u.pathname.split('/').filter(Boolean);

    if (host === 'gist.github.com') return { kind: 'Gist', raw: rawFromGist(u) };
    if (host !== 'github.com') return { kind: 'Raw 文件' };

    if (/\/releases\/download\//.test(s)) return { kind: 'Release 文件' };
    if (/\/releases\/latest\/?$/.test(s)) return { kind: '最新 Release' };
    if (/\/releases\/tag\//.test(s)) return { kind: 'Release 标签' };
    if (/\/releases\/?$/.test(s)) return { kind: 'Release 列表' };
    if (/\/archive\//.test(s)) return { kind: '源码压缩包' };
    if (/\.git\/?$/.test(s)) return { kind: 'Git Clone' };

    if (/\/blob\//.test(s)) {
      // github.com/u/r/blob/branch/path → raw.githubusercontent.com/u/r/branch/path
      const m = u.pathname.match(/^\/([^/]+)\/([^/]+)\/blob\/(.+)$/);
      const raw = m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}${u.search}` : null;
      return { kind: '文件页面', raw };
    }

    if (/\/tree\//.test(s)) return { kind: '目录' };
    if (parts.length === 2) {
      return { kind: '仓库页面', zip: `https://github.com/${parts[0]}/${parts[1]}/archive/HEAD.zip` };
    }
    if (parts.length === 1) return { kind: '用户主页' };
    return { kind: 'GitHub 页面' };
  }

  function rawFromGist(u) {
    const m = u.pathname.match(/^\/([^/]+)\/([a-f0-9]+)(?:\/(.*))?$/i);
    if (!m) return null;
    const tail = m[3] ? `/raw/${m[3]}` : '/raw';
    return `https://gist.githubusercontent.com/${m[1]}/${m[2]}${tail}`;
  }

  /* ------------------------------------------------------------ 主流程 */

  function showError(message) {
    el.error.textContent = message;
    el.error.hidden = false;
    /* 报错期间保持红色：边框与聚焦光晕一起变红，直到 clearError 才恢复 */
    el.field.classList.remove('is-error');
    void el.field.offsetWidth; /* 强制重排，让连续报错也能重播抖动动画 */
    el.field.classList.add('is-error');
  }

  function clearError() {
    el.field.classList.remove('is-error');
    el.error.hidden = true;
    el.error.textContent = '';
  }

  /** 加速 = 直接在新标签页打开拼接后的地址 */
  function submit(value) {
    const source = value ?? el.input.value;
    const res = normalize(source);

    if (!res.ok) {
      const messages = {
        empty: '先粘贴一条 GitHub 链接吧！',
        scheme: '无法识别的地址，请以 github.com/… 或 https:// 开头。',
        invalid: '这个地址看起来不太对，请检查后重试。',
        host: `只支持 GitHub 域名，当前是 ${res.host || '未知域名'}。`,
      };
      showError(messages[res.reason] || '链接格式不正确。');
      return;
    }

    clearError();
    const origin = res.url;
    const info = inspect(new URL(origin));
    const acc = proxy(origin);

    if (el.input.value !== source) el.input.value = source;
    el.clear.hidden = false;
    pushHistory(origin);

    // 注意：window.open(..., 'noopener') 永远返回 null，会导致每次都误判为「被拦截」
    // 从而去调剪贴板（浏览器就会弹权限）。这里保留句柄来判断，再手动切断 opener。
    const win = window.open(acc, '_blank');
    if (win) {
      try { win.opener = null; } catch (_) { /* 跨域时忽略 */ }
      toast(`已在新标签页打开 · ${info.kind}`);
    } else if (legacyCopy(acc)) {
      // 只用不触发权限提示的传统复制，绝不在这里调用 clipboard API
      toast('新标签页被拦截，加速链接已复制', true);
    } else {
      toast('新标签页被拦截，可在下方「最近使用」里复制或打开', true);
    }
  }

  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    submit();
  });

  el.input.addEventListener('input', () => {
    el.clear.hidden = !el.input.value;
    if (!el.input.value) {
      ghostHint.typed = 0;
      ghostHint.text = '';
      if (!ghostHint.timer) startGhost();
    }
    renderGhost();
    if (!el.error.hidden) clearError();
  });

  el.clear.addEventListener('click', () => {
    el.input.value = '';
    el.clear.hidden = true;
    clearError();
    ghostHint.typed = 0;
    ghostHint.text = '';
    if (!ghostHint.timer) startGhost();
    renderGhost();
    el.input.focus();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (recentPageOpen()) focusOnClose = 'input';   // 直接回首页输入框
      clearHash();
      el.input.focus();
      el.input.select();
    }
    if (e.key === 'Escape') {
      if (recentPageOpen()) { clearHash(); return; }   // 先退「最近使用」这一页
      if (nodePopOpen()) { closeNodePop(); return; }
      if (document.activeElement === el.input) el.input.blur();
    }
  });

  /* ---------------------------------------------------------- 复制/提示 */

  function setCopyState(button, done) {
    const label = button.dataset.label || '复制';
    button.classList.toggle('is-done', done);
    button.innerHTML = (done ? ICON_CHECK : ICON_COPY) + `<span>${done ? '已复制' : escapeHtml(label)}</span>`;
  }

  async function copyText(text, button) {
    const ok = await writeClipboard(text);
    if (ok) {
      if (button) {
        setCopyState(button, true);
        clearTimeout(button._copyTimer);
        button._copyTimer = setTimeout(() => setCopyState(button, false), 1600);
      }
      toast('加速链接已复制');
    } else {
      toast('复制失败，请手动选中链接', true);
    }
    return ok;
  }

  /**
   * 写剪贴板。
   * 优先用不会触发任何权限弹窗的传统方案（临时 textarea + execCommand），
   * 只有当它不可用时，才退回到 navigator.clipboard.writeText。
   */
  async function writeClipboard(text) {
    if (legacyCopy(text)) return true;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_) { /* 用户拒绝或环境不支持 */ }
    return false;
  }

  /** 传统复制：同步、不请求权限，也不会因为移出视口而滚屏 */
  function legacyCopy(text) {
    const active = document.activeElement;
    let ta = null;
    try {
      ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      return document.execCommand('copy');
    } catch (_) {
      return false;
    } finally {
      if (ta && ta.parentNode) ta.parentNode.removeChild(ta);
      // 把焦点还给原来的输入框，避免一次视觉跳动
      if (active && typeof active.focus === 'function') active.focus({ preventScroll: true });
    }
  }

  let toastTimer = null;
  function toast(message, isError = false) {
    el.toast.innerHTML = (isError ? ICON_ALERT : ICON_CHECK) + `<span>${escapeHtml(message)}</span>`;
    el.toast.style.color = isError ? 'var(--danger)' : 'var(--text)';
    el.toast.hidden = false;
    requestAnimationFrame(() => el.toast.classList.add('is-in'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.classList.remove('is-in');
      setTimeout(() => { el.toast.hidden = true; }, 320);
    }, 2400);
  }

  /* -------------------------------------------------------------- 历史 */

  let history = loadHistory();

  function loadHistory() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      return raw.filter((it) => it && typeof it.url === 'string').slice(0, MAX_HISTORY);
    } catch (_) { return []; }
  }

  function saveHistory() {
    store(STORE_KEY, JSON.stringify(history));
  }

  let flashUrl = null;   // 只给最新插入的那一条加入场动画，避免整列表重播

  function pushHistory(url) {
    history = [{ url, at: Date.now() }, ...history.filter((it) => it.url !== url)].slice(0, MAX_HISTORY);
    flashUrl = url;
    saveHistory();
    renderHistory();
  }

  function relativeTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60e3) return '刚刚';
    if (diff < 3600e3) return `${Math.floor(diff / 60e3)} 分钟前`;
    if (diff < 864e5) return `${Math.floor(diff / 3600e3)} 小时前`;
    return `${Math.floor(diff / 864e5)} 天前`;
  }

  function renderHistory() {
    // 入口常驻：没有记录时也进得去，那一页会显示空状态
    el.recentEmpty.hidden = history.length > 0;
    el.clearHistoryBtn.hidden = !history.length;

    if (!history.length) {
      el.recentList.innerHTML = '';
      el.recentSub.textContent = '';
      flashUrl = null;
      return;
    }

    el.recentSub.textContent = `共 ${history.length} 条 · 只保存在本地浏览器里`;

    el.recentList.innerHTML = history.map((item) => {
      const acc = proxy(item.url);
      const isNew = item.url === flashUrl;
      return `
        <li class="recent-item${isNew ? ' is-new' : ''}">
          <span class="r-url" title="${escapeHtml(item.url)}">${escapeHtml(item.url)}</span>
          <span class="r-time">${relativeTime(item.at)}</span>
          <button class="copy" type="button" data-copy="${escapeHtml(acc)}" data-label="复制">${ICON_COPY}<span>复制</span></button>
          <a class="r-more" href="${escapeHtml(acc)}" target="_blank" rel="noopener">打开${ICON_OUT}</a>
        </li>`;
    }).join('');

    flashUrl = null;
  }

  el.recentList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-copy]');
    if (!btn) return;
    copyText(btn.dataset.copy, btn);
  });

  el.clearHistoryBtn.addEventListener('click', () => {
    history = [];
    saveHistory();
    renderHistory();
    toast('已清空本地记录');
  });

  /* ------------------------------------ 最近使用：独立一页 + 滑入过渡 */

  function recentPageOpen() {
    return el.recent.classList.contains('is-open');
  }

  /** 页面顶部留出的高度 = 顶栏高度（这一页从顶栏下面开始，顶栏始终可用） */
  function syncHeaderVar() {
    document.documentElement.style.setProperty('--header-h', el.header.offsetHeight + 'px');
  }

  let focusOnClose = 'nav';   // 退出这一页时焦点去哪：'nav' 回导航链接，'input' 直接回输入框

  function setRecentPage(open) {
    if (open === recentPageOpen()) return;

    el.recent.classList.toggle('is-open', open);
    document.body.classList.toggle('is-recent', open);
    if (open) el.navRecent.setAttribute('aria-current', 'page');
    else el.navRecent.removeAttribute('aria-current');
    el.main.inert = open;                 // 首页在下面，别让 Tab 钻进去

    if (open) {
      el.recent.scrollTop = 0;
      if (document.activeElement === el.input) el.input.blur();
      // 下一帧再聚焦：页面刚加载就带 #recent 时，浏览器随后会把焦点收回 BODY，这里补一次
      requestAnimationFrame(() => {
        if (recentPageOpen()) el.recentBack.focus({ preventScroll: true });
      });
    } else {
      // 退出：焦点先回到触发处（或直接回输入框），再隐藏这一页
      const target = focusOnClose === 'input' ? el.input : el.navRecent;
      focusOnClose = 'nav';
      target.focus({ preventScroll: true });
      if (target === el.input) el.input.select();
    }

    // 放在焦点处理之后：别让 aria-hidden 落在还持有焦点的元素上
    el.recent.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  /** 退出「最近使用」这一页时清掉地址栏的 hash。
      收尾用 replaceState，否则 `location.hash = ''` 会在地址栏留下一个裸露的 #。
      （局部数组变量 `history` 会遮蔽全局，所以这里显式写 window.history。） */
  function clearHash() {
    if (location.href.indexOf('#') === -1) return;
    location.hash = '';   // 触发 hashchange，页面按原逻辑收起
    try { window.history.replaceState(window.history.state, '', location.pathname + location.search); } catch (_) {}
  }

  /** 地址栏 #recent 和页面状态保持同步：浏览器后退键、直接分享链接都能用 */
  function syncRecentFromHash() {
    setRecentPage(location.hash === '#recent');
  }

  el.recentBack.addEventListener('click', clearHash);

  // 已经在这一页时，再点「最近使用」就收回去（默认行为只是重复设同一个 hash，不会触发切换）
  el.navRecent.addEventListener('click', (e) => {
    if (!recentPageOpen()) return;
    e.preventDefault();
    clearHash();
  });

  window.addEventListener('hashchange', syncRecentFromHash);

  setInterval(() => { if (history.length) renderHistory(); }, 60e3);

  /* ------------------------------------------------------------ 工具函数 */

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }
  function read(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }
  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* 初始化 */
  if (!nodes().some((n) => n.host === currentHost)) currentHost = DEFAULT_NODES[0].host;
  syncNodeUI();
  renderHistory();
  syncHeaderVar();

  syncRecentFromHash();   // 直接用 #recent 打开时直接落在这一页
  if (location.hash !== '#recent') clearHash();   // 顺手清掉旧版本遗留在地址栏的裸 #

  if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) el.kbdMod.textContent = '⌘';
})();
