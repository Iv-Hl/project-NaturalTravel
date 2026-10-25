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

    const story = await Story.findById(storyId).select("ownerId rate");

    const result = await User.updateOne(
      { _id: userId, savedArticles: storyId },
      { $pull: { savedArticles: storyId } },
    );

    const isOtherUserStory = story && !story.ownerId.equals(userId);
    let updatedRate = story?.rate ?? 0;

    if (result.modifiedCount > 0 && isOtherUserStory) {
      const updatedStory = await Story.findOneAndUpdate(
        { _id: storyId, rate: { $gt: 0 } },
        { $inc: { rate: -1 } },
        { returnDocument: "after" },
      ).select("rate");

      if (updatedStory) {
        updatedRate = updatedStory.rate;
      } else {
        const latestStory = await Story.findById(storyId).select("rate");
        updatedRate = latestStory?.rate ?? updatedRate;
      }
    } else if (story) {
      const latestStory = await Story.findById(storyId).select("rate");
      updatedRate = latestStory?.rate ?? updatedRate;
    }

    const currentUser = await User.findById(userId);

    return res.status(200).json({
      message: "Story successfully removed from saved",
      savedArticles: currentUser ? currentUser.savedArticles : [],
      rate: updatedRate,
    });
  } catch (error) {
    return next(error);
  }
};