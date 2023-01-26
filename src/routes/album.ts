import Router from "express";
import checkTokens from "../middlewares/checktoken";
import createAlbumController from "../controllers/album/createalbum";
import getAlbumController from "../controllers/album/getalbum";
import getAllAlbumsController from "../controllers/album/getallalbums";
import uploadPhotosToAlbumController from "../controllers/album/uploadphotostoalbum";

const router = Router();

// create album
router.post("/create-album", checkTokens, createAlbumController);

// get album by album_id
router.get("/get-album/:album_id", checkTokens, getAlbumController);

// get all albums by user_id
router.get("/all/:user_id", checkTokens, getAllAlbumsController);

// TODO add check token middleware
// upload one or multiple photos to album
router.post("/upload-photos", uploadPhotosToAlbumController);

export default router;
