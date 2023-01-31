import Router from "express";
import signUpController from "../controllers/auth/sign_up";
import logInController from "../controllers/auth/log_in";
import meController from "../controllers/auth/me";
import checkToken from "../middlewares/check_token";
import refreshTokensController from "../controllers/auth/refresh_tokens";
import { checkLoginBody, checkSignUpBody } from "../validators/auth_validators";

const router = Router();

// registration in retool
router.post("/sign-up", checkSignUpBody, signUpController);
// login
router.post("/login", checkLoginBody, logInController);
// refresh token
router.post("/refresh", refreshTokensController);
// TODO - delete on prod (me - check access)
router.get("/me", checkToken, meController);

export default router;
