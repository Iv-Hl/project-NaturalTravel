import mongoose from "mongoose";
import createHttpError from "http-errors";
import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";

export const removeSavedStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw createHttpError(400, "Invalid story ID format");
    }

    const story = await Story.findById(storyId).select("ownerId");

    const result = await User.updateOne(
      { _id: userId, savedArticles: storyId },
      { $pull: { savedArticles: storyId } },
    );

    const isOtherUserStory = story && !story.ownerId.equals(userId);

    if (result.modifiedCount > 0 && isOtherUserStory) {
      await Story.updateOne(
        { _id: storyId, rate: { $gt: 0 } },
        { $inc: { rate: -1 } },
      );
    }

    const currentUser = await User.findById(userId);

    res.status(200).json({
      message: "Story successfully removed from saved",
      savedArticles: currentUser ? currentUser.savedArticles : [],
    });
  } catch (error) {
    next(error);
  }
};
