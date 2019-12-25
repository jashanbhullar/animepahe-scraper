const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const Multiprogress = require("multi-progress");
const progressBars = new Multiprogress(process.stderr);

const MAX_PARALLEL_DOWNLOADS = 5;
const FILE_PATH = path.join(path.resolve(), process.argv[2]);
const DIR_PATH = path.dirname(FILE_PATH);
const START_INDEX = +process.argv[3] - 1;
const END_INDEX = +process.argv[4];

if (!fs.existsSync(FILE_PATH)) {
  throw new Error(" Error with the download link files");
}

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
    .readFileSync(FILE_PATH, "utf-8")
    .split("\n")
    .filter(Boolean);

  if (links.length === 0) {
    throw new Error("0 episodes to download");
  }

  const linkstoDownload = links.slice(START_INDEX, END_INDEX);
  console.log("Total links to be downloaded", linkstoDownload.length);

  while (linkstoDownload.length > 0) {
    await Promise.all(
      linkstoDownload
        .splice(0, MAX_PARALLEL_DOWNLOADS)
        .map(link => download(link))
    );

    console.log(linkstoDownload.length, "downloads left");
  }
})();

async function download(link) {
  const fileName = link.split("/").reverse()[1];
  await new Promise((resolve, reject) => {
    const bar = progressBars.newBar(`${fileName} [:bar]  :percent :etas`, {
      complete: "=",
      incomplete: " ",
      width: 20,
      total: 100
    });
    ffmpeg(link)
      .on("error", error => {
        reject(new Error(error));
      })
      .on("end", () => {
        resolve();
      })
      .on("progress", progress => {
        bar.update(progress.percent / 100);
      })
      .outputOptions("-c copy")
      .outputOptions("-bsf:a aac_adtstoasc")
      .output(path.join(DIR_PATH, fileName))
      .run();
  });
}
