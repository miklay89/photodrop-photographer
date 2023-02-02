"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const convert_to_png_1 = __importDefault(require("../../libs/convert_to_png"));
const watermark_1 = __importDefault(require("../../libs/watermark"));
const thumbnails_1 = __importDefault(require("../../libs/thumbnails"));
const s3_1 = __importDefault(require("../../libs/s3"));
const db_1 = __importDefault(require("../../data/db"));
const db = db_1.default.Connector;
const { photosTable } = db_1.default.Tables;
const pathToWatermark = path_1.default.join(__dirname, "..", "..", "..", "/templates", "wm_template.svg");
async function insertPhotoToDB(photo) {
    await db.insert(photosTable).values(photo);
}
const uploadPhotosController = async (req, res) => {
    try {
        const albumId = req.body.album;
        if (!albumId)
            throw new Error("Field album is required");
        const clients = [];
        const files = req.files;
        Object.entries(req.body).forEach((entry) => {
            const [key, value] = entry;
            if (key.includes("clients") && Array.isArray(value)) {
                clients.push(...value);
            }
            else if (key.includes("clients") && !Array.isArray(value)) {
                clients.push(value);
            }
        });
        files.forEach(async (f) => {
            let file = f.buffer;
            let extName = f.originalname.split(".").pop()?.toLowerCase();
            console.log(typeof file);
            if (f.originalname.split(".").pop()?.toLowerCase() === "heic") {
                file = await (0, convert_to_png_1.default)(file);
                extName = "png";
            }
            const markedFile = await (0, watermark_1.default)(pathToWatermark, file);
            const thmbOriginal = await (0, thumbnails_1.default)(file);
            const thmbMarked = await (0, thumbnails_1.default)(markedFile);
            console.log("files converted and created");
            const newPhoto = {
                photoId: (0, uuid_1.v4)(),
                albumId,
                lockedThumbnailUrl: await (0, s3_1.default)(thmbMarked, "jpeg"),
                lockedPhotoUrl: await (0, s3_1.default)(markedFile, extName),
                unlockedThumbnailUrl: await (0, s3_1.default)(thmbOriginal, "jpeg"),
                unlockedPhotoUrl: await (0, s3_1.default)(file, extName),
                clients: clients.join(","),
            };
            console.log(newPhoto);
            await insertPhotoToDB(newPhoto);
            console.log("files stored in DB");
        });
        res.json({ message: "Photos are uploading." });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = uploadPhotosController;
