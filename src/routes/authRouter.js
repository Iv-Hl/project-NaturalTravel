import { Router } from "express";
import { auth as ctrl } from "../controllers/index.js";

const authRouter = Router();

authRouter.post("api/auth/register", ctrl.registerUser);
authRouter.post("api/auth/login", ctrl.loginUser);
authRouter.post("api/auth/logout", ctrl.logout);
authRouter.get("api/auth/session", ctrl.refreshSession);

export default authRouter;
