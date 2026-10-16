import cors from "cors";

export const createCorsMiddleware = (configuredOrigins = "") => {
  const origins = configuredOrigins.split(",").map((origin) => origin.trim()).filter(Boolean);

  for (const origin of origins) {
    let url;
    try {
      url = new URL(origin);
    } catch {
      throw new Error("CORS_ORIGINS must contain explicit HTTP(S) origins.");
    }
    if (!["http:", "https:"].includes(url.protocol) || url.origin !== origin) {
      throw new Error("CORS_ORIGINS must contain explicit HTTP(S) origins without paths.");
    }
  }

  return cors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  });
};
