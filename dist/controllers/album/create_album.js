"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../../data/db"));
const db = db_1.default.Connector;
const { albumsTable } = db_1.default.Tables;
const createAlbumController = async (req, res) => {
    try {
        const { userId } = req.body.decode;
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
        if (err instanceof Error) {
            console.log(err.message);
            return res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = createAlbumController;
