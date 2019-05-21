const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const links = fs
    .readFileSync("ep-links.txt", "utf-8")
    .split("\n")
    .filter(Boolean);
  const browser = await puppeteer.launch();
  let urls;
  try {
    urls = await Promise.all(
      links.map((link, index) => downloadLink(browser, link, index))
    );
  } catch (err) {
    console.log(err);
  }
  if (urls.length === links.length) {
    const stream = fs.createWriteStream("download-links.txt", { flags: "a" });
    for (url of urls) {
      stream.write(url + "\n");
    }
    stream.end();
  }
  browser.close();
})();

async function downloadLink(browser, link, index) {
  const page = await browser.newPage();

  await page.goto(link);
  await page.setRequestInterception(true);
  let url;
  page.on("request", interceptedRequest => {
    if (interceptedRequest.url().endsWith(".m3u8"))
      url = interceptedRequest.url();
    interceptedRequest.continue();
  });
  await page.screenshot({
    path: `${index}-screenshot-1.png`,
    fullPage: true
  });
  await page.click("div.click-to-load");
  await page.waitFor(5000);
  await page.screenshot({
    path: `${index}-screenshot-2.png`,
    fullPage: true
  });
  if (!url) {
    throw new Error(`${index} No url found, took too much time executing`);
  }
  return url;
}
