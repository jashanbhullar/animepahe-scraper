const fs = require("fs");
const m3u8stream = require("m3u8stream");

m3u8stream(
  "https://eu2-cdn.nextstream.org/stream/0000/8fc8d1e6827a362a480bd2f787db7e05098b1c2c582bb2434cc11785c95cd33f/uwu.m3u8?token=TeZ8XQa4hKL9_6zViST0Lg&expires=1583519988",
  {
    requestOptions: {
      headers: {
        referer: " https://kwik.cx/e/XLMiKAAhJSBc"
      }
    }
  }
).pipe(fs.createWriteStream("videofile.mp4"));
