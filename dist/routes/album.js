"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checktoken_1 = __importDefault(require("../middlewares/checktoken"));
const createalbum_1 = __importDefault(require("../controllers/album/createalbum"));
const getalbum_1 = __importDefault(require("../controllers/album/getalbum"));
const getallalbums_1 = __importDefault(require("../controllers/album/getallalbums"));
const uploadphotostoalbum_1 = __importDefault(require("../controllers/album/uploadphotostoalbum"));
const router = (0, express_1.default)();
// create album
router.post("/create-album", checktoken_1.default, createalbum_1.default);
// get album by album_id
router.get("/get-album/:album_id", checktoken_1.default, getalbum_1.default);
// get all albums by user_id
router.get("/all/:user_id", checktoken_1.default, getallalbums_1.default);
// TODO add check token middleware
// upload one or multiple photos to album
router.post("/upload-photos", uploadphotostoalbum_1.default);
exports.default = router;
