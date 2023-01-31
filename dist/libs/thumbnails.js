"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const thumbnail = async (file, output) => {
    await (0, sharp_1.default)(file)
        .jpeg({ quality: 95 })
        .resize(null, 200)
        .toFile(output)
        .catch((err) => console.log(err.message));
};
exports.default = thumbnail;
