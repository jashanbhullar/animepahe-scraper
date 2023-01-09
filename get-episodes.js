const https = require("https");
const fs = require("fs");
const path = require("path");

// const M = process.argv[2];
const ANIME_ID = process.argv[2];
const NAME = process.argv[3];
const FROM_EPISODE = +process.argv[4] || 1;
const TO_EPISODE = +process.argv[5] || Number.MAX_SAFE_INTEGER;

(() => {
  error = false;
  if (FROM_EPISODE < 0) {
    console.log("FROM_EPSIODE has to be greater than 0");
    error = true;
  } else if (TO_EPISODE && TO_EPISODE < FROM_EPISODE) {
    console.log("TO_EPISODE can't be greater than FROM_EPISODE");
    error = true;
  }

  if (error) {
    console.log("Will now exit!!!");
    process.exit(0);
  }
})();

// The promise which make the api request to the server
// No Library used here :)
const getUrls = (url) => {
  return new Promise((resolve, reject) => {
    https

      .request(url, (res) => {
        let responseData = "";

        res.on("data", (d) => (responseData += d));

        res.on("end", () => {
          const { next_page_url, data } = JSON.parse(responseData);

          resolve({
            next_page_url,
            episodes: data,
          });
        });
      })
      .on("error", (e) => reject(e))
      .end();
  });
};

// keep creating the next page of urls
const apiURL = (page) =>
  `https://animepahe.com/api?m=release&sort=episode_desc&id=${ANIME_ID}&page=${page}`;

// The actual function
// Made IIFE so that can be run as async
(async () => {
  const allEpisodes = [];
  let currentPage = 1;

  while (true) {
    const { episodes, next_page_url } = await getUrls(apiURL(currentPage));

    console.log(
      "Page",
      currentPage,
      "Fetched",
      episodes.length,
      "episodes from",
      episodes[0].episode,
      "to",
      episodes[29].episode
    );

    for (val of episodes) {
      const { episode, session } = val;
      if (episode >= FROM_EPISODE && episode <= TO_EPISODE) {
        val.url = `https://animepahe.com/play/${ANIME_ID}/${session}`;
        allEpisodes.push(val);
      }
    }

    if (next_page_url == null) {
      console.log("Reached the end of page.");
      break;
    }
    if (episodes[29].episode < FROM_EPISODE) {
      console.log("Reached the starting episode");
      break;
    }
    currentPage++;
  }

  console.log(
    "Total episodes fetched",
    allEpisodes.length,
    "from",
    allEpisodes[0].episode,
    "to",
    allEpisodes[allEpisodes.length - 1].episode
  );

  const dirPath = path.join(path.resolve("reward", NAME));
  fs.mkdirSync(dirPath, { recursive: true });
  const stream = fs.createWriteStream(path.join(dirPath, "episode-links.txt"), {
    flags: "wx",
  });
  for (val of allEpisodes) {
    stream.write(val.url + "\n");
  }
  stream.end();
  console.log(`Total ${allEpisodes.length} fetched and written to file`);
})();
