// eslint-disable-next-line import/no-extraneous-dependencies
import sharp from "sharp";

const thumbnail = async (file: string, output: string) => {
  await sharp(file)
    .jpeg({ quality: 95 })
    .resize(null, 200)
    .toFile(output)
    .catch((err) => console.log(err.message));
};

export default thumbnail;
