"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const uuid_1 = require("uuid");
const convert_to_jpeg_1 = __importDefault(require("../../libs/convert_to_jpeg"));
const watermark_1 = __importDefault(require("../../libs/watermark"));
const thumbnails_1 = __importDefault(require("../../libs/thumbnails"));
const s3_1 = __importDefault(require("../../libs/s3"));
const db_1 = __importDefault(require("../../data/db"));
const db = db_1.default.Connector;
const { photosTable } = db_1.default.Tables;
async function convertFileIfHeic(file) {
    if (file.mimetype.split("/")[1].toLowerCase() === "heic") {
        const filePath = path_1.default.join(__dirname, "..", "..", "..", file.path);
        const outputFile = path_1.default.join(__dirname, "..", "..", "..", "/uploads", `${file.filename.split(".")[0]}.jpeg`);
        const res = await (0, convert_to_jpeg_1.default)(filePath, outputFile);
        return res;
    }
    return path_1.default.join(__dirname, "..", "..", "..", "/uploads", file.filename);
}
async function createWatermark(file) {
    const watermarkTemplatePath = path_1.default.join(__dirname, "..", "..", "..", "/templates", "wm_template.svg");
    const outputFile = path_1.default.join(__dirname, "..", "..", "..", "/uploads", `wm-${file.split("/").pop()?.split(".")[0]}.png`);
    await (0, watermark_1.default)(watermarkTemplatePath, file, outputFile);
    return outputFile;
}
async function createThumbnail(file) {
    const outputFile = path_1.default.join(__dirname, "..", "..", "..", "/uploads", `th-${file.split("/").pop()?.split(".")[0]}.jpeg`);
    await (0, thumbnails_1.default)(file, outputFile);
    return outputFile;
}
async function removeFile(file) {
    await (0, util_1.promisify)(fs_1.default.unlink)(file);
}
async function insertPhotoToDB(photo) {
    await db.insert(photosTable).values(photo);
}
const uploadPhotosController = async (req, res) => {
    try {
        const albumId = req.body.album;
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
        files.forEach(async (file) => {
            const originalFile = await convertFileIfHeic(file);
            const markedFile = await createWatermark(originalFile);
            const thmbOriginal = await createThumbnail(originalFile);
            const thmbMarked = await createThumbnail(markedFile);
            const newPhoto = {
                photoId: (0, uuid_1.v4)(),
                albumId,
                lockedThumbnailUrl: await (0, s3_1.default)(thmbMarked),
                lockedPhotoUrl: await (0, s3_1.default)(markedFile),
                unlockedThumbnailUrl: await (0, s3_1.default)(thmbOriginal),
                unlockedPhotoUrl: await (0, s3_1.default)(originalFile),
                clients: clients.join(","),
            };
            await removeFile(originalFile);
            await removeFile(markedFile);
            await removeFile(thmbOriginal);
            await removeFile(thmbMarked);
            await insertPhotoToDB(newPhoto);
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
