# Not working as of yet.

## AnimePahe Scraper

A scraper to download anime from [animepahe.com](animepahe.com).

### Setup 
```npm i ```

### Steps to Download

#### Step 1

Get the anime id of the anime you want to download.
This will download all the episode links to the episodes in `rewards/[ANIME_NAME]` directory


`ANIME_ID` is the id in the URL for e.g.
```
https://animepahe.com/anime/acd478b9-26eb-d50d-2013-223fc5b67bc4
```
`acd478b9-26eb-d50d-2013-223fc5b67bc4` is the ANIME ID


```
node get-episodes.js [anime_id] [name] [from_episode] [to_episode]
```
Where the values can be
```text
anime_id = ANIME_ID from above
name = name of the anime (can be anything)
from_episode = 1 - to_episode
to_episode = null | < from_episode
```

### Step 2

Downlod the video urls of each video, remember these links expire after a while so you will have to download them again.
Specify the `START_INDEX` and `END_INDEX`

```
node get-download.js FILE_PATH [START_INDEX] [END_INDEX]
```

### Step 3

Download all the links parallely (might be too much so keep the size of download-link.txt small)

```
./download.sh reward/[anime_name]/download-links.txt 
```
