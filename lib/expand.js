function createExpandedData(originalImage, width, height) {
  if (originalImage.width === width && originalImage.height === height) {
    return originalImage.data;
  }
  const origWidth = originalImage.width;
  const origHeight = originalImage.height;
  const origData = originalImage.data;
  const newData = new Uint8Array(width * height * 4);
  let idx = 0;
  for (let j = 0; j < height; j++) {
    if (j < origHeight) {
      for (let i = 0; i < width; i++) {
        idx = ((j * width) + i) << 2;
        if (i < origWidth) {
          const origIdx = (j * origWidth + i) << 2;
          newData[idx] = origData[origIdx];
          newData[idx + 1] = origData[origIdx + 1];
          newData[idx + 2] = origData[origIdx + 2];
          newData[idx + 3] = origData[origIdx + 3];
        }
      }
    }
  }
  return newData;
}

function expand(img1, img2) {
  if (img1.width === img2.width && img1.height === img2.height) {
    return {
      dataList: [img1.data, img2.data],
      width: img1.width,
      height: img1.height,
    };
  }
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);
  return {
    width,
    height,
    dataList: [
      createExpandedData(img1, width, height),
      createExpandedData(img2, width, height),
    ],
  };
}

module.exports = expand;
