//Dependencies
const FS = require("fs");
const Path = require("path");
const pixelmatch = require("pixelmatch");
const { PNG } = require("pngjs");
const mkdirp = require("mkdirp");
const Mime = require("mime-types");

//Peer Files
const defaultDecoders = require("./default-decoders");
const expand = require("./expand");

const mimeTypeDecoderMap = new Map();
const mimeTypeRegEx = /^[-\w.]+\/[-\w.]+$/;

function registerDecoder(mimeArr, decoder) {
  const mimes = typeof mimeArr == "string" ? [mimeArr] : mimeArr;
  mimes.forEach(mime => {
    if (!mimeTypeRegEx.test(mime))
      throw new Error(`Invalid mime "${mime}".`);
    mimeTypeDecoderMap.set(mime, decoder);
  });
}

function decode(data, mime) {
  const decoder = mimeTypeDecoderMap.get(mime);
  if (!decoder)
    throw new Error(`No decoder present for mime type "${mime}".`);
  return decoder(data);
}

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

/*
  Opts human readable signature:
  {
    actualFilename: string, //Mutually exclusive with actualContent & actual.
    actualContent: Buffer | NodeJS.ReadStream, //Mutually exclusive with actualFilename & actual.
    actualType: string, //Must be present if actual is assigned a Buffer or NodeJS.ReadStream or actualContent is assigned.
    actual: string | Buffer | NodeJS.ReadStream, //Mutually exclusive with actualFilename & actualContent.
    expectedFilename: string, //Mutually exclusive with expectedContent & expected.
    expectedContent: Buffer | NodeJS.ReadStream, //Mutually exclusive with expectedFilename & expected.
    expectedType: string, //Must be present if expected is assigned a Buffer or NodeJS.ReadStream or expectedContent is assigned.
    expected: string | Buffer | NodeJS.ReadStream, //Mutually exclusive with expectedFilename & expectedContent.
    diffFilename: string,
    generateOnlyDiffFile: boolean,
    options: import("pixelmatch").Options
  }

  Opts TS signature:
  (
    {
      actual: Buffer | NodeJS.ReadStream,
      actualType: string
    } | {
      actualContent: Buffer | NodeJS.ReadStream,
      actualType: string
    } | {
      actual: string
      actualType?: string
    } | {
      actualFilename: string
      actualType?: string
    }
  ) & (
    {
      expected: Buffer | NodeJS.ReadStream,
      expectedType: string
    } | {
      expectedContent: Buffer | NodeJS.ReadStream,
      expectedType: string
    } | {
      expected: string
      expectedType?: string
    } | {
      expectedFilename: string
      expectedType?: string
    }
  ) & {
    diffFilename?: string,
    generateOnlyDiffFile?: boolean,
    options?: import("pixelmatch").Options //Type will need manual copying.
  }
*/
async function imgDiff(opts) {
  const actual = opts.actual || opts.actualContent || opts.actualFilename;
  const expected = opts.expected || opts.expectedContent || opts.expectedFilename;
  
  if (typeof actual != "string" && !opts.actualType)
    throw new Error("Missing mime type for actual content.");
  if (typeof expected != "string" && !opts.expectedType)
    throw new Error("Missing mime type for expected content.");

  const actualType = opts.actualType || Mime.lookup(actual);
  const expectedType = opts.expectedType || Mime.lookup(expected);

  const actualData = typeof actual == "string" ?
    FS.createReadStream(actual) : actual;
  const expectedData = typeof expected == "string" ?
    FS.createReadStream(expected) : expected;
  const actualProm = decode(actualData, actualType);
  const expectedProm = decode(expectedData, expectedType);
  const actualImage = await actualProm;
  const expectedImage = await expectedProm;
  return compare(actualImage, expectedImage, opts.diffFilename,
    opts.generateOnlyDiffFile, opts.options);
}

defaultDecoders.forEach((decoder, mime) => registerDecoder(mime, decoder));

module.exports = {imgDiff, registerDecoder};
