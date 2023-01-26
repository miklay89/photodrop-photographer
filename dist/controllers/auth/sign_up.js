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
const db = db_1.default.Connector;
const { usersTable } = db_1.default.Tables;
const signUpController = async (req, res) => {
    try {
        const login = req.body.login.toLowerCase();
        const password = req.body.password;
        const email = req.body.email;
        const fullName = req.body.fullName;
        const userExist = await db
            .select(usersTable)
            .where((0, expressions_1.eq)(usersTable.login, login));
        if (userExist.length) {
            return res
                .status(400)
                .json(boom_1.default.badRequest(`User with login - ${login} is exist.`));
        }
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
        if (err instanceof Error) {
            console.log(err.message);
            return res.json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = signUpController;
