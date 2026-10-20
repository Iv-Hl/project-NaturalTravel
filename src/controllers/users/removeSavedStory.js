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

    const result = await User.updateOne(
      { _id: userId, savedArticles: storyId },
      { $pull: { savedArticles: storyId } }
    );

    if (result.modifiedCount > 0) {
      await Story.findByIdAndUpdate(storyId, { $inc: { rate: -1 } });
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