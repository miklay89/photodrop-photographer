"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("@hapi/boom"));
const db_1 = __importDefault(require("../../data/db"));
const db = db_1.default.Connector;
const { usersTable } = db_1.default.Tables;
class User {
    constructor() {
        this.getAllUsers = async (req, res, next) => {
            try {
                await db
                    .select(usersTable)
                    .fields({
                    login: usersTable.login,
                })
                    .then((query) => {
                    if (!query.length)
                        throw boom_1.default.notFound();
                    res.status(200).json(query);
                });
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = new User();
