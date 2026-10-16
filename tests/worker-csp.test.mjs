import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const origin = "https://mirror.example";
const assetOrigin = "https://github.githubassets.com";
const rewrittenAssetOrigin = `${origin}/_proxy/github.githubassets.com`;
const hash = (text, algorithm = "sha256") =>
  `'${algorithm}-${createHash(algorithm).update(text).digest("base64")}'`;
const importmap = JSON.stringify({ imports: { react: `${assetOrigin}/assets/react.js` } });
const rewrittenImportmap = importmap.replaceAll(assetOrigin, rewrittenAssetOrigin);

for (const filename of ["worker-cloudflare.js", "worker-esa.js"]) {
  const source = await readFile(new URL(`../${filename}`, import.meta.url), "utf8");
  const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

  async function proxy(t, body, headers, method = "GET") {
    t.mock.method(globalThis, "fetch", async (url) => {
      assert.equal(url, "https://github.com/owner/repo");
      return new Response(body, { headers });
    });
    return worker.fetch(new Request(`${origin}/owner/repo`, { method }), { CACHE_TTL: "0" });
  }

  await test(`${filename}: rewritten importmap retains its CSP authorization`, async (t) => {
    const csp = `default-src 'none'; script-src ${assetOrigin} ${hash(importmap)}; object-src 'none'`;
    const response = await proxy(t,
      `<script type="importmap">${importmap}</script><script type="module" src="${assetOrigin}/assets/app.js"></script>`,
      { "Content-Type": "text/html", "Content-Security-Policy": csp, ETag: '"upstream"' });
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.ok(body.includes(rewrittenImportmap));
    assert.ok(body.includes(`${rewrittenAssetOrigin}/assets/app.js`));
    const policy = response.headers.get("Content-Security-Policy");
    assert.ok(policy.includes(hash(rewrittenImportmap)));
    assert.ok(!policy.includes(hash(importmap)));
    assert.ok(policy.includes("script-src 'self'"));
    assert.ok(policy.includes("object-src 'none'"));
    assert.ok(!policy.includes("'unsafe-inline'"));
    assert.equal(response.headers.get("ETag"), null);
  });

  await test(`${filename}: SHA-384/512, report-only, and HTML line endings`, async (t) => {
    const inline = '\nconst url = "https://github.com/owner/repo";\n';
    const rewritten = inline.replaceAll("https://github.com", origin);
    const unchanged = 'console.log("unchanged")';
    const body = `<script data-example="a>b">${inline.replaceAll("\n", "\r\n")}</script>` +
      `<script>${unchanged}</script>`;
    const response = await proxy(t, body, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": `default-src ${hash(inline, "sha384")} ${hash(unchanged)}; style-src ${hash(inline, "sha384")}`,
      "Content-Security-Policy-Report-Only": `script-src-elem ${hash(inline, "sha512")}`,
    });
    const policy = response.headers.get("Content-Security-Policy");
    assert.ok(policy.includes(`default-src ${hash(rewritten, "sha384")} ${hash(unchanged)}`));
    assert.ok(policy.includes(`style-src ${hash(inline, "sha384")}`));
    assert.equal(response.headers.get("Content-Security-Policy-Report-Only"),
      `script-src-elem ${hash(rewritten, "sha512")}`);
  });

  await test(`${filename}: changed scripts without authorization stay blocked`, async (t) => {
    const allowed = 'console.log("allowed")';
    const csp = `script-src ${hash(allowed)}; style-src ${hash(importmap)}`;
    const response = await proxy(t, `<script type='importmap'>${importmap}</script>`,
      { "Content-Type": "text/html", "Content-Security-Policy": csp });
    assert.equal(response.headers.get("Content-Security-Policy"), csp);
    assert.ok((await response.text()).includes(rewrittenImportmap));
  });

  await test(`${filename}: no hashes, non-HTML, and HEAD keep existing behavior`, async (t) => {
    await t.test("nonce-only policy", async (t) => {
      const csp = "script-src 'nonce-example'";
      const response = await proxy(t, `<script nonce="example">${importmap}</script>`,
        { "Content-Type": "text/html", "Content-Security-Policy": csp });
      assert.equal(response.headers.get("Content-Security-Policy"), csp);
      assert.ok((await response.text()).includes(rewrittenImportmap));
    });
    await t.test("JSON response", async (t) => {
      const csp = `script-src ${hash(importmap)}`;
      const response = await proxy(t, importmap,
        { "Content-Type": "application/json", "Content-Security-Policy": csp });
      assert.equal(await response.text(), rewrittenImportmap);
      assert.equal(response.headers.get("Content-Security-Policy"), csp);
    });
    await t.test("HEAD response", async (t) => {
      const response = await proxy(t, null, { "Content-Type": "text/html" }, "HEAD");
      assert.equal(response.status, 200);
      assert.equal(await response.text(), "");
    });
  });
}
