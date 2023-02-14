"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const expressions_1 = require("drizzle-orm/expressions");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("../../data/db"));
const get_user_id_from_token_1 = __importDefault(require("../../libs/get_user_id_from_token"));
const convert_to_png_1 = __importDefault(require("../../libs/convert_to_png"));
const watermark_1 = __importDefault(require("../../libs/watermark"));
const thumbnails_1 = __importDefault(require("../../libs/thumbnails"));
const s3_1 = __importDefault(require("../../libs/s3"));
const sms_notification_1 = __importDefault(require("../../libs/sms_notification"));
const db = db_1.default.Connector;
const { albumsTable, photosTable } = db_1.default.Tables;
const pathToWatermark = path_1.default.join(__dirname, "..", "..", "..", "/templates", "wm_template.svg");
class Album {
    constructor() {
        this.createAlbum = async (req, res, next) => {
            try {
                const userId = (0, get_user_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
                const { name, location, datapicker } = req.body;
                const createdAt = new Date(Date.parse(datapicker)).toJSON();
                const newAlbum = {
                    albumId: (0, uuid_1.v4)(),
                    name,
                    location,
                    createdAt: createdAt,
                    userId,
                };
                await db.insert(albumsTable).values(newAlbum);
                return res.json({ message: "Album created", album: newAlbum });
            }
            catch (err) {
                next(err);
            }
            return null;
        };
        this.getAlbumById = async (req, res, next) => {
            try {
                const { albumId } = req.params;
                await db
                    .select(albumsTable)
                    .leftJoin(photosTable, (0, expressions_1.eq)(photosTable.albumId, albumsTable.albumId))
                    .where((0, expressions_1.eq)(albumsTable.albumId, albumId))
                    .then((query) => {
                    if (!query.length)
                        throw boom_1.default.notFound();
                    const album = query.map((q) => q.pd_albums)[0];
                    album.photos = query.map((q) => q.pd_photos);
                    res.json({ data: album });
                });
            }
            catch (err) {
                next(err);
            }
            return null;
        };
        this.getAllAlbums = async (req, res, next) => {
            try {
                const userId = (0, get_user_id_from_token_1.default)(req.header("Authorization")?.replace("Bearer ", ""));
                await db
                    .select(albumsTable)
                    .where((0, expressions_1.eq)(albumsTable.userId, userId))
                    .then((query) => {
                    if (!query.length)
                        throw boom_1.default.notFound();
                    res.json({ data: query });
                });
            }
            catch (err) {
                next(err);
            }
            return null;
        };
        this.uploadPhotosToAlbum = async (req, res, next) => {
            try {
                const albumId = req.body.album;
                const { clients } = req.body;
                const files = req.files;
                files.forEach(async (f) => {
                    let file = f.buffer;
                    let extName = f.originalname.split(".").pop()?.toLowerCase();
                    if (f.originalname.split(".").pop()?.toLowerCase() === "heic") {
                        file = await (0, convert_to_png_1.default)(file);
                        extName = "png";
                    }
                    const markedFile = await (0, watermark_1.default)(pathToWatermark, file);
                    const thmbOriginal = await (0, thumbnails_1.default)(file);
                    const thmbMarked = await (0, thumbnails_1.default)(markedFile);
                    const newPhoto = {
                        photoId: (0, uuid_1.v4)(),
                        albumId,
                        lockedThumbnailUrl: await (0, s3_1.default)(thmbMarked, "jpeg"),
                        lockedPhotoUrl: await (0, s3_1.default)(markedFile, extName),
                        unlockedThumbnailUrl: await (0, s3_1.default)(thmbOriginal, "jpeg"),
                        unlockedPhotoUrl: await (0, s3_1.default)(file, extName),
                        clients,
                    };
                    await db.insert(photosTable).values(newPhoto);
                });
                clients.split(",").forEach(async (phone) => {
                    if (phone[0] !== "+")
                        phone = `+${phone}`;
                    await (0, sms_notification_1.default)(phone);
                });
                res.json({ message: "Photos are uploading." });
            }
            catch (err) {
                next(err);
            }
            return null;
        };
    }
}
exports.default = new Album();
