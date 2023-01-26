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
const boom_1 = __importDefault(require("@hapi/boom"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const expressions_1 = require("drizzle-orm/expressions");
const db_1 = __importDefault(require("../../data/db"));
const createtokens_1 = __importDefault(require("../../helpers/createtokens"));
const db = db_1.default.Connector;
const { usersTable, sessionsTable, albumsTable } = db_1.default.Tables;
// login controller
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const login = req.body.login.toLowerCase();
        const password = req.body.password;
        // try to find user in db for check is it exist
        const user = yield db.select(usersTable).where((0, expressions_1.eq)(usersTable.login, login));
        if (!user.length) {
            return res
                .status(400)
                .json(boom_1.default.badRequest(`User with login - ${login} isn't exist.`));
        }
        // compare passwords
        const passwordIsCorrect = yield bcryptjs_1.default.compare(password, user[0].password);
        if (!passwordIsCorrect) {
            return res.status(400).json(boom_1.default.badRequest("Password is incorrect."));
        }
        // create tokens for next auth
        const tokens = (0, createtokens_1.default)(user[0].userId);
        // session expire in - 5 days
        const refreshTokenExpTime = Math.floor(Date.now() + 432000000);
        const sessionExpireTimestamp = new Date(refreshTokenExpTime).toJSON();
        const newSession = {
            sessionId: (0, uuid_1.v4)(),
            userId: user[0].userId,
            refreshToken: tokens.refreshToken,
            expiresIn: sessionExpireTimestamp,
        };
        // saving session
        yield db.insert(sessionsTable).values(newSession);
        // getting albums info
        const albums = yield db
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
});
exports.default = loginController;
