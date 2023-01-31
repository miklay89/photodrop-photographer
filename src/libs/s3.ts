// eslint-disable-next-line import/no-extraneous-dependencies
import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME as string;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const uploadFileToS3 = async (file: string) => {
  const fileBuffer = await promisify(fs.readFile)(file);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: `photographer/${file.split("/").pop() as string}`,
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Location;
};

export default uploadFileToS3;
