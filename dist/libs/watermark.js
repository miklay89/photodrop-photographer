"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const watermark = async (waterMarkTemplate, file) => {
    const meta = await (0, sharp_1.default)(file).metadata();
    const wmH = parseInt((meta.height * 0.41).toFixed());
    const wmImage = await (0, sharp_1.default)(waterMarkTemplate)
        .resize(null, wmH)
        .png()
        .toBuffer();
    const newFile = await (0, sharp_1.default)(file)
        .composite([
        {
            input: wmImage,
        },
    ])
        .toFormat("png")
        .toBuffer();
    return newFile;
};
exports.default = watermark;
