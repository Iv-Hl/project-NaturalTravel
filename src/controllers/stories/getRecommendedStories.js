import { publicStoriesService } from "../../services/stories/publicStoriesService.js";

export const getRecommendedStories = async (req, res, next) => {
  try {
    const result = await publicStoriesService.getRecommendations(
      req.params.storyId,
      req.query,
    );

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
