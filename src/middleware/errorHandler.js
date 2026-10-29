import { STATUS_CODES } from "node:http";
import { HttpError } from "http-errors";
import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body." });
  }

  if (err?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large." });
  }

  if (err instanceof HttpError) {
    const status = err.status || 500;
    const message = err.expose
      ? err.message
      : STATUS_CODES[status] || "Request failed.";

    return res.status(status).json({
      message: message || STATUS_CODES[status] || "Request failed.",
    });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "File size must not exceed 1 MB.",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Only one file is allowed.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "Unexpected file field.",
      });
    }

    return res.status(400).json({
      message: "File upload failed.",
    });
  }
  return res.status(500).json({
    message: "Internal server error.",
  });
};
