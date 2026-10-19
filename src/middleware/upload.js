import multer from "multer";
import createHttpError from "http-errors";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(createHttpError(400, "Only image files are allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024,
    files: 1,
  },
});
