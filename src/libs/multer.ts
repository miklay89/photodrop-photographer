// eslint-disable-next-line import/no-extraneous-dependencies
import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, uuid() + path.extname(file.originalname)); // Appending extension
  },
});

const upload = multer({ storage });

export default upload;
