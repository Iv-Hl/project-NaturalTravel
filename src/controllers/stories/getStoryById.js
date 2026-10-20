import { publicStoriesService } from "../../services/stories/publicStoriesService.js";

export const getStoryById = async (req, res, next) => {
  try {
    const story = await publicStoriesService.getById(req.params.storyId);

    return res.status(200).json(story);
  } catch (error) {
    return next(error);
  }
};
