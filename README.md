# Not working as of yet.

## AnimePahe Scraper

A scraper to download anime from [animepahe.com](animepahe.com).

### Steps to Download

#### Step 1

Make sure you have a `reward` folder in the directory.

Get the anime id of the anime you want to download.
This will download all the episode links to the episodes in `rewards/[ANIME_NAME]` directory

```
node get-episodes.js <anime_id> [<asceding>] [<Start_page>] [<End_Page>]
```

### Step 2

Downlod the video urls of each video, remember these links after a while so you will have to download them again after a while.
Specify the `START_INDEX` and `END_INDEX`

```
node get-download.js FILE_PATH [START_INDEX] [END_INDEX]
```

### Step 3

Download the vides in the batch of `5`. Specify the `START_INDEX` and `END_INDEX`

```
node download.js FILE_PATH [START_INDEX] [END_INDEX]
```
