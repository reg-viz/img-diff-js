import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { imgDiff } from "./";

test("compare with 2 png files", async () => {
  const diffFilename = path.resolve(__dirname, "../test-images/diff_generated.png");
  rimraf.sync(diffFilename);
  await imgDiff({
    actualFilename: path.resolve(__dirname, "../test-images/actual.png"),
    expectedFilename: path.resolve(__dirname, "../test-images/expected.png"),
  });
  expect(() => fs.statSync(path.resolve(__dirname, "../test-images/diff_generated.png"))).toThrowError();
  const { imagesAreSame } = await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "../test-images/actual.png"),
    expectedFilename: path.resolve(__dirname, "../test-images/expected.png"),
  });
  expect(imagesAreSame).toBe(false);
  expect(fs.statSync(path.resolve(__dirname, "../test-images/diff_generated.png"))).toBeTruthy();
});

test("compare with 2 same files", async () => {
  const { imagesAreSame } = await imgDiff({
    actualFilename: path.resolve(__dirname, "../test-images/expected.png"),
    expectedFilename: path.resolve(__dirname, "../test-images/expected.png"),
  });
  expect(imagesAreSame).toBe(true);
});

test("compare with 2 files whose dimension are different", async () => {
  const diffFilename = path.resolve(__dirname, "../test-images/diff_generated.wide.png");
  rimraf.sync(diffFilename);
  await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "../test-images/actual_wide.png"),
    expectedFilename: path.resolve(__dirname, "../test-images/expected.png"),
  });
  expect(fs.statSync(path.resolve(__dirname, "../test-images/diff_generated.wide.png"))).toBeTruthy();
});

test("compare with 2 jpeg files", async () => {
  const diffFilename = path.resolve(__dirname, "../test-images/diff_generated.tiff.png");
  rimraf.sync(diffFilename);
  await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "../test-images/actual.tiff"),
    expectedFilename: path.resolve(__dirname, "../test-images/expected.tiff"),
  });
  expect(fs.statSync(path.resolve(__dirname, "../test-images/diff_generated.tiff.png"))).toBeTruthy();
});

test("compare with 2 jpeg files", async () => {
  const diffFilename = path.resolve(__dirname, "../test-images/diff_generated.jpg.png");
  rimraf.sync(diffFilename);
  await imgDiff({
    diffFilename,
    actualFilename: path.resolve(__dirname, "../test-images/actual.jpg"),
    expectedFilename: path.resolve(__dirname, "../test-images/expected.jpg"),
  });
  expect(fs.statSync(path.resolve(__dirname, "../test-images/diff_generated.jpg.png"))).toBeTruthy();
});

describe("threshold pattern", () => {
  test("no option object", async () => {
    const result = await imgDiff({
      actualFilename: path.resolve(__dirname, "../test-images/actual.png"),
      expectedFilename: path.resolve(__dirname, "../test-images/expected.png"),
    });
    expect(result.imagesAreSame).toBeFalsy();
  });

  test("threshold is undefined", async () => {
    const result = await imgDiff({
      actualFilename: path.resolve(__dirname, "../test-images/actual.png"),
      expectedFilename: path.resolve(__dirname, "../test-images/expected.png"),
      options: {},
    });
    expect(result.imagesAreSame).toBeFalsy();
  });

  test("set threshold explicitly", async () => {
    const result = await imgDiff({
      actualFilename: path.resolve(__dirname, "../test-images/actual.png"),
      expectedFilename: path.resolve(__dirname, "../test-images/expected.png"),
      options: {
        threshold: 1.0,
      },
    });
    expect(result.imagesAreSame).toBeTruthy();
  });
});
