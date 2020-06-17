const path = require("path");
const fs = require("fs");

const episodesFile = path.join(path.resolve(), process.argv[2]);

const episodes = fs
  .readFileSync(episodesFile, "utf-8")
  .split("\n")
  .filter(Boolean)
  .reverse();

const filter = require(path.join(path.resolve(), process.argv[3]));

const filtered = [];
for (let i = 0; i < filter.length; i++) {
  const filler = filter[i]["Type"] === "Filler";
  if (!filler) {
    filtered.push(episodes[i]);
  }
}

fs.writeFileSync(
  path.join(path.dirname(episodesFile), "filtered-episodes.txt"),
  filtered.reverse().join("\n")
);
