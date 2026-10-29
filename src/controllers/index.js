import { registerUser } from "./auth/registerUser.js";
import { loginUser } from "./auth/loginUser.js";
import { logout } from "./auth/logout.js";
import { refreshUserSession } from "./auth/refreshSession.js";
import { getCategories } from "./categories/getCategories.js";
import { getStories } from "./stories/getStories.js";
import { getRecommendedStories } from "./stories/getRecommendedStories.js";
import { getStoryById } from "./stories/getStoryById.js";
import { createStory } from "./stories/createStory.js";
import { getCurrentUser } from "./users/getCurrentUser.js";
import { updateCurrentUser } from "./users/updateCurrentUser.js";
import { getOwnStories } from "./users/getOwnStories.js";
import { getSavedStories } from "./users/getSavedStories.js";
import { saveStory } from "./users/saveStory.js";
import { removeSavedStory } from "./users/removeSavedStory.js";
import { getUserById } from "./users/getUserById.js";
import { getUsers } from "./users/getUsers.js";

export const auth = {
  registerUser,
  loginUser,
  logout,
  refreshUserSession,
};

export const categories = {
  getCategories,
};

export const stories = {
  getStories,
  getRecommendedStories,
  getStoryById,
  createStory,
};

export const users = {
  getCurrentUser,
  updateCurrentUser,
  getOwnStories,
  getSavedStories,
  saveStory,
  removeSavedStory,
  getUserById,
  getUsers,
};
