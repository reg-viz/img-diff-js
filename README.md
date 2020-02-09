# img-diff-js
[![CircleCI](https://circleci.com/gh/reg-viz/img-diff-js.svg?style=svg)](https://circleci.com/gh/reg-viz/img-diff-js)
[![Build Status](https://travis-ci.org/reg-viz/img-diff-js.svg?branch=master)](https://travis-ci.org/reg-viz/img-diff-js)
[![Greenkeeper badge](https://badges.greenkeeper.io/reg-viz/img-diff-js.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/img-diff-js.svg)](https://badge.fury.io/js/img-diff-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

:art: Node.js library to compare 2 images without native libs.

| Actual                        | Expected                          | Difference                |
|:-----------------------------:|:---------------------------------:|:-------------------------:|
| ![actual](example/actual.png) | ![expected](example/expected.png) | ![diff](example/diff.png) |

## Install
```sh
npm install img-diff-js
```

```js
const {imgDiff} = require('img-diff-js');

imgDiff({
  actual: 'example/actual.png',
  expected: 'example/expected.png',
  diffFilename: 'example/diff.png',
}).then(result => console.log(result));
```

## API Usage

### `imgDiff(opt: ImgDiffOptions): Promise<ImgDiffResult>`
Create image differential between two images.

#### `ImgDiffOptions`
```ts
{
  actualFilename?: string,
  actualContent?: Buffer | NodeJS.ReadStream,
  actualType?: string,
  actual?: string | Buffer | NodeJS.ReadStream,
  expectedFilename?: string,
  expectedContent?: Buffer | NodeJS.ReadStream,
  expectedType?: string,
  expected?: string | Buffer | NodeJS.ReadStream,
  diffFilename?: string,
  generateOnlyDiffFile?: boolean, //Defaults to false.
  options?: {
    threshold?: number; //Defaults to 0.1.
    includeAA?: boolean; //Defaults to false.
  }
}
```
- `actualFilename` - *Required* - *Mutually exclusive with `actualContent` and `actual`* - Path of actual image file. Must be a string.
- `actualContent` - *Required* - *Mutually exclusive with `actualFilename` and `actual`* - Image data of actual image. Can be either a stream or buffer.
- `actual` - *Required* - *Mutually exclusive with `actualFilename` and `actualContent`* - Combination property of `actualFilename` and `actualContent`. Accepts both a path or data of the actual image. Can be either a stream, string or buffer.
- `actualType` - *Required if `actualContent` is used or `actual` is used with a stream or buffer* - *Optional otherwise* - The mime type of the actual image. If used in a scenario where a mime type can be resolved from the actual image, this property overrides the original mime type. Must be a string that conforms to the regular expression `/^[-\w.]+\/[-\w.]+$/`.
- `expectedFilename` - *Required* - *Mutually exclusive with `expectedContent` and `expected`* - Path of expected image file. Must be a string.
- `expectedContent` - *Required* - *Mutually exclusive with `expectedFilename` and `expected`* - Image data of expected image. Can be either a stream or buffer.
- `expected` - *Required* - *Mutually exclusive with `expectedFilename` and `expectedContent`* - Combination property of `expectedFilename` and `expectedContent`. Accepts both a path or data of the expected image. Can be either a stream, string or buffer.
- `expectedType` - *Required if `expectedContent` is used or `expected` is used with a stream or buffer* - *Optional otherwise* - The mime type of the expected image. If used in a scenario where a mime type can be resolved from the expected image, this property overrides the original mime type. Must be a string that conforms to the regular expression `/^[-\w.]+\/[-\w.]+$/`.
- `diffFilename` - *Optional* - Path to differential image file. If omitted, `imgDiff` does not output image file.
- `generateOnlyDiffFile` - *Optional* - Generate only files with difference
- `options` - *Optional* - An object to pass through [pixelmatch](https://github.com/mapbox/pixelmatch#api).

#### `ImgDiffResult`
```ts
{
  width: number;
  height: number;
  imagesAreSame: boolean;
  diffCount: number;
}
```
- `width` - Differential image's width.
- `height` - Differential image's height.
- `imagesAreSame` - It'll be true only if 2 images are same perfectly.
- `diffCount` - The number of differential pixels.

## Available format
The following codecs are available for input image files.

- [x] png
- [x] jpeg
- [x] tiff (limited. See https://github.com/Quramy/decode-tiff#compatibility )
- [ ] bmp

`imgDiff` detects the input image format from it's extension name. For example, if the input file name ends with ".jpeg", `imgDiff` attempts to decode in JPEG way regardless of the actual file format.

The output image format is PNG only.

## Performance
 | case name | img-diff-js | image-difference | image-diff | 
 |:---|---:|---:|---:|
 | 50 same dimension PNGs | 936 msec | 11018 msec | 16539 msec | 
 | 50 different dimension PNGs | 715 msec | 16077 msec | 16639 msec | 
 | 50 same dimension JPEGs | 1076 msec | 10910 msec | 19078 msec | 

The above table was captured under [Travis-CI](https://travis-ci.org/reg-viz/img-diff-js). If you want the latest result, check the raw log.

## Contributing
Pull requests and issues are welcome. ;)

## License
MIT License. See LICENSE under this repository.
