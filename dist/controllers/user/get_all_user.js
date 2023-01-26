"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const db_1 = __importDefault(require("../../data/db"));
const db = db_1.default.Connector;
const { usersTable } = db_1.default.Tables;
const getAllUsersController = async (req, res) => {
    try {
        const users = await db.select(usersTable).fields({
            login: usersTable.login,
        });
        return res.status(200).json(users);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            return res.json(boom_1.default.badRequest(err.message));
        }
    }
    return null;
};
exports.default = getAllUsersController;
