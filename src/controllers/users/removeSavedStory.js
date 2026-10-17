import mongoose from "mongoose";
import createHttpError from "http-errors";
import { User } from "../../models/User.js";

export const removeSavedStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { _id: userId } = req.user;
    
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw createHttpError(400, "Invalid story ID format");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedArticles: storyId } },
      { new: true }
    );

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

