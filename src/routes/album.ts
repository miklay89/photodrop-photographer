import Router from "express";
import isAuthorized from "../middlewares/is_authorized";
import upload from "../libs/multer";
import AlbumValidator from "../validators/album_validators";
import AlbumController from "../controllers/album/album";

const router = Router();

router.post(
  "/create-album",
  isAuthorized,
  AlbumValidator.createAlbumBody,
  AlbumController.createAlbum,
);
router.get("/get-album/:albumId", isAuthorized, AlbumController.getAlbumById);
router.get("/all", isAuthorized, AlbumController.getAllAlbums);
router.post(
  "/upload-photos",
  isAuthorized,
  upload.array("files"),
  AlbumValidator.uploadPhotosToAlbumBody,
  AlbumController.uploadPhotosToAlbum,
);

export default router;
