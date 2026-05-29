import multer from "multer";
import fs from "fs";
import path from "path";

// CREATE TEMP FOLDER IF NOT EXISTS
const uploadPath = "./public/temp";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// STORAGE CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname);

    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// MULTER INSTANCE
export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});