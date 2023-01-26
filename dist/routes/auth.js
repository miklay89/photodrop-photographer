"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("../controllers/auth/signup"));
const login_1 = __importDefault(require("../controllers/auth/login"));
const refreshtokens_1 = __importDefault(require("../controllers/auth/refreshtokens"));
const authvalidators_1 = require("../validators/authvalidators");
const router = (0, express_1.default)();
// registration in retool
router.post("/sign-up", authvalidators_1.checkSignUpBody, signup_1.default);
// login
router.post("/login", authvalidators_1.checkLoginBody, login_1.default);
// refresh token
router.post("/refresh", authvalidators_1.checkRefreshTokenBody, refreshtokens_1.default);
exports.default = router;
