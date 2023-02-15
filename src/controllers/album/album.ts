/* eslint-disable class-methods-use-this */
import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuid } from "uuid";
import path from "path";
import dbObject from "../../data/db";
import getUserIdFromToken from "../../libs/get_user_id_from_token";
import convertToPng from "../../libs/convert_to_png";
import watermark from "../../libs/watermark";
import thumbnail from "../../libs/thumbnails";
import uploadFileToS3 from "../../libs/s3";
// import sendSmsToClients from "../../libs/sms_notification";
import { IFile } from "./types";

const db = dbObject.Connector;
const { albumsTable, photosTable } = dbObject.Tables;

const pathToWatermark = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "/templates",
  "wm_template.svg",
);

class Album {
  public createAlbum: RequestHandler = async (req, res, next) => {
    try {
      const userId = getUserIdFromToken(
        req.header("Authorization")?.replace("Bearer ", "")!,
      );
      const { name, location, datapicker } = req.body;

      const createdAt = new Date(Date.parse(datapicker)).toJSON();

      const newAlbum = {
        albumId: uuid(),
        name,
        location,
        createdAt: createdAt as unknown as Date,
        userId,
      };

      await db.insert(albumsTable).values(newAlbum);

      return res.json({ message: "Album created", album: newAlbum });
    } catch (err) {
      next(err);
    }
    return null;
  };

  public getAlbumById: RequestHandler = async (req, res, next) => {
    try {
      const { albumId } = req.params;
      await db
        .select(albumsTable)
        .leftJoin(photosTable, eq(photosTable.albumId, albumsTable.albumId))
        .where(eq(albumsTable.albumId, albumId))
        .then((query) => {
          if (!query.length) throw Boom.notFound();
          const album: any = query.map((q) => q.pd_albums)[0];
          // eslint-disable-next-line consistent-return, array-callback-return
          if (!query[0].pd_photos?.photoId) {
            album.photos = [];
          } else {
            album.photos = query.map((q) => q.pd_photos);
          }
          res.json({ data: album });
        });
    } catch (err) {
      next(err);
    }
    return null;
  };

  public getAllAlbums: RequestHandler = async (req, res, next) => {
    try {
      const userId = getUserIdFromToken(
        req.header("Authorization")?.replace("Bearer ", "")!,
      );

      await db
        .select(albumsTable)
        .where(eq(albumsTable.userId, userId))
        .then((query) => {
          if (!query.length) throw Boom.notFound();
          res.json({ data: query });
        });
    } catch (err) {
      next(err);
    }
    return null;
  };

  public uploadPhotosToAlbum: RequestHandler = async (req, res, next) => {
    try {
      // data from client-side
      const albumId = req.body.album;
      const { clients } = req.body;
      const files = req.files as IFile[];

      // converting + creating watermark + thumbnails + uploading + storing to DB
      files.forEach(async (f) => {
        let file = f.buffer;
        let extName = f.originalname.split(".").pop()?.toLowerCase();
        // convert from heic if need
        if (f.originalname.split(".").pop()?.toLowerCase() === "heic") {
          file = await convertToPng(file);
          extName = "png";
        }

        const markedFile = await watermark(pathToWatermark, file);
        const thmbOriginal = await thumbnail(file);
        const thmbMarked = await thumbnail(markedFile);

        const newPhoto = {
          photoId: uuid(),
          albumId,
          lockedThumbnailUrl: await uploadFileToS3(thmbMarked, "jpeg"),
          lockedPhotoUrl: await uploadFileToS3(markedFile, extName!),
          unlockedThumbnailUrl: await uploadFileToS3(thmbOriginal, "jpeg"),
          unlockedPhotoUrl: await uploadFileToS3(file, extName!),
          clients,
        };

        // storing photos in db - photos_table
        await db.insert(photosTable).values(newPhoto);
      });

      // clients.split(",").forEach(async (phone: string) => {
      //   // eslint-disable-next-line no-param-reassign
      //   if (phone[0] !== "+") phone = `+${phone}`;
      //   await sendSmsToClients(phone).catch((err) => {
      //     throw new Error(err);
      //   });
      // });

      // res for user
      res.json({ message: "Photos are uploading." });
    } catch (err) {
      next(err);
    }
    return null;
  };
}

export default new Album();
