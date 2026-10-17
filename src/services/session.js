import crypto from "node:crypto";

import { Session } from "../models/session.js";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";

export const createSession = async (userId) => {
  const now = Date.now();

  const session = await Session.create({
    userId,
    accessToken: crypto.randomBytes(32).toString("hex"),
    refreshToken: crypto.randomBytes(32).toString("hex"),
    accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(now + THIRTY_DAYS),
  });

  return session;
};
