import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import { User } from "../../models/User.js";
import { Session } from "../../models/session.js";
import { createSession } from "../../services/index.js";
import { setSessionCookies } from "../../utils/index.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const findUser = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!findUser) {
    throw createHttpError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await bcrypt.compare(password, findUser.password);

  if (!isPasswordCorrect) {
    throw createHttpError(401, "Invalid credentials");
  }

  await Session.deleteOne({
    userId: findUser._id,
  });

  const session = await createSession(findUser._id);

  setSessionCookies(res, session);

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      avatarUrl: findUser.avatarUrl,
    },
  });
};
