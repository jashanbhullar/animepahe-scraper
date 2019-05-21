const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const Multiprogress = require("multi-progress");

const progressBars = new Multiprogress(process.stderr);

(async () => {
  const links = fs
    .readFileSync("download-links.txt", "utf-8")
    .split("\n")
    .filter(Boolean);

  await Promise.all(links.map(link => download(link)));
})();

async function download(link) {
  const fileName = link.split("/").reverse()[1];
  console.log("Downloading ", fileName);
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
      .output(fileName)
      .run();
  });
}
