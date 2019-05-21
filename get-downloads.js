const fs = require("fs");
const puppeteer = require("puppeteer");
const WRITESTREAM = fs.createWriteStream("download-links.txt", { flags: "wx" });
const MAX_PAGE = 5;

(async () => {
  const links = fs
    .readFileSync("episode-links.txt", "utf-8")
    .split("\n")
    .filter(Boolean);
  const browser = await puppeteer.launch();
  const urls = [];
  console.log("Total number download links to be fetched", links.length);
  const pages = [...links];
  try {
    while (pages.length > 0) {
      const newUrls = await Promise.all(
        pages
          .splice(0, MAX_PAGE)
          .map((link, index) => downloadLink(browser, link, index))
      );
      urls.push(...newUrls);

      for (url of newUrls) {
        WRITESTREAM.write(url + "\n");
      }
      console.log(urls.length, "number of urls fetched");
    }
  } catch (err) {
    console.log(err);
  }
  if (urls.length !== links.length)
    throw new Error("Url and links length is not the same");

  console.log("All urls are fetched");
  WRITESTREAM.end();
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
  // await page.screenshot({
  //   path: `${index}-screenshot-intial.png`,
  //   fullPage: true
  // });
  await page.click("div.click-to-load");
  await page.waitFor(5000);
  // await page.screenshot({
  //   path: `${index}-screenshot-afterClickeds.png`,
  //   fullPage: true
  // });
  if (!url) {
    throw new Error(`${index} No url found, took too much time executing`);
  }
  await page.close();
  return url;
}
