"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressions_1 = require("drizzle-orm/expressions");
const boom_1 = __importDefault(require("@hapi/boom"));
const db_1 = __importDefault(require("../../data/db"));
const jwt_generator_1 = __importDefault(require("../../libs/jwt_generator"));
const db = db_1.default.Connector;
const { sessionsTable } = db_1.default.Tables;
const refreshTokensController = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        const timeStamp = new Date(Date.now()).toJSON();
        const sessionIsExist = await db
            .select(sessionsTable)
            .where((0, expressions_1.eq)(sessionsTable.refreshToken, refreshToken));
        if (!sessionIsExist.length)
            return res.status(401).json(boom_1.default.badRequest("Invalid refresh token."));
        if (Date.parse(timeStamp) >=
            Date.parse(sessionIsExist[0].expiresIn)) {
            await db
                .delete(sessionsTable)
                .where((0, expressions_1.eq)(sessionsTable.sessionId, sessionIsExist[0].sessionId));
            return res
                .status(401)
                .json(boom_1.default.badRequest("Session is expired, please log-in."));
        }
        const newTokens = (0, jwt_generator_1.default)(sessionIsExist[0].userId);
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
        const newSession = {
            sessionId: sessionIsExist[0].sessionId,
            userId: sessionIsExist[0].userId,
            refreshToken: newTokens.refreshToken,
            expiresIn: sessionExpireTimestamp,
        };
        await db
            .update(sessionsTable)
            .set(newSession)
            .where((0, expressions_1.eq)(sessionsTable.sessionId, newSession.sessionId));
        return res
            .cookie("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })
            .json({ accessToken: newTokens.accessToken });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return res.json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = refreshTokensController;
