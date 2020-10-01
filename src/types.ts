import { PixelmatchOptions } from "pixelmatch";

export interface ImageData {
  width: number;
  height: number;
  data: Uint8Array;
}

export interface Decorder {
  (filename: string): Promise<ImageData>;
}

export interface ImgDiffOptions {
  actualFilename: string;
  expectedFilename: string;
  diffFilename?: string;
  generateOnlyDiffFile?: boolean;
  options?: PixelmatchOptions;
}

export interface ImgDiffResult {
  width: number;
  height: number;
  imagesAreSame: boolean;
  diffCount: number;
}
