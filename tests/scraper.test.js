const Scraper = require("../scraper");

const FIXTURE = `<!doctype html><html><body>
  <ul><li class="item">Alpha</li><li class="item">Beta</li></ul>
</body></html>`;

function mockFetch(body, { ok = true, status = 200, type = "text/html" } = {}) {
  return jest.fn(async () => ({
    ok, status, statusText: "OK",
    headers: { get: () => type },
    text: async () => body,
    json: async () => JSON.parse(body),
  }));
}

describe("Scraper", () => {
  afterEach(() => { delete global.fetch; });

  test("parses HTML into a DOM and extracts elements", async () => {
    global.fetch = mockFetch(FIXTURE);
    const items = await new Scraper({
      url: "https://example.com",
      processData: (dom) => [...dom.window.document.querySelectorAll(".item")].map((n) => n.textContent),
    }).run();
    expect(items).toEqual(["Alpha", "Beta"]);
  });

  test("parses JSON responses", async () => {
    global.fetch = mockFetch('{"a":1}', { type: "application/json" });
    const data = await new Scraper({ url: "https://x", processData: (d) => d.a }).run();
    expect(data).toBe(1);
  });

  test("retries then throws on repeated failure", async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 500, statusText: "err", headers: { get: () => "" } }));
    await expect(
      new Scraper({ url: "https://x", processData: (d) => d, retries: 2, timeout: 100 }).run()
    ).rejects.toThrow(/failed after 2 attempts/);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
