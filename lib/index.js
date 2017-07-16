const fs = require("fs");
const path = require("path");
const pixelmatch = require("pixelmatch");
const { PNG } = require("pngjs");
const decodePng = require("./decode-png");
const decodeJpeg = require("./decode-jpeg");
const expand = require("./expand");

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
registerDecoder(["jpg", "jpeg"], decodeJpeg);

function compare(img1, img2, diffFilename) {
  const { dataList, width, height } = expand(img1, img2);
  const diff = new PNG({ width, height });

  pixelmatch(dataList[0], dataList[1], diff.data, width, height, { threshold: 0 });

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
    return compare(imgs[0], imgs[1], options.diffFilename);
  })
  ;
}

module.exports = { imgDiff, registerDecoder };
