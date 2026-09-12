// Scrape quotes + authors from quotes.toscrape.com (a site made for scraping).
const Scraper = require("../scraper");

new Scraper({
  url: "https://quotes.toscrape.com/",
  processData: (dom) => {
    const d = dom.window.document;
    return [...d.querySelectorAll(".quote")].map((q) => ({
      text: q.querySelector(".text").textContent.trim(),
      author: q.querySelector(".author").textContent.trim(),
      tags: [...q.querySelectorAll(".tag")].map((t) => t.textContent),
    }));
  },
}).run().then((quotes) => {
  console.log(`Scraped ${quotes.length} quotes. First:`);
  console.log(quotes[0]);
}).catch((e) => { console.error(e.message); process.exit(1); });
