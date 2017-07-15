#!/usr/bin/env node

const path = require("path");
const rimraf = require("rimraf");
const mkdirp = require("mkdirp");
const { imgDiff } = require("../");
const imageDiff = require("image-diff");
const imageDifference = require("image-difference").default;

function comparisonComparison(opt) {
  return () => {
    const { actualFilename, expectedFilename } = opt;

    rimraf.sync(".performance");
    mkdirp.sync(".performance");

    const arr = new Array(opt.iterationCount || 30).join("+").split("+").map((_, i) => i);

    const imageDiffPromise = (options) => {
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
    };

    const p1 = () => Promise.all(arr.map(i => imgDiff({ actualFilename, expectedFilename, diffFilename: `.performance/diff_1_${i}.png` })));
    const p2 = () => Promise.all(arr.map(i => imageDifference({ actualFilename, expectedFilename, diffFilename: `.performance/diff_2_${i}.png` })));
    const p3 = () => Promise.all(arr.map(i => imageDiffPromise({ actualFilename, expectedFilename, diffFilename: `.performance/diff_3_${i}.png` })));

    const wrapLogElapsedTime = (name, p) => {
      return () => {
        const st = Date.now();
        // console.log(`start ${name}`);
        return p().then(() => {
          const end = Date.now();
          const elapse = end - st;
          // console.log(`${name} elapsed time: ${elapse} msec.`);
          return { name, time: elapse };
        });
      };
    };

    return [ 
      wrapLogElapsedTime("img-diff-js", p1),
      wrapLogElapsedTime("image-difference", p2),
      wrapLogElapsedTime("image-diff", p3),
    ].reduce((queue, p) => {
      return queue.then(result => p().then(x => [...result, x]));
    }, Promise.resolve([]))
    .then(results => ({ name: opt.name, results }))
    ;
  };
}

const actualFilename = path.resolve(__dirname, "../example/actual.png");
const expectedFilename = path.resolve(__dirname, "../example/expected.png");

[
  comparisonComparison({ name: "30 same PNGs", actualFilename: path.resolve(__dirname, "../example/actual.png"), expectedFilename: path.resolve(__dirname, "../example/actual.png") }),
  comparisonComparison({ name: "30 diff PNGs", actualFilename: path.resolve(__dirname, "../example/actual.png"), expectedFilename: path.resolve(__dirname, "../example/expected.png") }),
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
