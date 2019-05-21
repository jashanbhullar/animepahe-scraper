const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://animepahe.com/anime/jojos-bizarre-adventure-tv");
  await page.waitFor(2000);
  await page.screenshot({
    path: "main-screenshot.png",
    fullPage: true
  });
  const urls = await page.$$eval("a.play", as => as.map(a => a.href));
  console.log(urls);
  const stream = fs.createWriteStream("ep-links.txt", { flags: "a" });
  for (url of urls) {
    stream.write(url + "\n");
  }
  stream.end();
  browser.close();
})();
