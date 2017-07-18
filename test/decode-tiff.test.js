import test from "ava";
import path from "path";
const decodeTiff = require("../lib/decode-tiff");

test("decode tiff file", async t => {
  const file = path.resolve(__dirname, "images/actual.tiff");
  const jpeg = await decodeTiff(file);
  t.is(typeof jpeg.width, "number");
  t.is(typeof jpeg.height, "number");
  t.is(jpeg.data.length, jpeg.width * jpeg.height * 4);
});
