const https = require("https");
const fs = require("fs");
const path = require("path");

// const M = process.argv[2];
const ANIME_ID = process.argv[2];
const ASC_SORT = process.argv[3] === "true" ? "episode_asc" : "episode_desc";
const PAGE_START = +process.argv[4] || 1;
const PAGE_END = +process.argv[5] || null;

// Throw error if the required parameters are missing
if (!ASC_SORT || !ANIME_ID) {
  throw new Error("Please provide release status and anime id");
}

// The promise which make the api request to the server
// No Library used here :)
const getUrls = url => {
  return new Promise((resolve, reject) => {
    https

      .request(url, res => {
        let responseData = "";

        res.on("data", d => (responseData += d));

        res.on("end", () => {
          const { last_page, data } = JSON.parse(responseData);
          const urls = [];
          const { anime_title } = data[0];
          data.forEach(({ session, anime_slug, filler }) => {
            if (!filler) {
              urls.push(`https://animepahe.com/play/${anime_slug}/${session}`);
            }
          });
          resolve({
            last_page,
            urls,
            anime_title
          });
        });
      })
      .on("error", e => reject(e))
      .end();
  });
};

// keep creating the next page of urls
const apiURL = page =>
  `https://animepahe.com/api?m=release&id=${ANIME_ID}&sort=${ASC_SORT}&page=${page}`;

// The actual function
// Made IIFE so that can be run as async
(async () => {
  let currentPage = PAGE_START;
  let lastPage;
  let name;
  const episodePageURLs = [];
  do {
    const { last_page, urls, anime_title } = await getUrls(apiURL(currentPage));
    name = anime_title || "NA";
    lastPage = PAGE_END ? PAGE_END : last_page;
    currentPage++;
    console.log(`${urls.length} urls fetched`);
    episodePageURLs.push(...urls);
  } while (currentPage <= lastPage);

  const dirPath = path.join(path.resolve("reward", name));
  fs.mkdirSync(dirPath, { recursive: true });
  const stream = fs.createWriteStream(path.join(dirPath, "episode-links.txt"), {
    flags: "wx"
  });
  for (url of episodePageURLs) {
    stream.write(url + "\n");
  }
  stream.end();
  console.log(`Total ${episodePageURLs.length} fetched and written to file`);
})();
