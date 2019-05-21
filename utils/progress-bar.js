var ProgressBar = require("progress");
var https = require("https");
var Multiprogress = require("multi-progress");

var req = https.request({
  host: "indy.fulgan.com",
  port: 443,
  path: "/ZIP/Indy10_5498.zip"
});

var multi = new Multiprogress(process.stderr);

req.on("response", function(res) {
  var len = parseInt(res.headers["content-length"], 10);

  // console.log();
  var bar = multi.newBar("  downloading [:bar] :rate/bps :percent :etas", {
    complete: "=",
    incomplete: " ",
    width: 20,
    total: len
  });

  res.on("data", function(chunk) {
    bar.tick(chunk.length);
  });

  res.on("end", function() {
    console.log("\n");
  });
});

req.on("response", function(res) {
  var len = parseInt(res.headers["content-length"], 10);

  // console.log();
  var bar = multi.newBar("  loading [:bar] :rate/bps :percent :etas", {
    complete: "=",
    incomplete: " ",
    width: 20,
    total: len
  });

  res.on("data", function(chunk) {
    bar.tick(chunk.length);
  });

  res.on("end", function() {
    console.log("\n");
  });
});

req.end();
