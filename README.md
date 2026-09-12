# 🕷️ web-scraper-js

A small, reusable **Node.js web scraper**. Point it at a URL, give it a `processData` callback, and it hands you either a parsed **JSON** object or a **JSDOM** document (for HTML) to extract whatever you need.

Built on the native `fetch` (Node 18+), so redirects and gzip/brotli are handled for you.

## 🚀 Example

Scrape the Wikipedia "List of HTTP status codes" page into a `{ code: message }` map:

```bash
npm install
npm run example
```

Output:
```
Scraped 85 HTTP status codes. Sample:
{ '200': 'OK', '404': 'Not Found', '500': 'Internal Server Error' }
```

## 🧩 Usage

```js
const Scraper = require("./scraper");

const scraper = new Scraper({
  url: "https://example.com/data.json",
  processData: (data) => {
    // data is a parsed object for JSON,
    // or a JSDOM instance for HTML (use data.window.document)
    return data;
  },
});

const result = await scraper.run();
```

## ✨ Features

- 🔁 Follows redirects, decompresses gzip/brotli (native `fetch`)
- 🧠 Content-type aware — JSON is parsed, HTML becomes a queryable DOM
- 🧩 Reusable class with a single `processData` hook
- 🪶 One dependency (`jsdom`)

## 🛠️ Tech

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![jsdom](https://img.shields.io/badge/jsdom-CA4245?style=flat-square)

## 📄 License

Released under the [MIT License](LICENSE).
