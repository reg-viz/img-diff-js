import fs from "fs";
import path from "path";
import test from "ava";
import rimraf from "rimraf";
import { imgDiff } from "./";

test("create difference file", async t => {
  const diffFilename = path.resolve(__dirname, "../example/diff_generated.png");
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "../example/actual.png"),
    expectedFilename: path.resolve(__dirname, "../example/expected.png"),
  });
  t.truthy(typeof width === "number");
  t.truthy(typeof height === "number");
  t.truthy(fs.statSync(path.resolve(__dirname, "../example/diff_generated.png")));
});
