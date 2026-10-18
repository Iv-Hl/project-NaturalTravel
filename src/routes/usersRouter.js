import { Router } from "express";
import { celebrate } from "celebrate";
import { getUsersSchema } from "../validations/index.js";
import { users as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";

const usersRouter = Router();

usersRouter.get("/", celebrate(getUsersSchema), ctrl.getUsers);

usersRouter.get("/me", ctrl.getCurrentUser);
usersRouter.get("/me/stories", ctrl.getOwnStories);
usersRouter.get("/me/saved-stories", ctrl.getSavedStories);
usersRouter.post("/me/saved-stories/:storyId",  authenticate, ctrl.saveStory);
usersRouter.delete("/me/saved-stories/:storyId", authenticate, ctrl.removeSavedStory);

usersRouter.get("/:userId", ctrl.getUserById);

export default usersRouter;
