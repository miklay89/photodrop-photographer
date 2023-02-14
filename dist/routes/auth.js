"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth/auth"));
const auth_validators_1 = __importDefault(require("../validators/auth_validators"));
const is_authorized_1 = __importDefault(require("../middlewares/is_authorized"));
const router = (0, express_1.default)();
router.post("/sign-up", auth_validators_1.default.checkSignUpBody, auth_1.default.signUp);
router.post("/login", auth_validators_1.default.checkLoginBody, auth_1.default.logIn);
router.post("/refresh", auth_validators_1.default.checkCookies, auth_1.default.refreshTokens);
router.get("/me", is_authorized_1.default, auth_1.default.me);
exports.default = router;
