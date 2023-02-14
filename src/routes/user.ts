import Router from "express";
import UserController from "../controllers/user/user";

const router = Router();

router.get("/get-all", UserController.getAllUsers);

export default router;
