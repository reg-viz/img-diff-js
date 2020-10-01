import fs from "fs";
import jpeg from "jpeg-js";
import { ImageData } from "./types";

export default async function decodeJpeg(filename: string) {
  const rawBuffer = await fs.promises.readFile(filename);
  return jpeg.decode(rawBuffer) as ImageData;
}
