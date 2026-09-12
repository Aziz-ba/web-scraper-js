#!/usr/bin/env node
/**
 * Generic scraping CLI.
 *
 *   node cli.js <url> --selector "<css>" [--attr href] [--output out.json]
 *
 * Prints (or saves) the text (or an attribute) of every element matching the
 * CSS selector. For JSON endpoints, omit --selector to dump the JSON.
 */
const fs = require("fs");
const Scraper = require("./scraper");

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) args[a.slice(2)] = argv[++i];
    else args._.push(a);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const url = args._[0];
  if (!url) {
    console.error('usage: node cli.js <url> --selector "<css>" [--attr href] [--output file.json]');
    process.exit(1);
  }

  const scraper = new Scraper({
    url,
    processData: (data) => {
      if (!args.selector) return data; // JSON or raw text passthrough
      const nodes = data.window.document.querySelectorAll(args.selector);
      return [...nodes].map((n) => (args.attr ? n.getAttribute(args.attr) : n.textContent.trim()));
    },
  });

  const result = await scraper.run();
  const out = JSON.stringify(result, null, 2);
  if (args.output) {
    fs.writeFileSync(args.output, out);
    console.error(`Wrote ${Array.isArray(result) ? result.length + " items" : "result"} to ${args.output}`);
  } else {
    console.log(out);
  }
}

main().catch((err) => { console.error(err.message); process.exit(1); });
