import Router from "express";
import getAllUsersController from "../controllers/user/get_all_user";

const router = Router();

router.get("/get-all", getAllUsersController);

export default router;
