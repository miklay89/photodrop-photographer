"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sign_up_1 = __importDefault(require("../controllers/auth/sign_up"));
const log_in_1 = __importDefault(require("../controllers/auth/log_in"));
const me_1 = __importDefault(require("../controllers/auth/me"));
const check_token_1 = __importDefault(require("../middlewares/check_token"));
const refresh_tokens_1 = __importDefault(require("../controllers/auth/refresh_tokens"));
const auth_validators_1 = require("../validators/auth_validators");
const router = (0, express_1.default)();
router.post("/sign-up", auth_validators_1.checkSignUpBody, sign_up_1.default);
router.post("/login", auth_validators_1.checkLoginBody, log_in_1.default);
router.post("/refresh", refresh_tokens_1.default);
router.get("/me", check_token_1.default, me_1.default);
exports.default = router;
