"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
class AuthValidator {
    constructor() {
        this.checkLoginBody = (req, res, next) => {
            const schema = joi_1.default.object({
                login: joi_1.default.string()
                    .pattern(/^[a-zA-Z_`]/)
                    .required(),
                password: joi_1.default.string().alphanum().required(),
            });
            try {
                const value = schema.validate(req.body);
                if (value.error?.message)
                    throw boom_1.default.badData(value.error.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
        this.checkSignUpBody = (req, res, next) => {
            const schema = joi_1.default.object({
                login: joi_1.default.string()
                    .pattern(/^[a-zA-Z_]+$/, { name: "letters and underscore" })
                    .required(),
                password: joi_1.default.string().alphanum().required(),
                email: joi_1.default.string(),
                fullName: joi_1.default.string(),
            });
            try {
                const value = schema.validate(req.body);
                if (value.error?.message)
                    throw boom_1.default.badData(value.error.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
        this.checkCookies = (req, res, next) => {
            try {
                const schema = joi_1.default.object({
                    refreshToken: joi_1.default.string().required(),
                });
                const value = schema.validate(req.cookies);
                if (value.error?.message)
                    throw boom_1.default.badData(value.error?.message);
                next();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = new AuthValidator();
