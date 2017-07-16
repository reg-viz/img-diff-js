const fs = require("fs");
const path = require("path");
const pixelmatch = require("pixelmatch");
const PNG = require("pngjs").PNG;
const decodePng = require("./decode-png");

const extensionDecoderMap = { };
function registerDecoder(extensions, decoder) {
  extensions.forEach(extension => {
    if (!extension.startsWith(".")) {
      extension = `.${extension}`;
    }
    extensionDecoderMap[extension] = decoder;
  });
}

function decode(filename) {
  const ext = path.extname(filename);
  const decoder = extensionDecoderMap[ext]
  if (!ext || !decoder) {
    const exts = Object.keys(extensionDecoderMap).join(", ")
    throw new Error("File name should be end with " + exts);
  }
  return decoder(filename);
}

registerDecoder(["png"], decodePng);

function doneReading(img1, img2, diffFilename) {
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);
  const diff = new PNG({ width, height });
  pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0 });
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

function imgDiff(options) {
  return Promise.all([
    decode(options.actualFilename),
    decode(options.expectedFilename),
  ]).then(imgs => {
    return doneReading(imgs[0], imgs[1], options.diffFilename);
  })
  ;
}

module.exports = { imgDiff, registerDecoder };
