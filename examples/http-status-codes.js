// Scrape the Wikipedia "List of HTTP status codes" page (FR) into a
// { code: message } lookup object.
const Scraper = require("../scraper");

const scraper = new Scraper({
  url: "https://fr.wikipedia.org/wiki/Liste_des_codes_HTTP",
  processData: (dom) => {
    const table = {};
    const rows = dom.window.document.querySelectorAll("table.wikitable tr");
    rows.forEach((tr) => {
      const code = tr.querySelector("th")?.textContent.trim();
      const msg = tr.querySelector("td")?.textContent.trim();
      if (code && msg && /^\d{3}$/.test(code)) table[code] = msg;
    });
    return table;
  },
});

scraper.run().then((codes) => {
  console.log(`Scraped ${Object.keys(codes).length} HTTP status codes. Sample:`);
  console.log({ "200": codes["200"], "404": codes["404"], "500": codes["500"] });
}).catch((err) => {
  console.error("Scrape failed:", err.message);
  process.exit(1);
});
