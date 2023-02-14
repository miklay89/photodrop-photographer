"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_authorized_1 = __importDefault(require("../middlewares/is_authorized"));
const multer_1 = __importDefault(require("../libs/multer"));
const album_validators_1 = __importDefault(require("../validators/album_validators"));
const album_1 = __importDefault(require("../controllers/album/album"));
const router = (0, express_1.default)();
router.post("/create-album", is_authorized_1.default, album_validators_1.default.createAlbumBody, album_1.default.createAlbum);
router.get("/get-album/:albumId", is_authorized_1.default, album_1.default.getAlbumById);
router.get("/all", is_authorized_1.default, album_1.default.getAllAlbums);
router.post("/upload-photos", is_authorized_1.default, multer_1.default.array("files"), album_validators_1.default.uploadPhotosToAlbumBody, album_1.default.uploadPhotosToAlbum);
exports.default = router;
