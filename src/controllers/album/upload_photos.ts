import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import path from "path";
import { v4 as uuid } from "uuid";
import { IFile, IPhoto } from "./types";
import convertToPng from "../../libs/convert_to_png";
import watermark from "../../libs/watermark";
import thumbnail from "../../libs/thumbnails";
import uploadFileToS3 from "../../libs/s3";

import dbObject from "../../data/db";

const db = dbObject.Connector;
const { photosTable } = dbObject.Tables;
const pathToWatermark = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "/templates",
  "wm_template.svg",
);

// insert photos to table
async function insertPhotoToDB(photo: IPhoto) {
  await db.insert(photosTable).values(photo);
}

// uploads controller
const uploadPhotosController: RequestHandler = async (req, res) => {
  try {
    // data from client-side
    const albumId = req.body.album;
    if (!albumId) throw new Error("Field album is required");
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
    files.forEach(async (f: IFile) => {
      let file = f.buffer;
      let extName = f.originalname.split(".").pop()?.toLowerCase();
      console.log(typeof file);
      if (f.originalname.split(".").pop()?.toLowerCase() === "heic") {
        file = await convertToPng(file);
        extName = "png";
      }

      const markedFile = await watermark(pathToWatermark, file);
      const thmbOriginal = await thumbnail(file);
      const thmbMarked = await thumbnail(markedFile);
      console.log("files converted and created");
      const newPhoto = {
        photoId: uuid(),
        albumId,
        lockedThumbnailUrl: await uploadFileToS3(thmbMarked, "jpeg"),
        lockedPhotoUrl: await uploadFileToS3(markedFile, extName as string),
        unlockedThumbnailUrl: await uploadFileToS3(thmbOriginal, "jpeg"),
        unlockedPhotoUrl: await uploadFileToS3(file, extName as string),
        clients: clients.join(","),
      };
      // console.log("files uploaded");
      console.log(newPhoto);
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
