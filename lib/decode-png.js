const fs = require("fs");
const PNG = require("pngjs").PNG;

function decodePng(filename) {
  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(filename).pipe(new PNG())
        .on("parsed", function() {
          resolve(this);
        })
        .on("error", function(err) {
          reject(err);
        })
      ;
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = decodePng;
