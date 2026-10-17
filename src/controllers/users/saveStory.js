import mongoose from "mongoose";
import {Story} from "../../models/Story.js"
import { User } from "../../models/User.js";
import createHttpError from "http-errors";

export const saveStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { _id: userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw createHttpError(400, "Invalid story ID format");
    }

     const storyExists = await Story.findById(storyId);
    if (!storyExists) {
      throw createHttpError(404, "Story not found");
    }

    const updatedUser = await User.findByIdAndUpdate(userId,
      { $addToSet: { savedArticles: storyId } },
      { new: true }
    );
    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json({
      message: "Story successfully added to saved",
      savedArticles: updatedUser.savedArticles,
    });
  } catch (error) {
    next(error);
  }
};
