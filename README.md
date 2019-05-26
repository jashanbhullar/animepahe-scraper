## AnimePahe Scraper

A scraper to download anime from [animepahe.com](animepahe.com).

### Steps to Download

#### Step 1

Get the anime id of the anime you want to download.
This will download all the episode links to the episodes.

```
node get-episodes.js release 2862
```

### Step 2

Downlod the video urls of each video, remember these links after a while so you will have to download them again after a while.
Specify the `START_INDEX` and `END_INDEX`

```
node get-download.js 1 1
```

### Step 3

Download the vides in the batch of `5`. Specify the `START_INDEX` and `END_INDEX`

```
node download.js 1 10
```
