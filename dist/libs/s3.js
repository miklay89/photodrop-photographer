"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET;
const s3 = new s3_1.default({
    region,
    accessKeyId,
    secretAccessKey,
});
const uploadFileToS3 = async (file) => {
    const fileBuffer = await (0, util_1.promisify)(fs_1.default.readFile)(file);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: `photographer/${file.split("/").pop()}`,
    };
    const result = await s3.upload(uploadParams).promise();
    return result.Location;
};
exports.default = uploadFileToS3;
