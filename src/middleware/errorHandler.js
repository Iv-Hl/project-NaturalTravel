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
    return res.status(err.status).json({
      message: STATUS_CODES[err.status] || "Request failed.",
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
  }

  res.status(500).json({
    message: "Internal server error.",
  });
};
