import path from "path";
import decodeTiff from "./decode-tiff";

test("decode tiff file", async () => {
  const file = path.resolve(__dirname, "../test-images/actual.tiff");
  const jpeg = await decodeTiff(file);
  expect(jpeg.data.length).toBe(jpeg.width * jpeg.height * 4);
});
