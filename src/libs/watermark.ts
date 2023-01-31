// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";

const watermark = async (
  waterMarkTemplate: string,
  file: string,
  output: string,
): Promise<void> => {
  await sharp(file)
    .composite([
      {
        input: waterMarkTemplate,
        density: 500,
      },
    ])
    .toFormat("png")
    .toFile(output);
};

export default watermark;
