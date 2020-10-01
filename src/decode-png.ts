import fs from "fs";
import { PNG } from "pngjs";
import { ImageData } from "./types";

export default function decodePng(filename: string) {
  return new Promise<ImageData>((resolve, reject) => {
    try {
      fs.createReadStream(filename)
        .pipe(new PNG())
        .on("parsed", function () {
          resolve(this);
        })
        .on("error", function (err) {
          reject(err);
        });
    } catch (e) {
      reject(e);
    }
  });
}
