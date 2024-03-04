import fs from "node:fs";
import jpeg from "jpeg-js";
import type { ImageData } from "./types";

export default async function decodeJpeg(filename: string) {
  const rawBuffer = await fs.promises.readFile(filename);
  return jpeg.decode(rawBuffer) as ImageData;
}
