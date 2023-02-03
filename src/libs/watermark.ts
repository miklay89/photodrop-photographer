// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";

const watermark = async (
  waterMarkTemplate: string,
  file: Buffer,
): Promise<Buffer> => {
  const meta = await sharp(file).metadata();
  // eslint-disable-next-line radix
  const wmH = parseInt((meta.height! * 0.41).toFixed());
  const wmImage = await sharp(waterMarkTemplate)
    .resize(null, wmH)
    .png()
    .toBuffer();
  const newFile = await sharp(file)
    .composite([
      {
        input: wmImage,
      },
    ])
    .toFormat("png")
    .toBuffer();
  return newFile;
};

export default watermark;
