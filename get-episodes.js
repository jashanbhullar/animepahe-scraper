const https = require("https");
const fs = require("fs");

const M = process.argv[2];
const ANIME_ID = process.argv[3];

// Throw error if the required parameters are missing
if (!M || !ANIME_ID) {
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
          data.forEach(({ id, anime_slug }) =>
            urls.push(`https://animepahe.com/anime/${anime_slug}/${id}`)
          );
          resolve({
            last_page,
            urls
          });
        });
      })
      .on("error", e => reject(e))
      .end();
  });
};

// keep creating the next page of urls
const apiURL = page =>
  `https://animepahe.com/api?m=${M}&id=${ANIME_ID}&page=${page}`;

// The actual function
// Made IIFE so that can be run as async
(async () => {
  let currentPage = 1;
  let lastPage = 0;
  const episodePageURLs = [];
  do {
    const { last_page, urls } = await getUrls(apiURL(currentPage));
    lastPage = last_page;
    currentPage++;
    console.log(`${urls.length} urls fetched`);
    episodePageURLs.push(...urls);
  } while (currentPage <= lastPage);

  const stream = fs.createWriteStream("episode-links.txt", { flags: "wx" });
  for (url of episodePageURLs) {
    stream.write(url + "\n");
  }
  stream.end();
  console.log(`Total ${episodePageURLs.length} fetched and written to file`);
})();
