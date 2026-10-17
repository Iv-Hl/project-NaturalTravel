import { User } from "../../models/User.js";

export const removeSavedStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const { _id: userId } = req.user; 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedStories: storyId } },
      { new: true }
    );

    if (!updatedUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: "Story successfully removed from saved",
      savedStories: updatedUser.savedStories,
    });
  } catch (error) {
    next(error); 
  }
};
// export const removeSavedStory = (_req, res) => {
//   res.status(501).json({ message: "Removing a saved story is not implemented yet." });
// };
