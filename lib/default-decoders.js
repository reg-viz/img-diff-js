const Stream = require("stream");
const {PNG} = require("pngjs");
const JPEG = require("jpeg-js");
const TIFF = require("decode-tiff");

const asStream = strOrBuf =>
  strOrBuf instanceof Buffer ?
    bufferToStream(strOrBuf) :
    Promise.resolve(strOrBuf);
const asBuffer = strOrBuf =>
  strOrBuf instanceof Buffer ?
    Promise.resolve(strOrBuf) :
    streamToBuffer(strOrBuf);

async function bufferToStream(buffer) {
  const stream = new Stream.Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

function streamToBuffer(stream) {
  return new Promise((rs, rj) => {
    let buffers = [];
    stream.on("error", rj);
    stream.on("data", Array.prototype.push.bind(buffers));
    stream.on("end", () => rs(Buffer.concat(buffers)));
  });
}

function decodePng(strOrBuf) {
  return new Promise(async (rs, rj) => {
    try {
      const readStream = await asStream(strOrBuf);
      const pngStream = readStream.pipe(new PNG());
      pngStream.on("parsed", function() {rs(this);});
      pngStream.on("error", rj);
    } catch (err) {
      rj(err);
    }
  });
}

async function decodeJpeg(strOrBuf) {
  const buffer = await asBuffer(strOrBuf);
  return JPEG.decode(buffer, true);
}

async function decodeTiff(strOrBuf) {
  const buffer = await strOrBuf;
  return TIFF.decode(buffer);
}

module.exports = new Map([
  ["image/png", decodePng],
  ["image/jpeg", decodeJpeg],
  ["image/tiff", decodeTiff]
]);
