// eslint-disable-next-line import/no-extraneous-dependencies
import convert from "heic-convert";
import { promisify } from "util";
import fs from "fs";

const convertToJpeg = async (file: string, output: string) => {
  if (file.split(".")[1] === "heic") {
    const inputBuffer = await promisify(fs.readFile)(file);

    const outputBuffer = await convert({
      buffer: inputBuffer, // the file buffer
      format: "JPEG", // output format
      quality: 1, // the jpeg compression quality, between 0 and 1
    });
    await promisify(fs.writeFile)(output, outputBuffer as unknown as Buffer);
    // delete heic file
    await promisify(fs.unlink)(file);
    return output;
  }
  return output;
};

export default convertToJpeg;
