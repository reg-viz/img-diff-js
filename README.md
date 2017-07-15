# img-diff-js

Node.js library to compare 2 images without native libs.

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
