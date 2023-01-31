"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const heic_convert_1 = __importDefault(require("heic-convert"));
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const convertToJpeg = async (file, output) => {
    if (file.split(".")[1] === "heic") {
        const inputBuffer = await (0, util_1.promisify)(fs_1.default.readFile)(file);
        const outputBuffer = await (0, heic_convert_1.default)({
            buffer: inputBuffer,
            format: "JPEG",
            quality: 1,
        });
        await (0, util_1.promisify)(fs_1.default.writeFile)(output, outputBuffer);
        await (0, util_1.promisify)(fs_1.default.unlink)(file);
        return output;
    }
    return output;
};
exports.default = convertToJpeg;
