"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const expressions_1 = require("drizzle-orm/expressions");
const db_1 = __importDefault(require("../../data/db"));
const jwt_generator_1 = __importDefault(require("../../libs/jwt_generator"));
const db = db_1.default.Connector;
const { usersTable, sessionsTable, albumsTable } = db_1.default.Tables;
const logInController = async (req, res) => {
    try {
        const login = req.body.login.toLowerCase();
        const password = req.body.password;
        const user = await db.select(usersTable).where((0, expressions_1.eq)(usersTable.login, login));
        if (!user.length) {
            return res
                .status(400)
                .json(boom_1.default.badRequest(`User with login - ${login} isn't exist.`));
        }
        const passwordIsCorrect = await bcryptjs_1.default.compare(password, user[0].password);
        if (!passwordIsCorrect) {
            return res.status(400).json(boom_1.default.badRequest("Password is incorrect."));
        }
        const tokens = (0, jwt_generator_1.default)(user[0].userId);
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
        const newSession = {
            sessionId: (0, uuid_1.v4)(),
            userId: user[0].userId,
            refreshToken: tokens.refreshToken,
            expiresIn: sessionExpireTimestamp,
        };
        await db.insert(sessionsTable).values(newSession);
        const albums = await db
            .select(albumsTable)
            .where((0, expressions_1.eq)(albumsTable.userId, user[0].userId));
        return res
            .cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })
            .json({ accessToken: tokens.accessToken, albums });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return res.json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = logInController;
