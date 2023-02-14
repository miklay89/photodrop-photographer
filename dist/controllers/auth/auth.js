"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const expressions_1 = require("drizzle-orm/expressions");
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../../data/db"));
const jwt_generator_1 = __importDefault(require("../../libs/jwt_generator"));
const db = db_1.default.Connector;
const { usersTable, sessionsTable } = db_1.default.Tables;
class AuthController {
    constructor() {
        this.signUp = async (req, res, next) => {
            const login = req.body.login.toLowerCase();
            const { password, email, fullName } = req.body;
            try {
                await db
                    .select(usersTable)
                    .where((0, expressions_1.eq)(usersTable.login, login))
                    .then((query) => {
                    if (query.length)
                        throw boom_1.default.conflict(`User with login - ${login} is exist.`);
                });
                const hashedPassword = await bcryptjs_1.default.hash(password, 10);
                const newUser = {
                    login,
                    password: hashedPassword,
                    userId: (0, uuid_1.v4)(),
                    email: email || null,
                    fullName: fullName || null,
                };
                await db.insert(usersTable).values(newUser);
                return res
                    .status(200)
                    .json({ message: "User is registered.", login, password });
            }
            catch (err) {
                next(err);
            }
            return null;
        };
        this.logIn = async (req, res, next) => {
            const login = req.body.login.toLowerCase();
            const password = req.body.password;
            let userId = "";
            let hashedPassword = "";
            try {
                await db
                    .select(usersTable)
                    .where((0, expressions_1.eq)(usersTable.login, login))
                    .then((query) => {
                    if (!query.length)
                        throw boom_1.default.notFound(`User with login - ${login} isn't exist.`);
                    hashedPassword = query[0].password;
                    userId = query[0].userId;
                });
                await bcryptjs_1.default.compare(password, hashedPassword).then((same) => {
                    if (!same)
                        throw boom_1.default.badRequest("Password is incorrect.");
                });
                const tokens = (0, jwt_generator_1.default)(userId);
                const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
                const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
                const newSession = {
                    sessionId: (0, uuid_1.v4)(),
                    userId,
                    refreshToken: tokens.refreshToken,
                    expiresIn: sessionExpireTimestamp,
                };
                await db.insert(sessionsTable).values(newSession);
                return res
                    .cookie("refreshToken", tokens.refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",
                })
                    .json({ accessToken: tokens.accessToken });
            }
            catch (err) {
                next(err);
            }
            return null;
        };
        this.refreshTokens = async (req, res, next) => {
            const { refreshToken } = req.cookies;
            try {
                const timeStamp = new Date(Date.now()).toJSON();
                const sessionIsExist = await db
                    .select(sessionsTable)
                    .where((0, expressions_1.eq)(sessionsTable.refreshToken, refreshToken));
                if (!sessionIsExist.length)
                    throw boom_1.default.badRequest("Invalid refresh token.");
                if (Date.parse(timeStamp) >=
                    Date.parse(sessionIsExist[0].expiresIn)) {
                    await db
                        .delete(sessionsTable)
                        .where((0, expressions_1.eq)(sessionsTable.sessionId, sessionIsExist[0].sessionId));
                    throw boom_1.default.unauthorized("Session is expired, please log-in.");
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
                next(err);
            }
            return null;
        };
        this.me = async (req, res) => {
            return res.json({ message: "ok" });
        };
    }
}
exports.default = new AuthController();
