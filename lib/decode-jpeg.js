const fs = require("fs");
const jpeg = require("jpeg-js");

function decodeJpeg(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, rawBuffer) => {
      if (err) return reject(err);
      const jpegData = jpeg.decode(rawBuffer, true);
      resolve(jpegData);
    });
  });
}

module.exports = decodeJpeg;
