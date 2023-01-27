import Router from "express";
import checkToken from "../libs/check_token";
import upload from "../libs/multer";
import { createAlbumBody } from "../validators/album_validators";
import createAlbumController from "../controllers/album/create_album";
import getAlbumController from "../controllers/album/get_album";
import getAllAlbumsController from "../controllers/album/get_all_albums";
import uploadPhotosToAlbumController from "../controllers/album/upload_photos";

const router = Router();

// create album
router.post(
  "/create-album",
  checkToken,
  createAlbumBody,
  createAlbumController,
);

// get album by album_id
router.get("/get-album/:album_id", checkToken, getAlbumController);

// get all albums by user_id
router.get("/all", checkToken, getAllAlbumsController);

// upload one or multiple photos to album
router.post(
  "/upload-photos",
  checkToken,
  upload.array("files"),
  uploadPhotosToAlbumController,
);

export default router;
