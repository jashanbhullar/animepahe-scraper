const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const MAX_PAGE = 5;

const FILE_PATH = path.join(path.resolve(), process.argv[2]);
const WRITE_STREAM = fs.createWriteStream(
  path.join(path.dirname(FILE_PATH), "download-links.txt"),
  { flags: "wx" }
);
let START_INDEX = +process.argv[3] - 1;
let END_INDEX = +process.argv[4];

if (!fs.existsSync(FILE_PATH)) {
  throw new Error(" Error with the episode link files");
}
if (
  isNaN(START_INDEX) ||
  isNaN(END_INDEX) ||
  START_INDEX < 0 ||
  END_INDEX < START_INDEX ||
  END_INDEX <= 0
) {
  START_INDEX = 0;
  END_INDEX = 1000;
  console.log("Error with entered start index and end index");
  console.log(
    `Setting start Index ${START_INDEX} and end index to ${END_INDEX}`
  );
}

(async () => {
  const links = fs
    .readFileSync(FILE_PATH, "utf-8")
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
        WRITE_STREAM.write(url + "\n");
      }
      console.log(urls.length, "number of urls fetched");
    }
  } catch (err) {
    console.log(err);
  }
  console.log("Total urls fetched", urls.length);
  WRITE_STREAM.end();
  browser.close();
})();

async function downloadLink(browser, link, index) {
  const page = await browser.newPage();

  await page.goto(link);
  await page.setRequestInterception(true);
  let url;
  page.on("request", interceptedRequest => {
    if (interceptedRequest.url().includes(".m3u8")) {
      url = interceptedRequest.url();
    }
    interceptedRequest.continue();
  });
  await page.screenshot({
    path: `${index}-screenshot-intial.png`,
    fullPage: true
  });
  await page.click("div.click-to-load");
  await page.waitFor(5000);
  await page.screenshot({
    path: `${index}-screenshot-afterClicked.png`,
    fullPage: true
  });
  if (!url) {
    throw new Error(`${index} No url found, took too much time executing`);
  }
  await page.close();
  return url;
}
