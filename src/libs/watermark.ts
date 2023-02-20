import sharp from "sharp";

const watermark = async (waterMarkTemplate: string, file: Buffer) => {
  const meta = await sharp(file).metadata();
  const wmH = parseInt((meta.height! * 0.41).toFixed(), 10);
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
