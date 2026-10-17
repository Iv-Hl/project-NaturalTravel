import { User } from "../../models/User.js";
import createHttpError from "http-errors";

export const saveStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { _id: userId } = req.user;
    const updatedUser = await User.findByIdAndUpdate(userId,
      { $addToSet: { savedStories: storyId } },
      { new: true }
    );
    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json({
      message: "Story successfully added to saved",
      savedStories: updatedUser.savedStories
    });
  } catch (error) {
    next(error);
  }
};
