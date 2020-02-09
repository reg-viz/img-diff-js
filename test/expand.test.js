import test from "ava";
import Path from "path";
import FS from "fs";

const rimraf = require("rimraf");
const { PNG } = require("pngjs");
const decoders = require("../lib/default-decoders");
const decodePng = decoders.get("image/png");
const expand = require("../lib/expand");

test("not expand from same dimension images", async t => {
  const imgName1 = Path.resolve(__dirname, "images/actual.png");
  const imgName2 = Path.resolve(__dirname, "images/expected.png");
  const img1 = await decodePng(FS.createReadStream(imgName1));
  const img2 = await decodePng(FS.createReadStream(imgName2));
  const { width, height, dataList } = expand(img1, img2);
  t.is(width, img1.width);
  t.is(height, img1.height);
  t.is(width, img2.width);
  t.is(height, img2.height);
  t.is(dataList[0], img1.data);
  t.is(dataList[1], img2.data);
});

test("expand horizontal", async t => {
  rimraf.sync(Path.resolve(__dirname, "images/expand_horizontal_generated.png"));
  const imgName1 = Path.resolve(__dirname, "images/actual.png");
  const imgName2 = Path.resolve(__dirname, "images/actual_wide.png");
  const img1 = await decodePng(FS.createReadStream(imgName1));
  const img2 = await decodePng(FS.createReadStream(imgName2));
  const { width, height, dataList } = expand(img1, img2);
  t.is(width, img2.width);
  t.is(height, img2.height);
  t.is(dataList[1], img2.data);
  t.is(dataList[0].length, width * height * 4);
  const png =  new PNG({ width, height });
  png.data = new Buffer(dataList[0]);
  FS.writeFileSync(Path.resolve(__dirname, "images/expand_horizontal_generated.png"), PNG.sync.write(png));
});

test("expand vertical", async t => {
  rimraf.sync(Path.resolve(__dirname, "images/expand_vertical_generated.png"));
  const imgName1 = Path.resolve(__dirname, "images/actual.png");
  const imgName2 = Path.resolve(__dirname, "images/actual_bulk.png");
  const img1 = await decodePng(FS.createReadStream(imgName1));
  const img2 = await decodePng(FS.createReadStream(imgName2));
  const { width, height, dataList } = expand(img1, img2);
  t.is(width, img2.width);
  t.is(height, img2.height);
  t.is(dataList[1], img2.data);
  t.is(dataList[0].length, width * height * 4);
  const png =  new PNG({ width, height });
  png.data = new Buffer(dataList[0]);
  FS.writeFileSync(Path.resolve(__dirname, "images/expand_vertical_generated.png"), PNG.sync.write(png));
});
