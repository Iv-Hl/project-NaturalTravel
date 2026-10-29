import createHttpError from "http-errors";
import { User } from "../../models/User.js";
import { deleteImage, uploadImage } from "../../utils/cloudinary.js";

const MAX_NAME_LENGTH = 32;
const DEFAULT_AVATAR_URL =
  "https://ac.goit.global/fullstack/react/default-avatar.jpg";

export const updateCurrentUser = async (req, res, next) => {
  let uploadedAvatar;
  let avatarCommitted = false;

  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) throw createHttpError(401, "Unauthorized");

    const updates = {};
    const shouldResetAvatar = req.body?.resetAvatar === "true";

    if (Object.hasOwn(req.body ?? {}, "resetAvatar") && !shouldResetAvatar) {
      throw createHttpError(400, "Invalid avatar reset value");
    }
    if (shouldResetAvatar && req.file) {
      throw createHttpError(400, "Choose an avatar or reset it, not both");
    }

    if (Object.hasOwn(req.body ?? {}, "name")) {
      if (typeof req.body.name !== "string") {
        throw createHttpError(400, "Name must be a string");
      }

      const name = req.body.name.trim();
      if (name.length < 2 || name.length > MAX_NAME_LENGTH) {
        throw createHttpError(
          400,
          `Name must be between 2 and ${MAX_NAME_LENGTH} characters`,
        );
      }
      updates.name = name;
    }

    if (shouldResetAvatar) updates.avatarUrl = DEFAULT_AVATAR_URL;
    if (Object.keys(updates).length === 0 && !req.file) {
      throw createHttpError(400, "Provide a name, avatar, or avatar reset");
    }

    const currentUser = await User.findById(userId).select("+avatarPublicId");
    if (!currentUser) throw createHttpError(404, "User not found");

    if (req.file) {
      uploadedAvatar = await uploadImage(
        req.file.buffer,
        "natural-travel/avatars",
      );
      updates.avatarUrl = uploadedAvatar.secureUrl;
      updates.avatarPublicId = uploadedAvatar.publicId;
    }

    const updateOperation = { $set: updates };
    if (shouldResetAvatar) updateOperation.$unset = { avatarPublicId: 1 };

    const updatedUser = await User.findByIdAndUpdate(userId, updateOperation, {
      new: true,
      runValidators: true,
    }).select("-password -avatarPublicId");

    if (!updatedUser) throw createHttpError(404, "User not found");
    avatarCommitted = Boolean(uploadedAvatar);

    if ((uploadedAvatar || shouldResetAvatar) && currentUser.avatarPublicId) {
      await deleteImage(currentUser.avatarPublicId).catch((cleanupError) => {
        console.error("Failed to delete the previous avatar", cleanupError);
      });
    }

    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    if (uploadedAvatar && !avatarCommitted) {
      await deleteImage(uploadedAvatar.publicId).catch((cleanupError) => {
        console.error("Failed to clean up an unlinked avatar", cleanupError);
      });
    }
    return next(error);
  }
};
