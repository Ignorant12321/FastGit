import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const origin = "https://mirror.example";

for (const filename of ["worker-cloudflare.js", "worker-esa.js"]) {
  const source = await readFile(new URL(`../${filename}`, import.meta.url), "utf8");
  const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

  async function invoke(t, path, { country, headers, method = "GET", body, countries } = {}) {
    const previous = { PROXY_COUNTRIES: process.env.PROXY_COUNTRIES, CACHE_TTL: process.env.CACHE_TTL };
    if (countries === undefined) delete process.env.PROXY_COUNTRIES;
    else process.env.PROXY_COUNTRIES = countries;
    process.env.CACHE_TTL = "0";
    t.after(() => {
      for (const [name, value] of Object.entries(previous)) {
        if (value === undefined) delete process.env[name];
        else process.env[name] = value;
      }
    });
    const calls = [];
    t.mock.method(globalThis, "fetch", async (url, options) => {
      calls.push({ url, method: options.method, body: options.body ? await new Response(options.body).text() : null });
      return new Response("upstream", { headers: { "Content-Type": "text/plain" } });
    });
    const request = new Request(`${origin}${path}`, { method, headers, body });
    if (country !== undefined) Object.defineProperty(request, "cf", { value: { country } });
    const response = await worker.fetch(request, { PROXY_COUNTRIES: countries, CACHE_TTL: "0" });
    return { response, calls };
  }

  await test(`${filename}: wrapped page URLs redirect to the client router's path`, async (t) => {
    for (const [path, target] of [
      ["/https://github.com/owner/repo?tab=readme&file=a%2Fb", "/owner/repo?tab=readme&file=a%2Fb"],
      ["/http://github.com/owner/repo", "/owner/repo"],
      ["/https%3A%2F%2Fgithub.com%2Fowner%2Frepo?tab=readme", "/owner/repo?tab=readme"],
      ["/https://raw.githubusercontent.com/owner/repo/main/a.txt", "/_proxy/raw.githubusercontent.com/owner/repo/main/a.txt"],
    ]) {
      await t.test(path, async (t) => {
        const { response, calls } = await invoke(t, path, { country: "CN" });
        assert.equal(response.status, 302);
        assert.equal(response.headers.get("Location"), `${origin}${target}`);
        assert.equal(response.headers.get("Cache-Control"), "no-store");
        assert.equal(response.headers.get("X-FastGit-Route"), "proxy");
        assert.equal(calls.length, 0);
      });
    }
  });

  await test(`${filename}: canonical redirect preserves HEAD and rejects unapproved hosts`, async (t) => {
    await t.test("HEAD", async (t) => {
      const { response, calls } = await invoke(t, "/https://github.com/owner/repo", { country: "CN", method: "HEAD" });
      assert.equal(response.status, 302);
      assert.equal(await response.text(), "");
      assert.equal(calls.length, 0);
    });
    await t.test("unapproved host", async (t) => {
      const { response, calls } = await invoke(t, "/https://example.com/owner/repo", { country: "CN" });
      assert.equal(response.status, 400);
      assert.equal(response.headers.get("Cache-Control"), "no-store");
      assert.equal(response.headers.get("X-FastGit-Route"), "blocked");
      assert.match(await response.text(), /Upstream host is not allowed/);
      assert.equal(response.headers.get("Location"), null);
      assert.equal(calls.length, 0);
    });
    await t.test("unapproved host in a proxy path", async (t) => {
      const { response, calls } = await invoke(t, "/_proxy/example.com/owner/repo", { country: "CN" });
      assert.equal(response.status, 400);
      assert.equal(calls.length, 0);
    });
  });

  await test(`${filename}: regular paths proxy without a redirect`, async (t) => {
    const { response, calls } = await invoke(t, "/owner/repo?tab=readme", { country: "CN" });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "upstream");
    assert.equal(calls[0].url, "https://github.com/owner/repo?tab=readme");
    assert.equal(response.headers.get("X-FastGit-Country"), "CN");
    assert.equal(response.headers.get("X-FastGit-Proxy-Countries"), "CN");
  });

  await test(`${filename}: the root path serves the landing page instead of GitHub`, async (t) => {
    for (const country of ["CN", "US"]) {
      await t.test(country, async (t) => {
        const { response, calls } = await invoke(t, "/", { country });
        assert.equal(response.status, 200);
        assert.match(response.headers.get("Content-Type"), /text\/html/);
        assert.equal(response.headers.get("X-FastGit-Route"), "local");
        assert.equal(calls.length, 0);
        assert.match(await response.text(), /<title>FastGit/);
      });
    }
  });

  await test(`${filename}: landing page assets are served locally`, async (t) => {
    for (const [path, type] of [
      ["/index.html", /text\/html/],
      ["/styles.css", /text\/css/],
      ["/app.js", /javascript/],
    ]) {
      await t.test(path, async (t) => {
        const { response, calls } = await invoke(t, path, { country: "US" });
        assert.equal(response.status, 200);
        assert.match(response.headers.get("Content-Type"), type);
        assert.equal(response.headers.get("X-FastGit-Route"), "local");
        assert.equal(calls.length, 0);
        assert.ok((await response.text()).length > 0);
      });
    }
  });

  await test(`${filename}: overseas visitors go directly to GitHub`, async (t) => {
    for (const method of ["GET", "HEAD", "POST"]) {
      await t.test(method, async (t) => {
        const { response, calls } = await invoke(t, "/https://github.com/owner/repo?tab=readme",
          { country: "US", method, body: method === "POST" ? "payload" : undefined });
        assert.equal(response.status, method === "POST" ? 307 : 302);
        assert.equal(response.headers.get("Location"), "https://github.com/owner/repo?tab=readme");
        assert.equal(response.headers.get("X-FastGit-Route"), "direct");
        assert.equal(response.headers.get("X-FastGit-Country"), "US");
        assert.equal(calls.length, 0);
      });
    }
  });

  await test(`${filename}: wrapped Git POST retains its method and body`, async (t) => {
    const { response, calls } = await invoke(t, "/https://github.com/owner/repo.git/git-upload-pack", {
      country: "CN", method: "POST", body: "git request body",
    });
    assert.equal(response.status, 200);
    assert.deepEqual(calls, [{ url: "https://github.com/owner/repo.git/git-upload-pack", method: "POST", body: "git request body" }]);
  });

  await test(`${filename}: diagnostics expose the effective rule and location source`, async (t) => {
    const cases = [
      [{ country: "US" }, "US", "request.cf.country", ["CN"], "direct", "country-not-proxied"],
      [{ country: "CN", headers: { "cf-ipcountry": "US" } }, "CN", "request.cf.country", ["CN"], "proxy", "country-proxied"],
      [{ headers: { "ali-ip-country": " hk " }, countries: "CN, HK" }, "HK", "ali-ip-country", ["CN", "HK"], "proxy", "country-proxied"],
      [{ country: "XX", headers: { "cf-ipcountry": "DE" } }, "DE", "cf-ipcountry", ["CN"], "direct", "country-not-proxied"],
      [{ headers: { "x-client-country": "US" } }, "US", "x-client-country", ["CN"], "direct", "country-not-proxied"],
      [{ country: "US", countries: "*" }, "US", "request.cf.country", ["*"], "proxy", "split-disabled"],
      [{ country: "US", countries: " " }, "US", "request.cf.country", ["CN"], "direct", "country-not-proxied"],
      [{ country: "US", countries: ",," }, "US", "request.cf.country", ["CN"], "direct", "country-not-proxied"],
      [{ country: "US", headers: { Upgrade: "websocket" } }, "US", "request.cf.country", ["CN"], "proxy", "websocket"],
      [{}, "UNKNOWN", "none", ["CN"], "proxy", "country-unknown"],
      [{ country: "T1", headers: { "cf-ipcountry": "XX" } }, "UNKNOWN", "none", ["CN"], "proxy", "country-unknown"],
    ];
    for (const [options, country, countrySource, proxyCountries, route, reason] of cases) {
      await t.test(`${countrySource}/${country}/${reason}/${options.countries ?? "default"}`, async (t) => {
        const { response, calls } = await invoke(t, "/__fastgit/diagnostics", options);
        assert.equal(response.status, 200);
        assert.equal(response.headers.get("Cache-Control"), "no-store");
        assert.equal(response.headers.get("X-FastGit-Route"), "local");
        assert.deepEqual(await response.json(), { country, countrySource, proxyCountries, route, reason });
        assert.equal(calls.length, 0);
      });
    }
  });

  await test(`${filename}: unknown countries remain proxied`, async (t) => {
    const { response, calls } = await invoke(t, "/owner/repo");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("X-FastGit-Country"), "UNKNOWN");
    assert.equal(response.headers.get("X-FastGit-Route"), "proxy");
    assert.equal(calls.length, 1);
  });

  await test(`${filename}: diagnostics HEAD is local with an empty body`, async (t) => {
    const { response, calls } = await invoke(t, "/__fastgit/diagnostics", { country: "US", method: "HEAD" });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), "");
    assert.equal(calls.length, 0);
  });

  await test(`${filename}: local health and login responses retain their policies`, async (t) => {
    await t.test("health", async (t) => {
      const { response, calls } = await invoke(t, "/__fastgit/healthy", { country: "US" });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("X-FastGit-Route"), "local");
      assert.equal(calls.length, 2);
    });
    await t.test("/healthy is no longer shadowed", async (t) => {
      const { response, calls } = await invoke(t, "/healthy", { country: "CN" });
      assert.equal(response.status, 200);
      assert.equal(calls.length, 1);
      assert.equal(calls[0].url, "https://github.com/healthy");
    });
    await t.test("disabled login", async (t) => {
      const { response, calls } = await invoke(t, "/https://github.com/login", { country: "US" });
      assert.equal(response.status, 403);
      assert.equal(response.headers.get("X-FastGit-Route"), "blocked");
      assert.equal(calls.length, 0);
    });
  });
}
