import crypto from "node:crypto";
import { Session } from "../models/session.js";

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 хвилин
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 днів

export const createSession = async (userId) => {
  const now = Date.now();

  const session = await Session.create({
    userId,
    accessToken: crypto.randomBytes(32).toString("hex"),
    refreshToken: crypto.randomBytes(32).toString("hex"),
    accessTokenValidUntil: new Date(now + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(now + REFRESH_TOKEN_LIFETIME),
  });

  return session;
};
