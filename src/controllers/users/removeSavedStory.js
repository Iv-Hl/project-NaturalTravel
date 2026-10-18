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

     const user = await User.findById(userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const isSaved = user.savedArticles.includes(storyId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedArticles: storyId } },
      { new: true }
    );
     
     if (isSaved) {
      await Story.findByIdAndUpdate(storyId, { $inc: { rate: -1 } });
    }

    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({
      message: "Story successfully removed from saved",
      savedArticles: updatedUser.savedArticles,
    });
  } catch (error) {
    next(error); 
  }
};

