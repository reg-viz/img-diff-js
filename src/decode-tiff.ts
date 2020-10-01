import fs from "fs";
import { ImageData } from "./types";

const { decode } = require("decode-tiff") as { decode: (buffer: ArrayBuffer | Buffer) => ImageData };

export default async function decodeTiff(filename: string) {
  const rawBuffer = await fs.promises.readFile(filename);
  return decode(rawBuffer);
}
