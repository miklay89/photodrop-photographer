"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const uploadPhotosController = async (req, res) => {
    try {
        const bodyR = req.body;
        console.log(bodyR);
        const filesR = req.files;
        console.log(filesR);
        return res.json({ bodyR, filesR });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return res.json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = uploadPhotosController;
