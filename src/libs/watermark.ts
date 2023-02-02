// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";

const watermark = async (
  waterMarkTemplate: string,
  file: Buffer,
): Promise<Buffer> => {
  const newFile = await sharp(file)
    .composite([
      {
        input: waterMarkTemplate,
        density: 500,
      },
    ])
    .toFormat("png")
    .toBuffer();
  return newFile;
};

export default watermark;
