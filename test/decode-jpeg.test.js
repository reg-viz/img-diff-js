import test from "ava";
import path from "path";
const decodeJpeg = require("../lib/decode-jpeg").default;

test("decode jpeg file", async t => {
  const file = path.resolve(__dirname, "images/actual.jpg");
  const jpeg = await decodeJpeg(file);
  t.is(typeof jpeg.width, "number");
  t.is(typeof jpeg.height, "number");
  t.is(jpeg.data.length, jpeg.width * jpeg.height * 4);
});
