import path from "path";
import decodeJpeg from "./decode-jpeg";

test("decode jpeg file", async () => {
  const file = path.resolve(__dirname, "../test-images/actual.jpg");
  const jpeg = await decodeJpeg(file);
  expect(jpeg.data.length).toBe(jpeg.width * jpeg.height * 4);
});
