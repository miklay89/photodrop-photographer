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
const expressions_1 = require("drizzle-orm/expressions");
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("../../data/db"));
const db = db_1.default.Connector;
const { usersTable } = db_1.default.Tables;
// sign up controller
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const login = req.body.login.toLowerCase();
        const password = req.body.password;
        // optional fields
        const email = req.body.email;
        const fullName = req.body.fullName;
        // check if user exist
        const userExist = yield db
            .select(usersTable)
            .where((0, expressions_1.eq)(usersTable.login, login));
        if (userExist.length) {
            return res
                .status(400)
                .json(boom_1.default.badRequest(`User with login - ${login} is exist.`));
        }
        // hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // new user object
        const newUser = {
            login,
            password: hashedPassword,
            userId: (0, uuid_1.v4)(),
            email: email || null,
            fullName: fullName || null,
        };
        // store new user in DB
        yield db.insert(usersTable).values(newUser);
        // res - with OK status
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
});
exports.default = signUpController;
