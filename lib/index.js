const fs = require("fs");
const path = require("path");
const pixelmatch = require("pixelmatch");
const { PNG } = require("pngjs");
const mkdirp = require("mkdirp");
const decodePng = require("./decode-png");
const decodeJpeg = require("./decode-jpeg");
const decodeTiff = require("./decode-tiff");
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
registerDecoder(["tiff"], decodeTiff);

function compare(img1, img2, diffFilename, generateOnlyDiffFile, options) {
  const { dataList, width, height } = expand(img1, img2);
  const diff = new PNG({ width, height });
  const pmOpt = Object.assign({
    threshold: 0.1,
    includeAA: false
  }, options || { });

  const count = pixelmatch(dataList[0], dataList[1], diff.data, width, height, pmOpt);
  const imagesAreSame = count === 0;
  const result = {
    width,
    height,
    imagesAreSame,
    diffCount: count,
  };
  if (!diffFilename) {
    return Promise.resolve(result);
  }

  if (imagesAreSame && generateOnlyDiffFile) {
    return Promise.resolve(result);
  }

  mkdirp.sync(path.dirname(diffFilename));
  const out = fs.createWriteStream(diffFilename);
  const p = new Promise((resolve, reject) => {
    out
      .on("finish", () => resolve(result))
      .on("error", err => reject(err))
    ;
  });
  diff.pack().pipe(out);

  return p;
}

function imgDiff(opt) {
  return Promise.all([
    decode(opt.actualFilename),
    decode(opt.expectedFilename),
  ]).then(imgs => {
    return compare(imgs[0], imgs[1], opt.diffFilename, opt.generateOnlyDiffFile, opt.options);
  })
  ;
}

module.exports = { imgDiff, registerDecoder };
