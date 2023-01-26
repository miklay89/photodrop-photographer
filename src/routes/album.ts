import Router from "express";
import checkToken from "../libs/check_token";
import upload from "../libs/multer";
import {
  createAlbumBody,
  getAlbumById,
  getAllAlbumsByUserId,
} from "../validators/album_validators";
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
router.get(
  "/get-album/:album_id",
  checkToken,
  getAlbumById,
  getAlbumController,
);

// get all albums by user_id
router.get(
  "/all/:user_id",
  checkToken,
  getAllAlbumsByUserId,
  getAllAlbumsController,
);

// upload one or multiple photos to album
router.post(
  "/upload-photos",
  checkToken,
  upload.array("files"),
  uploadPhotosToAlbumController,
);

export default router;
