import Router from "express";
import AuthController from "../controllers/auth/auth";
import AuthValidator from "../validators/auth_validators";
import isAuthorized from "../middlewares/is_authorized";

const router = Router();

// registration in retool
router.post("/sign-up", AuthValidator.checkSignUpBody, AuthController.signUp);
// login
router.post("/login", AuthValidator.checkLoginBody, AuthController.logIn);
// refresh token
router.post(
  "/refresh",
  AuthValidator.checkCookies,
  AuthController.refreshTokens,
);
// TODO - delete on prod (me - check access)
router.get("/me", isAuthorized, AuthController.me);

export default router;
