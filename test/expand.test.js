import test from "ava";
import path from "path";
import fs from "fs";

const rimraf = require("rimraf");
const { PNG } = require("pngjs");
const decodePng = require("../lib/decode-png").default;
const expand = require("../lib/expand").default;

test("not expand from same dimension images", async t => {
  const img1 = await decodePng(path.resolve(__dirname, "images/actual.png"));
  const img2 = await decodePng(path.resolve(__dirname, "images/expected.png"));
  const { width, height, dataList } = expand(img1, img2);
  t.is(width, img1.width);
  t.is(height, img1.height);
  t.is(width, img2.width);
  t.is(height, img2.height);
  t.is(dataList[0], img1.data);
  t.is(dataList[1], img2.data);
});

test("expand horizontal", async t => {
  rimraf.sync(path.resolve(__dirname, "images/expand_horizontal_generated.png"));
  const img1 = await decodePng(path.resolve(__dirname, "images/actual.png"));
  const img2 = await decodePng(path.resolve(__dirname, "images/actual_wide.png"));
  const { width, height, dataList } = expand(img1, img2);
  t.is(width, img2.width);
  t.is(height, img2.height);
  t.is(dataList[1], img2.data);
  t.is(dataList[0].length, width * height * 4);
  const png =  new PNG({ width, height });
  png.data = new Buffer(dataList[0]);
  fs.writeFileSync(path.resolve(__dirname, "images/expand_horizontal_generated.png"), PNG.sync.write(png));
});

test("expand vertical", async t => {
  rimraf.sync(path.resolve(__dirname, "images/expand_vertical_generated.png"));
  const img1 = await decodePng(path.resolve(__dirname, "images/actual.png"));
  const img2 = await decodePng(path.resolve(__dirname, "images/actual_bulk.png"));
  const { width, height, dataList } = expand(img1, img2);
  t.is(width, img2.width);
  t.is(height, img2.height);
  t.is(dataList[1], img2.data);
  t.is(dataList[0].length, width * height * 4);
  const png =  new PNG({ width, height });
  png.data = new Buffer(dataList[0]);
  fs.writeFileSync(path.resolve(__dirname, "images/expand_vertical_generated.png"), PNG.sync.write(png));
});
