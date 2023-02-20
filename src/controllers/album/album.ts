import { RequestHandler } from "express";
import Boom from "@hapi/boom";
import { v4 as uuid } from "uuid";
import path from "path";
import getUserIdFromToken from "../../libs/get_user_id_from_token";
import convertToPng from "../../libs/convert_to_png";
import watermark from "../../libs/watermark";
import thumbnail from "../../libs/thumbnails";
import uploadFileToS3 from "../../libs/s3";
import {
  AlbumWithPhotos,
  CreateAlbumRequest,
  File,
  TypedResponse,
  UploadPhotosRequest,
} from "../../types/types";
import Album from "../../entities/album";
import AlbumRepository from "../../repositories/album";
import Photo from "../../entities/photo";
import PhotoRepository from "../../repositories/photo";
import { PDPAlbum } from "../../data/schema";
// import sendSmsToClients from "../../libs/sms_notification";

const pathToWatermark = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "/templates",
  "wm_template.svg",
);

export default class AlbumController {
  static createAlbum: RequestHandler = async (
    req: CreateAlbumRequest,
    res: TypedResponse<{ message: string; album: PDPAlbum }>,
    next,
  ) => {
    const userId = getUserIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );
    const { name, location, datapicker } = req.body;

    try {
      const createdAt = new Date(
        Date.parse(datapicker),
      ).toJSON() as unknown as Date;

      const newAlbum = new Album(uuid(), name, location, createdAt, userId);

      await AlbumRepository.saveAlbum(newAlbum);

      res.json({ message: "Album created", album: newAlbum });
    } catch (err) {
      next(err);
    }
  };

  static getAlbumById: RequestHandler = async (
    req,
    res: TypedResponse<{ data: AlbumWithPhotos }>,
    next,
  ) => {
    const { albumId } = req.params;

    try {
      const albumWithPhotos = await AlbumRepository.getAlbumWithPhotosById(
        albumId,
      );
      if (!albumWithPhotos) throw Boom.notFound();

      res.json({ data: albumWithPhotos });
    } catch (err) {
      next(err);
    }
  };

  static getAllAlbums: RequestHandler = async (
    req,
    res: TypedResponse<{ data: PDPAlbum[] }>,
    next,
  ) => {
    const userId = getUserIdFromToken(
      req.header("Authorization")?.replace("Bearer ", "")!,
    );

    try {
      const albums = await AlbumRepository.getAllAlbumsByUserId(userId);

      if (!albums) throw Boom.notFound();

      res.json({ data: albums });
    } catch (err) {
      next(err);
    }
  };

  static uploadPhotosToAlbum: RequestHandler = async (
    req: UploadPhotosRequest,
    res: TypedResponse<{ message: string }>,
    next,
  ) => {
    const albumId = req.body.album;
    const { clients } = req.body;
    const files = req.files as File[];

    try {
      files.forEach(async (f) => {
        let file = f.buffer;
        let extName = f.originalname.split(".").pop()?.toLowerCase();

        if (f.originalname.split(".").pop()?.toLowerCase() === "heic") {
          file = await convertToPng(file);
          extName = "png";
        }

        const markedFile = await watermark(pathToWatermark, file);
        const thmbOriginal = await thumbnail(file);
        const thmbMarked = await thumbnail(markedFile);

        const newPhoto = new Photo(
          uuid(),
          albumId,
          await uploadFileToS3(thmbMarked, "jpeg"),
          await uploadFileToS3(markedFile, extName!),
          await uploadFileToS3(thmbOriginal, "jpeg"),
          await uploadFileToS3(file, extName!),
          clients,
        );

        await PhotoRepository.savePhoto(newPhoto);
      });

      // clients.split(",").forEach(async (phone: string) => {
      //   // eslint-disable-next-line no-param-reassign
      //   if (phone[0] !== "+") phone = `+${phone}`;
      //   await sendSmsToClients(phone).catch((err) => {
      //     throw new Error(err);
      //   });
      // });

      res.json({ message: "Photos are uploading." });
    } catch (err) {
      next(err);
    }
  };
}
