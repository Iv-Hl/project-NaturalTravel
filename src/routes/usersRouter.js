import { Router } from "express";
import { celebrate } from "celebrate";
import { getUsersSchema } from "../validations/index.js";
import { users as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/upload.js";

const usersRouter = Router();

usersRouter.get("/", celebrate(getUsersSchema), ctrl.getUsers);

usersRouter.get("/me", authenticate, ctrl.getCurrentUser);
usersRouter.patch(
  "/me",
  authenticate,
  upload.single("avatar"),
  ctrl.updateCurrentUser,
);
usersRouter.get("/me/stories", authenticate, ctrl.getOwnStories);
usersRouter.get("/me/saved-stories", authenticate, ctrl.getSavedStories);
usersRouter.post("/me/saved-stories/:storyId", authenticate, ctrl.saveStory);
usersRouter.delete(
  "/me/saved-stories/:storyId",
  authenticate,
  ctrl.removeSavedStory,
);

usersRouter.get("/:userId", ctrl.getUserById);

export default usersRouter;
