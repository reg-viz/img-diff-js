import path from "path";
import fs from "fs";
import rimraf from "rimraf";
import { PNG } from "pngjs";

import decodePng from "./decode-png";
import expand from "./expand";

test("not expand from same dimension images", async () => {
  const img1 = await decodePng(path.resolve(__dirname, "../test-images/actual.png"));
  const img2 = await decodePng(path.resolve(__dirname, "../test-images/expected.png"));
  const { width, height, dataList } = expand(img1, img2);
  expect(width).toBe(img1.width);
  expect(height).toBe(img1.height);
  expect(width).toBe(img2.width);
  expect(height).toBe(img2.height);
  expect(dataList[0]).toBe(img1.data);
  expect(dataList[1]).toBe(img2.data);
});

test("expand horizontal", async () => {
  rimraf.sync(path.resolve(__dirname, "images/expand_horizontal_generated.png"));
  const img1 = await decodePng(path.resolve(__dirname, "../test-images/actual.png"));
  const img2 = await decodePng(path.resolve(__dirname, "../test-images/actual_wide.png"));
  const { width, height, dataList } = expand(img1, img2);
  expect(width).toBe(img2.width);
  expect(height).toBe(img2.height);
  expect(dataList[1]).toBe(img2.data);
  expect(dataList[0].length).toBe(width * height * 4);
  const png = new PNG({ width, height });
  png.data = new Buffer(dataList[0]);
  fs.writeFileSync(path.resolve(__dirname, "../test-images/expand_horizontal_generated.png"), PNG.sync.write(png));
});

test("expand vertical", async () => {
  rimraf.sync(path.resolve(__dirname, "images/expand_vertical_generated.png"));
  const img1 = await decodePng(path.resolve(__dirname, "../test-images/actual.png"));
  const img2 = await decodePng(path.resolve(__dirname, "../test-images/actual_bulk.png"));
  const { width, height, dataList } = expand(img1, img2);
  expect(width).toBe(img2.width);
  expect(height).toBe(img2.height);
  expect(dataList[1]).toBe(img2.data);
  expect(dataList[0].length).toBe(width * height * 4);
  const png = new PNG({ width, height });
  png.data = new Buffer(dataList[0]);
  fs.writeFileSync(path.resolve(__dirname, "../test-images/expand_vertical_generated.png"), PNG.sync.write(png));
});
