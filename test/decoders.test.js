import test from "ava";
import Path from "path";
import FSCB, {promises as FS} from "fs";

const decoders = require("../lib/default-decoders");
const decodeTiff = decoders.get("image/tiff");
const decodeJpeg = decoders.get("image/jpeg");

test("decode tiff file from stream", async test => {
  const name = Path.resolve(__dirname, "images/actual.tiff");
  const file = FSCB.createReadStream(name);
  const tiff = await decodeTiff(file);
  test.is(typeof tiff.width, "number");
  test.is(typeof tiff.height, "number");
  test.is(tiff.data.length, tiff.width * tiff.height * 4);
});

test("decode tiff file from buffer", async test => {
  const name = Path.resolve(__dirname, "images/actual.tiff");
  const file = await FS.readFile(name);
  const tiff = await decodeTiff(file);
  test.is(typeof tiff.width, "number");
  test.is(typeof tiff.height, "number");
  test.is(tiff.data.length, tiff.width * tiff.height * 4);
});

test("decode jpeg file from stream", async test => {
  const name = Path.resolve(__dirname, "images/actual.jpg");
  const file = FSCB.createReadStream(name);
  const jpeg = await decodeJpeg(file);
  test.is(typeof jpeg.width, "number");
  test.is(typeof jpeg.height, "number");
  test.is(jpeg.data.length, jpeg.width * jpeg.height * 4);
});

test("decode jpeg file from buffer", async test => {
  const name = Path.resolve(__dirname, "images/actual.jpg");
  const file = await FS.readFile(name);
  const jpeg = await decodeJpeg(file);
  test.is(typeof jpeg.width, "number");
  test.is(typeof jpeg.height, "number");
  test.is(jpeg.data.length, jpeg.width * jpeg.height * 4);
});
