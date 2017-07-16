#!/usr/bin/env node

const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
const { imgDiff } = require("../");
const imageDiff = require("image-diff");
const imageDifference = require("image-difference").default;

function imageDiffPromise(options) {
  return new Promise((resolve, reject) => {
    imageDiff({
      actualImage: options.actualFilename,
      expectedImage: options.expectedFilename,
      diffImage: options.diffFilename,
    }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    })
  });
}

function wrapLap(name, p) {
  return () => {
    const st = Date.now();
    return p().then(() => {
      const end = Date.now();
      const elapse = end - st;
      return { name, time: elapse };
    });
  };
}

function comparisonComparison(opt) {
  return () => {
    const { actualFilename, expectedFilename } = opt;
    const subdirName = opt.name.replace(/\s+/g, "_");
    const arr = new Array(opt.iterationCount || 50).join("+").split("+").map((_, i) => i);

    const p1 = () => Promise.all(arr.map(i => imgDiff({ actualFilename, expectedFilename, diffFilename: `.performance/${subdirName}/diff_1_${i}.png` })));
    const p2 = () => Promise.all(arr.map(i => imageDifference({ actualFilename, expectedFilename, diffFilename: `.performance/${subdirName}/diff_2_${i}.png` })));
    const p3 = () => Promise.all(arr.map(i => imageDiffPromise({ actualFilename, expectedFilename, diffFilename: `.performance/${subdirName}/diff_3_${i}.png` })));

    mkdirp.sync(`.performance/${subdirName}`);
    return [ 
      wrapLap("img-diff-js", p1),
      wrapLap("image-difference", p2),
      wrapLap("image-diff", p3),
    ]
      .reduce((queue, p) => queue.then(result => p().then(x => [...result, x])), Promise.resolve([]))
      .then(results => ({ name: opt.name, results }))
    ;
  };
}

rimraf.sync(".performance");
mkdirp.sync(".performance");

function images(strings, ...values) {
  return path.resolve(__dirname, "../test/images/" + strings[0]);
}

[
  comparisonComparison({ name: "50 same dimension PNGs", actualFilename: images `actual.png`, expectedFilename: images `expected.png` }),
  comparisonComparison({ name: "50 different dimension PNGs", actualFilename: images `actual_wide.png`, expectedFilename: images `expected.png` }),
  comparisonComparison({ name: "50 same dimension JPEGs", actualFilename: images `actual.jpg`, expectedFilename: images `expected.jpg` }),
]
  .reduce((queue, p) => queue.then(x => p().then(y => [...x, y])), Promise.resolve([]))
  .then(resuletsList => {
    console.log(["", "case name", ...resuletsList[0].results.map(r => r.name), ""].join(" | "));
    console.log([" ", ":---", ...resuletsList[0].results.map(() => "---:"), ""].join("|"));
    resuletsList.forEach(item => {
      console.log(["", item.name, ...item.results.map(r => r.time + " msec"), ""].join(" | "));
    });
  })
;
