"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const tokenSecret = process.env.TOKEN_SECRET;
const checkTokens = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error("Invalid token.");
        }
        const decode = jsonwebtoken_1.default.verify(token, tokenSecret);
        req.body.decode = decode;
        next();
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(401).json(boom_1.default.unauthorized(err.message));
        }
    }
};
exports.default = checkTokens;
