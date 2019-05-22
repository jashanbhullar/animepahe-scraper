const fs = require("fs");
const puppeteer = require("puppeteer");
const WRITESTREAM = fs.createWriteStream("download-links.txt", { flags: "wx" });
const MAX_PAGE = 5;

const START_INDEX = +process.argv[2] - 1;
const END_INDEX = +process.argv[3];

if (
  isNaN(START_INDEX) ||
  isNaN(END_INDEX) ||
  START_INDEX < 0 ||
  END_INDEX < START_INDEX ||
  END_INDEX <= 0
) {
  throw new Error("Please specify both start and end index");
}

(async () => {
  const links = fs
    .readFileSync("episode-links.txt", "utf-8")
    .split("\n")
    .filter(Boolean)
    .reverse();
  const browser = await puppeteer.launch();
  const urls = [];
  const pages = links.slice(START_INDEX, END_INDEX);

  console.log("Total number download links to be fetched", pages.length);

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
  console.log("Total urls fetched", urls.length);
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
  await page.screenshot({
    path: `${index}-screenshot-intial.png`,
    fullPage: true
  });
  await page.click("div.click-to-load");
  await page.waitFor(5000);
  await page.screenshot({
    path: `${index}-screenshot-afterClickeds.png`,
    fullPage: true
  });
  if (!url) {
    throw new Error(`${index} No url found, took too much time executing`);
  }
  await page.close();
  return url;
}
