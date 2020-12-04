import fs from "fs";
import path from "path";
import pixelmatch, { PixelmatchOptions } from "pixelmatch";
import { PNG } from "pngjs";
import mkdirp from "mkdirp";

import { ImageData, Decorder, ImgDiffOptions, ImgDiffResult } from "./types";
import decodePng from "./decode-png";
import decodeJpeg from "./decode-jpeg";
import decodeTiff from "./decode-tiff";
import expand from "./expand";

const extensionDecoderMap: Record<string, Decorder> = {};

export function registerDecoder(extensions: string[], decoder: Decorder) {
  extensions.forEach(extension => {
    if (!extension.startsWith(".")) {
      extension = `.${extension}`;
    }
    extensionDecoderMap[extension] = decoder;
  });
}

function decode(filename: string) {
  const ext = path.extname(filename);
  const decoder = extensionDecoderMap[ext];
  if (!ext || !decoder) {
    const exts = Object.keys(extensionDecoderMap).join(", ");
    throw new Error("File name should be end with " + exts);
  }
  return decoder(filename);
}

registerDecoder(["png"], decodePng);
registerDecoder(["jpg", "jpeg"], decodeJpeg);
registerDecoder(["tiff"], decodeTiff);

function compare(
  img1: ImageData,
  img2: ImageData,
  diffFilename?: string,
  generateOnlyDiffFile: boolean = false,
  options: PixelmatchOptions = { threshold: 0.1, includeAA: false },
): Promise<ImgDiffResult> {
  const { dataList, width, height } = expand(img1, img2);
  const diff = new PNG({ width, height });
  const pmOpt: PixelmatchOptions = {
    threshold: 0,
    ...options,
  };

  const count = pixelmatch(dataList[0], dataList[1], diff.data, width, height, pmOpt);
  const imagesAreSame = count === 0;
  const result = {
    width,
    height,
    imagesAreSame,
    diffCount: count,
  };
  if (!diffFilename) {
    return Promise.resolve(result);
  }

  if (imagesAreSame && generateOnlyDiffFile) {
    return Promise.resolve(result);
  }

  mkdirp.sync(path.dirname(diffFilename));
  const out = fs.createWriteStream(diffFilename);
  const p = new Promise<ImgDiffResult>((resolve, reject) => {
    out.on("finish", () => resolve(result)).on("error", err => reject(err));
  });
  diff.pack().pipe(out);

  return p;
}

export function imgDiff(opt: ImgDiffOptions) {
  return Promise.all([decode(opt.actualFilename), decode(opt.expectedFilename)]).then(imgs => {
    return compare(imgs[0], imgs[1], opt.diffFilename, opt.generateOnlyDiffFile, opt.options);
  });
}
