# img-diff-js

[![CircleCI](https://circleci.com/gh/reg-viz/img-diff-js.svg?style=svg)](https://circleci.com/gh/reg-viz/img-diff-js)
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
const { imageDiff } = require('image-diff-js');

imageDiff({
  actualFilename: 'example/actual.png',
  expectedFilename: 'example/expected.png',
  diffFilename: 'example/diff.png',
})
.then(result => console.log(result.width, result.height));
```

## License

MIT License. See LICENSE under this repository.
