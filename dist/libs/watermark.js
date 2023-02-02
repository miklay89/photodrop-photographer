"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const watermark = async (waterMarkTemplate, file) => {
    const newFile = await (0, sharp_1.default)(file)
        .composite([
        {
            input: waterMarkTemplate,
            density: 500,
        },
    ])
        .toFormat("png")
        .toBuffer();
    return newFile;
};
exports.default = watermark;
