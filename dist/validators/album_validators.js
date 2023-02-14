"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
class AlbumValidator {
    constructor() {
        this.createAlbumBody = (req, res, next) => {
            const schema = joi_1.default.object({
                name: joi_1.default.string().required(),
                location: joi_1.default.string().required(),
                datapicker: joi_1.default.string().required(),
            });
            try {
                const value = schema.validate(req.body);
                if (value.error?.message)
                    throw boom_1.default.badData(value.error?.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
        this.uploadPhotosToAlbumBody = (req, res, next) => {
            const bodySchema = joi_1.default.object({
                clients: joi_1.default.string().required(),
                album: joi_1.default.string().required(),
            });
            const fileSchema = joi_1.default.array().required().label("files");
            try {
                const valueBody = bodySchema.validate(req.body);
                if (valueBody.error?.message)
                    throw boom_1.default.badData(valueBody.error?.message);
                const valueFile = fileSchema.validate(req.files);
                if (valueFile.error?.message)
                    throw boom_1.default.badData(valueFile.error?.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = new AlbumValidator();
