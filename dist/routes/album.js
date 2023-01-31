"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const check_token_1 = __importDefault(require("../middlewares/check_token"));
const multer_1 = __importDefault(require("../libs/multer"));
const album_validators_1 = require("../validators/album_validators");
const create_album_1 = __importDefault(require("../controllers/album/create_album"));
const get_album_1 = __importDefault(require("../controllers/album/get_album"));
const get_all_albums_1 = __importDefault(require("../controllers/album/get_all_albums"));
const upload_photos_1 = __importDefault(require("../controllers/album/upload_photos"));
const router = (0, express_1.default)();
router.post("/create-album", check_token_1.default, album_validators_1.createAlbumBody, create_album_1.default);
router.get("/get-album/:album_id", check_token_1.default, get_album_1.default);
router.get("/all", check_token_1.default, get_all_albums_1.default);
router.post("/upload-photos", check_token_1.default, multer_1.default.array("files"), upload_photos_1.default);
exports.default = router;
