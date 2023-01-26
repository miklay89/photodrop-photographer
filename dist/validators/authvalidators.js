"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRefreshTokenBody = exports.checkSignUpBody = exports.checkLoginBody = void 0;
const joi_1 = __importDefault(require("joi"));
const boom_1 = __importDefault(require("@hapi/boom"));
// login body validation
const checkLoginBody = (req, res, next) => {
    var _a, _b;
    const schema = joi_1.default.object({
        login: joi_1.default.string()
            .pattern(/^[a-zA-Z_`]/)
            .required(),
        password: joi_1.default.string().alphanum().required(),
    });
    try {
        const value = schema.validate(req.body);
        if ((_a = value.error) === null || _a === void 0 ? void 0 : _a.message)
            throw new Error((_b = value.error) === null || _b === void 0 ? void 0 : _b.message);
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
};
exports.checkLoginBody = checkLoginBody;
// sign-up body validation
const checkSignUpBody = (req, res, next) => {
    var _a, _b;
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
        if ((_a = value.error) === null || _a === void 0 ? void 0 : _a.message)
            throw new Error((_b = value.error) === null || _b === void 0 ? void 0 : _b.message);
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
};
exports.checkSignUpBody = checkSignUpBody;
// refresh-token body validation
const checkRefreshTokenBody = (req, res, next) => {
    var _a, _b;
    const schema = joi_1.default.object({
        refreshToken: joi_1.default.string().required(),
    });
    try {
        const value = schema.validate(req.body);
        if ((_a = value.error) === null || _a === void 0 ? void 0 : _a.message)
            throw new Error((_b = value.error) === null || _b === void 0 ? void 0 : _b.message);
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json(boom_1.default.badRequest(err.message));
        }
    }
};
exports.checkRefreshTokenBody = checkRefreshTokenBody;
