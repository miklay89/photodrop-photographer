import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { v4 as uuid } from "uuid";
import { IFile, IPhoto } from "./types";
import convertToJpeg from "../../libs/convert_to_jpeg";
import watermark from "../../libs/watermark";
import thumbnail from "../../libs/thumbnails";
import uploadFileToS3 from "../../libs/s3";

import dbObject from "../../data/db";

const db = dbObject.Connector;
const { photosTable } = dbObject.Tables;

// convert file if it heic
async function convertFileIfHeic(file: IFile): Promise<string> {
  if (file.mimetype.split("/")[1].toLowerCase() === "heic") {
    const filePath = path.join(__dirname, "..", "..", "..", file.path);
    const outputFile = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "/uploads",
      `${file.filename.split(".")[0]}.jpeg`,
    );

    const res = await convertToJpeg(filePath, outputFile);
    return res;
  }
  return path.join(__dirname, "..", "..", "..", "/uploads", file.filename);
}
// add watermark
async function createWatermark(file: string): Promise<string> {
  const watermarkTemplatePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "/templates",
    "wm_template.svg",
  );
  const outputFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "/uploads",
    `wm-${file.split("/").pop()?.split(".")[0]}.png`,
  );
  await watermark(watermarkTemplatePath, file, outputFile);
  return outputFile;
}
// create thumbnail
async function createThumbnail(file: string): Promise<string> {
  const outputFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "/uploads",
    `th-${file.split("/").pop()?.split(".")[0]}.jpeg`,
  );
  await thumbnail(file, outputFile);
  return outputFile;
}
// remove file
async function removeFile(file: string): Promise<void> {
  await promisify(fs.unlink)(file);
}
// insert photos to table
async function insertPhotoToDB(photo: IPhoto) {
  await db.insert(photosTable).values(photo);
}

// uploads controller
const uploadPhotosController: RequestHandler = async (req, res) => {
  try {
    // data from client-side
    const albumId = req.body.album;
    const clients: string[] = [];
    const files = req.files as IFile[];

    // storing clients from body to array
    Object.entries(req.body).forEach((entry) => {
      const [key, value] = entry;
      if (key.includes("clients") && Array.isArray(value)) {
        clients.push(...value);
      } else if (key.includes("clients") && !Array.isArray(value)) {
        clients.push(value as string);
      }
    });

    // converting + creating watermark + thumbnails + uploading + storing to DB
    files.forEach(async (file) => {
      const originalFile = await convertFileIfHeic(file);
      const markedFile = await createWatermark(originalFile);
      const thmbOriginal = await createThumbnail(originalFile);
      const thmbMarked = await createThumbnail(markedFile);
      console.log("files converted and created");
      const newPhoto = {
        photoId: uuid(),
        albumId,
        lockedThumbnailUrl: await uploadFileToS3(thmbMarked),
        lockedPhotoUrl: await uploadFileToS3(markedFile),
        unlockedThumbnailUrl: await uploadFileToS3(thmbOriginal),
        unlockedPhotoUrl: await uploadFileToS3(originalFile),
        clients: clients.join(","),
      };
      console.log("files uploaded");
      // remove files after storing in s3
      await removeFile(originalFile);
      await removeFile(markedFile);
      await removeFile(thmbOriginal);
      await removeFile(thmbMarked);
      console.log("files deleted");
      // storing photos in db - photos_table
      await insertPhotoToDB(newPhoto);
      console.log("files stored in DB");
    });

    // res for user
    res.json({ message: "Photos are uploading." });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(400).json(Boom.badRequest(err.message));
    }
  }
  return null;
};

export default uploadPhotosController;
