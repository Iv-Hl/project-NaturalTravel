import { Router } from "express";
import { auth as ctrl } from "../controllers/index.js";

const authRouter = Router();

authRouter.post("/register", ctrl.registerUser);
authRouter.post("/login", ctrl.loginUser);
authRouter.post("/logout", ctrl.logout);
authRouter.get("/session", ctrl.refreshSession);

export default authRouter;
