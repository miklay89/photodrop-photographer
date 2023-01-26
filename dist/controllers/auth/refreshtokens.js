"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const expressions_1 = require("drizzle-orm/expressions");
const boom_1 = __importDefault(require("@hapi/boom"));
const db_1 = __importDefault(require("../../data/db"));
const createtokens_1 = __importDefault(require("../../helpers/createtokens"));
const db = db_1.default.Connector;
const { sessionsTable } = db_1.default.Tables;
// refresh tokens controller
const refreshTokensController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.body.refreshToken;
        const timeStamp = new Date(Date.now()).toJSON();
        // check existing session
        const sessionIsExist = yield db
            .select(sessionsTable)
            .where((0, expressions_1.eq)(sessionsTable.refreshToken, refreshToken));
        if (!sessionIsExist.length)
            return res.status(401).json(boom_1.default.badRequest("Invalid refresh token."));
        // check session expiration
        if (Date.parse(timeStamp) >=
            Date.parse(sessionIsExist[0].expiresIn)) {
            // delete old session
            yield db
                .delete(sessionsTable)
                .where((0, expressions_1.eq)(sessionsTable.sessionId, sessionIsExist[0].sessionId));
            return res
                .status(401)
                .json(boom_1.default.badRequest("Session is expired, please log-in."));
        }
        // creating new tokens - access and refresh
        const newTokens = (0, createtokens_1.default)(sessionIsExist[0].userId);
        // creating new session
        // session expire in - 5 days
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
        // update session in DB
        const newSession = {
            sessionId: sessionIsExist[0].sessionId,
            userId: sessionIsExist[0].userId,
            refreshToken: newTokens.refreshToken,
            expiresIn: sessionExpireTimestamp,
        };
        yield db
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
});
exports.default = refreshTokensController;
