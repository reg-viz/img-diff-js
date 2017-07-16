# img-diff-js

[![CircleCI](https://circleci.com/gh/reg-viz/img-diff-js.svg?style=svg)](https://circleci.com/gh/reg-viz/img-diff-js)
[![Build Status](https://travis-ci.org/reg-viz/img-diff-js.svg?branch=master)](https://travis-ci.org/reg-viz/img-diff-js)
[![npm version](https://badge.fury.io/js/img-diff-js.svg)](https://badge.fury.io/js/img-diff-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)


:art: Node.js library to compare 2 images without native libs.

| Actual | Expected | Difference |
|:---:|:---:|:---:|
| ![actual](example/actual.png) | ![expected](example/expected.png) | ![diff](example/diff.png) |

## Install

```sh
npm install img-diff-js
```

## API Usage

```js
const { imgDiff } = require('img-diff-js');

imgDiff({
  actualFilename: 'example/actual.png',
  expectedFilename: 'example/expected.png',
  diffFilename: 'example/diff.png',
})
.then(result => console.log(result.width, result.height));
```

## Available format

- [x] png
- [x] jpeg
- [ ] bmp
- etc...

## Performance

 | case name | img-diff-js | image-difference | image-diff | 
 |:---|---:|---:|---:|
 | 30 same dimension PNGs | 412 msec | 2765 msec | 3781 msec | 
 | 30 same dimension JPEGs | 528 msec | 4489 msec | 9455 msec || 30 diff PNGs | 519 msec | 6956 msec | 12786 msec | 

The above table was captured under [Travis-CI](https://travis-ci.org/reg-viz/img-diff-js). If you want the latest result, check the raw log.

## License

MIT License. See LICENSE under this repository.
