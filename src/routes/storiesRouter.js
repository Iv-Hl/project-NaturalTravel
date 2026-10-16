import { Router } from "express";
import { stories as ctrl } from "../controllers/index.js";

const storiesRouter = Router();

storiesRouter.get("/", ctrl.getStories);
storiesRouter.get("/:storyId/recommendations", ctrl.getRecommendedStories);
storiesRouter.get("/:storyId", ctrl.getStoryById);
storiesRouter.post("/", ctrl.createStory);

export default storiesRouter;
