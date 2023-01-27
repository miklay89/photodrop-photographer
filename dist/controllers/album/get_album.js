"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const expressions_1 = require("drizzle-orm/expressions");
const db_1 = __importDefault(require("../../data/db"));
const db = db_1.default.Connector;
const { albumsTable } = db_1.default.Tables;
const getAlbumController = async (req, res) => {
    try {
        const albumId = req.params.album_id;
        const album = await db
            .select(albumsTable)
            .where((0, expressions_1.eq)(albumsTable.albumId, albumId));
        return res.json({ data: album });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return res.json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = getAlbumController;