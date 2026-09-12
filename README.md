# 🕷️ web-scraper-js

A small but **robust, reusable Node.js web scraper**. Point it at a URL, give it a `processData` callback, and it returns a parsed **JSON** object or a queryable **JSDOM** document. Built on native `fetch`, with **retries + exponential backoff**, **timeouts**, a **CLI**, and **tests**.

![tests](https://img.shields.io/badge/tests-3%20passing-brightgreen?style=flat-square)

---

## ✨ Features

- 🔁 **Retries with exponential backoff** and per-request **timeout** (AbortController)
- 🧠 **Content-type aware** - JSON is parsed, HTML becomes a DOM you can query
- 🖥️ **CLI** - scrape any CSS selector to stdout or a JSON file, no code required
- 🧪 **Tested** - deterministic Jest suite (fetch mocked with fixtures)
- 🪶 One dependency (`jsdom`)

---

## 🖥️ CLI

```bash
# text of every element matching a selector -> JSON file
node cli.js "https://quotes.toscrape.com/" --selector ".author" --output authors.json

# an attribute instead of text
node cli.js "https://example.com" --selector "a" --attr href
```

## 🧩 Library

```js
const Scraper = require("./scraper");

const quotes = await new Scraper({
  url: "https://quotes.toscrape.com/",
  retries: 3,
  timeout: 10000,
  processData: (dom) =>
    [...dom.window.document.querySelectorAll(".quote")].map((q) => ({
      text: q.querySelector(".text").textContent,
      author: q.querySelector(".author").textContent,
    })),
}).run();
```

## 📦 Examples

```bash
npm run example   # Wikipedia -> { "200": "OK", "404": "Not Found", ... } (85 codes)
npm run quotes    # quotes.toscrape.com -> 10 quotes with authors & tags
npm test          # run the test suite
```

---

## 🛠️ Tech

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![jsdom](https://img.shields.io/badge/jsdom-CA4245?style=flat-square)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)

## 📄 License

Released under the [MIT License](LICENSE).
