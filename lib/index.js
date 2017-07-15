const fs = require("fs");
const pixelmatch = require("pixelmatch");
const PNG = require("pngjs").PNG;

function doneReading(img1, img2, diffFilename) {
    const { width, height } = img1; // FIXME
    const diff = new PNG({width: img1.width, height: img1.height});
    pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});
    const out = fs.createWriteStream(diffFilename);
    const p = new Promise((resolve, reject) => {
      out
        .on("finish", () => resolve({ width, height }))
        .on("error", err => reject(err))
      ;
    });
    diff.pack().pipe(out);
    return p;
}

function createPngBufferPromise(filename) {
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

function imgDiff(options) {
  return Promise.all([
    createPngBufferPromise(options.actualFilename),
    createPngBufferPromise(options.expectedFilename),
  ]).then(imgs => {
    return doneReading(imgs[0], imgs[1], options.diffFilename);
  })
  ;
}

module.exports = { imgDiff };
exports.default = function () { return imgDiff };
