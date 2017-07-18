const fs = require("fs");
const { decode } = require("decode-tiff");

function decodeTiff(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, rawBuffer) => {
      if (err) return reject(err);
      const tiffData = decode(rawBuffer);
      resolve(tiffData);
    });
  });
}

module.exports = decodeTiff;
