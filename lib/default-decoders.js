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
  new Promise((rs, rj) => {
    asStream(strOrBuf).then(readStream => {
      const pngStream = readStream.pipe(new PNG());
      pngStream.on("parsed", function() {rs(this);});
      pngStream.on("error", rj);
    });
  });
}

async function decodeJpeg(strOrBuf) {
  const buffer = await asBuffer(strOrBuf);
  return JPEG.decode(buffer, true);
}

async function decodeTiff(strOrBuf) {
  const buffer = await strOrBuf;
  return TIFF.devode(buffer);
}

module.exports = new Map([
  ["png", decodePng],
  ["jpeg", decodeJpeg],
  ["jpg", decodeJpeg],
  ["tiff", decodeTiff]
]);
