const { JSDOM } = require("jsdom");

/**
 * A small, reusable web scraper.
 *
 *   new Scraper({ url, processData }).run()
 *
 * It fetches `url`, and depending on the response content-type hands your
 * `processData` callback either:
 *   - a parsed object (for application/json), or
 *   - a JSDOM instance (for text/html) — use `dom.window.document`.
 *
 * Uses the built-in fetch (Node 18+), so redirects and gzip/br are handled.
 */
class Scraper {
  constructor({ url, processData }) {
    if (!url) throw new Error("Scraper: `url` is required");
    if (typeof processData !== "function") throw new Error("Scraper: `processData` must be a function");
    this.url = url;
    this.processData = processData;
  }

  async run() {
    const res = await fetch(this.url, { headers: { "User-Agent": "web-scraper-js" } });
    if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

    const type = res.headers.get("content-type") || "";
    let data;
    if (type.includes("application/json")) {
      data = await res.json();
    } else if (type.includes("text/html")) {
      data = new JSDOM(await res.text());
    } else {
      data = await res.text();
    }
    return this.processData(data);
  }
}

module.exports = Scraper;
