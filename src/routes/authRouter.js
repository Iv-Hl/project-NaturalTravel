import { Router } from "express";
import { celebrate } from "celebrate";

import { auth as ctrl } from "../controllers/index.js";
import { registerUserSchema, loginUserSchema } from "../validations/index.js";

const authRouter = Router();

authRouter.post("/register", celebrate(registerUserSchema), ctrl.registerUser);

authRouter.post("/login", celebrate(loginUserSchema), ctrl.loginUser);

authRouter.post("/logout", ctrl.logout);

authRouter.post("/refresh", ctrl.refreshSession);

export default authRouter;
