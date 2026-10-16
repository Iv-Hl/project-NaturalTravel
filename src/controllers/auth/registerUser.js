import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import { User } from "../../models/User.js";
import { createSession } from "../../services/index.js";
import { setSessionCookies } from "../../utils/index.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw createHttpError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const session = await createSession(newUser._id);

  setSessionCookies(res, session);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
    },
  });
};
