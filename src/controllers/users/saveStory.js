import mongoose from "mongoose";
import createHttpError from "http-errors";
import { User } from "../../models/User.js";
import { Story } from "../../models/Story.js";

export const saveStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw createHttpError(400, "Invalid story ID format");
    }

    const storyExists = await Story.findById(storyId).select("ownerId rate");

    if (!storyExists) {
      throw createHttpError(404, "Story not found");
    }

    const result = await User.updateOne(
      { _id: userId, savedArticles: { $ne: storyId } },
      { $addToSet: { savedArticles: storyId } },
    );

    const isOtherUserStory = !storyExists.ownerId.equals(userId);
    let updatedRate = storyExists.rate;

    if (result.modifiedCount > 0) {
      const updatedStory = await Story.findByIdAndUpdate(
        storyId,
        { $inc: { rate: 1 } },
        { returnDocument: "after" },
      ).select("rate");

      if (!updatedStory) {
        throw createHttpError(404, "Story not found");
      }

      updatedRate = updatedStory.rate;
    } else {
      const latestStory = await Story.findById(storyId).select("rate");
      updatedRate = latestStory?.rate ?? updatedRate;
    }

    const currentUser = await User.findById(userId).select("savedArticles");

    return res.status(200).json({
      message: "Story successfully added to saved",
      savedArticles: currentUser?.savedArticles ?? [],
      rate: updatedRate,
    });
  } catch (error) {
    return next(error);
  }
};
