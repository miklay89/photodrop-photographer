"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const get_all_user_1 = __importDefault(require("../controllers/user/get_all_user"));
const router = (0, express_1.default)();
router.get("/get-all", get_all_user_1.default);
exports.default = router;
