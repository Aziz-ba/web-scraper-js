const { JSDOM } = require("jsdom");

/**
 * A small, reusable web scraper with retries and timeouts.
 *
 *   const data = await new Scraper({ url, processData, retries, timeout }).run();
 *
 * `processData` receives a parsed object (JSON responses) or a JSDOM instance
 * (HTML responses — use `dom.window.document`).
 */
class Scraper {
  constructor({ url, processData, retries = 3, timeout = 10000, headers = {} }) {
    if (!url) throw new Error("Scraper: `url` is required");
    if (typeof processData !== "function") throw new Error("Scraper: `processData` must be a function");
    Object.assign(this, { url, processData, retries, timeout, headers });
  }

  async _fetch() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      return await fetch(this.url, {
        signal: controller.signal,
        headers: { "User-Agent": "web-scraper-js", ...this.headers },
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async run() {
    let lastErr;
    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const res = await this._fetch();
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const type = res.headers.get("content-type") || "";
        let data;
        if (type.includes("application/json")) data = await res.json();
        else if (type.includes("text/html")) data = new JSDOM(await res.text());
        else data = await res.text();
        return this.processData(data);
      } catch (err) {
        lastErr = err;
        if (attempt < this.retries) {
          const backoff = 300 * 2 ** (attempt - 1); // 300ms, 600ms, ...
          await new Promise((r) => setTimeout(r, backoff));
        }
      }
    }
    throw new Error(`Scrape failed after ${this.retries} attempts: ${lastErr.message}`);
  }
}

module.exports = Scraper;
