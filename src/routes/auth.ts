import Router from "express";
import AuthController from "../controllers/auth/auth";
import AuthValidator from "../validators/auth_validators";
import isAuthorized from "../middlewares/is_authorized";

const router = Router();

router.post("/sign-up", AuthValidator.checkSignUpBody, AuthController.signUp);
router.post("/login", AuthValidator.checkLoginBody, AuthController.logIn);
router.post(
  "/refresh",
  AuthValidator.checkCookies,
  AuthController.refreshTokens,
);
router.get("/me", isAuthorized, AuthController.me);

export default router;
