import Router from "express";
import signUpController from "../controllers/auth/sign_up";
import logInController from "../controllers/auth/log_in";
import refreshTokensController from "../controllers/auth/refresh_tokens";
import { checkLoginBody, checkSignUpBody } from "../validators/auth_validators";

const router = Router();

// registration in retool
router.post("/sign-up", checkSignUpBody, signUpController);
// login
router.post("/login", checkLoginBody, logInController);
// refresh token
router.post("/refresh", refreshTokensController);

export default router;
