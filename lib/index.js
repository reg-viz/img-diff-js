const FS = require("fs");
const Path = require("path");
const pixelmatch = require("pixelmatch");
const { PNG } = require("pngjs");
const mkdirp = require("mkdirp");
const defaultDecoders = require("./default-decoders");
const expand = require("./expand");

const extensionDecoderMap = new Map();
function registerDecoder(extensions, decoder) {
  extensions.forEach(extension => {
    if (!extension.startsWith(".")) {
      extension = `.${extension}`;
    }
    extensionDecoderMap.set(extension, decoder);
  });
}

function decode(data, ext) {
  const decoder = extensionDecoderMap.get(ext);
  if (!decoder)
    throw new Error(`No decoder present for file type ${ext}.`);
  return decoder(data);
}

defaultDecoders.forEach((decoder, extension) => registerDecoder([extension], decoder));

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

  mkdirp.sync(Path.dirname(diffFilename));
  const out = FS.createWriteStream(diffFilename);
  const p = new Promise((resolve, reject) => {
    out
      .on("finish", () => resolve(result))
      .on("error", err => reject(err))
    ;
  });
  diff.pack().pipe(out);

  return p;
}

async function imgDiff(opts) {
  const actualStream = FS.createReadStream(opts.actualFilename);
  const expectedStream = FS.createReadStream(opts.expectedFilename);
  const actualProm = decode(actualStream, Path.extname(opts.actualFilename));
  const expectedProm = decode(expectedStream, Path.extname(opts.expectedFilename));
  const actual = await actualProm;
  const expected = await expectedProm;
  return compare(actual, expected, opts.diffFilename, opts.generateOnlyDiffFile, opts.options);
}

module.exports = {imgDiff, registerDecoder};
