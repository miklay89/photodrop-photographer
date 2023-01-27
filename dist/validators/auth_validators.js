"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSignUpBody = exports.checkLoginBody = void 0;
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
const checkLoginBody = (req, res, next) => {
    const schema = joi_1.default.object({
        login: joi_1.default.string()
            .pattern(/^[a-zA-Z_`]/)
            .required(),
        password: joi_1.default.string().alphanum().required(),
    });
    try {
        const value = schema.validate(req.body);
        if (value.error?.message)
            throw new Error(value.error?.message);
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
};
exports.checkLoginBody = checkLoginBody;
const checkSignUpBody = (req, res, next) => {
    const schema = joi_1.default.object({
        login: joi_1.default.string()
            .pattern(/^[a-zA-Z_`]/)
            .required(),
        password: joi_1.default.string().alphanum().required(),
        email: joi_1.default.string(),
        fullName: joi_1.default.string(),
    });
    try {
        const value = schema.validate(req.body);
        if (value.error?.message)
            throw new Error(value.error?.message);
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
};
exports.checkSignUpBody = checkSignUpBody;
