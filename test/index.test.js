import fs from "fs";
import path from "path";
import test from "ava";
import rimraf from "rimraf";
import { imgDiff } from "../";

test("compare with 2 png files", async t => {
  const diffFilename = path.resolve(__dirname, "images/diff_generated.png");
  rimraf.sync(diffFilename);
  await imgDiff({
    actualFilename: path.resolve(__dirname, "images/actual.png"),
    expectedFilename: path.resolve(__dirname, "images/expected.png"),
  });
  t.throws(() => fs.statSync(path.resolve(__dirname, "images/diff_generated.png")));
  const { imagesAreSame } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "images/actual.png"),
    expectedFilename: path.resolve(__dirname, "images/expected.png"),
  });
  t.is(imagesAreSame, false);
  t.truthy(fs.statSync(path.resolve(__dirname, "images/diff_generated.png")));
});

test("compare with 2 same files", async t => {
  const { imagesAreSame } = await imgDiff({
    actualFilename: path.resolve(__dirname, "images/expected.png"),
    expectedFilename: path.resolve(__dirname, "images/expected.png"),
  });
  t.is(imagesAreSame, true);
});

test("compare with 2 files whose dimension are different", async t => {
  const diffFilename = path.resolve(__dirname, "images/diff_generated.wide.png");
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "images/actual_wide.png"),
    expectedFilename: path.resolve(__dirname, "images/expected.png"),
  });
  t.truthy(fs.statSync(path.resolve(__dirname, "images/diff_generated.wide.png")));
});

test("compare with 2 jpeg files", async t => {
  const diffFilename = path.resolve(__dirname, "images/diff_generated.tiff.png");
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "images/actual.tiff"),
    expectedFilename: path.resolve(__dirname, "images/expected.tiff"),
  });
  t.truthy(fs.statSync(path.resolve(__dirname, "images/diff_generated.tiff.png")));
});

test("compare with 2 jpeg files", async t => {
  const diffFilename = path.resolve(__dirname, "images/diff_generated.jpg.png");
  rimraf.sync(diffFilename);
  const { width, height } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "images/actual.jpg"),
    expectedFilename: path.resolve(__dirname, "images/expected.jpg"),
  });
  t.truthy(fs.statSync(path.resolve(__dirname, "images/diff_generated.jpg.png")));
});

test("call preprocess hook", async t => {
  let called = false;
  await imgDiff({
    actualFilename: path.resolve(__dirname, "images/expected.png"),
    expectedFilename: path.resolve(__dirname, "images/expected.png"),
    options: {
      preprocess: ([img1, img2]) => {
        called = !!img1 && !!img2;
      },
    },
  });
  t.is(called, true);
});

test("call preprocess hook with promiss", async t => {
  let called = false;
  await imgDiff({
    actualFilename: path.resolve(__dirname, "images/expected.png"),
    expectedFilename: path.resolve(__dirname, "images/expected.png"),
    options: {
      preprocess: ([img1, img2]) => {
        called = !!img1 && !!img2;
        return Promise.resolve([img2, img1]);
      },
    },
  });
  t.is(called, true);
});
