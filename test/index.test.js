import fs from "fs";
import path from "path";
import test from "ava";
import rimraf from "rimraf";
import { imgDiff } from "../";

test("compare from 2 png files", async t => {
  const diffFilename = path.resolve(__dirname, "images/diff_generated.png");
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "images/actual.png"),
    expectedFilename: path.resolve(__dirname, "images/expected.png"),
  });
  t.truthy(fs.statSync(path.resolve(__dirname, "images/diff_generated.png")));
});

test("compare from 2 jpeg files", async t => {
  const diffFilename = path.resolve(__dirname, "images/diff_generated.jpg.png");
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "images/actual.jpg"),
    expectedFilename: path.resolve(__dirname, "images/expected.jpg"),
  });
  t.truthy(fs.statSync(path.resolve(__dirname, "images/diff_generated.jpg.png")));
});
