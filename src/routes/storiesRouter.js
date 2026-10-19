import { Router } from "express";
import { stories as ctrl } from "../controllers/index.js";
import { authenticate } from "../middleware/authenticate.js";
import { upload } from "../middleware/upload.js";

const storiesRouter = Router();

storiesRouter.get("/", ctrl.getStories);
storiesRouter.get("/:storyId/recommendations", ctrl.getRecommendedStories);
storiesRouter.get("/:storyId", ctrl.getStoryById);
storiesRouter.post("/", authenticate, upload.single("image"), ctrl.createStory);

export default storiesRouter;
