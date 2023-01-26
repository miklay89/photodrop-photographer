import Router from "express";
import signUpController from "../controllers/auth/signup";
import loginController from "../controllers/auth/login";
import refreshTokenController from "../controllers/auth/refreshtokens";
import {
  checkLoginBody,
  checkSignUpBody,
  checkRefreshTokenBody,
} from "../validators/authvalidators";

const router = Router();

// registration in retool
router.post("/sign-up", checkSignUpBody, signUpController);
// login
router.post("/login", checkLoginBody, loginController);
// refresh token
router.post("/refresh", checkRefreshTokenBody, refreshTokenController);

export default router;
