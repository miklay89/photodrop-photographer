import Router from "express";
import isAuthorized from "../middlewares/is_authorized";
import upload from "../libs/multer";
import AlbumValidator from "../validators/album_validators";
import AlbumController from "../controllers/album/album";

const router = Router();

// create album
router.post(
  "/create-album",
  isAuthorized,
  AlbumValidator.createAlbumBody,
  AlbumController.createAlbum,
);

// get album by album_id
router.get("/get-album/:albumId", isAuthorized, AlbumController.getAlbumById);

// get all albums by user_id
router.get("/all", isAuthorized, AlbumController.getAllAlbums);

// upload one or multiple photos to album
router.post(
  "/upload-photos",
  isAuthorized,
  upload.array("files"),
  AlbumValidator.uploadPhotosToAlbumBody,
  AlbumController.uploadPhotosToAlbum,
);

export default router;
