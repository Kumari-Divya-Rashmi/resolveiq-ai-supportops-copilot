import multer from "multer";
import path from "node:path";
import { env } from "../config/env.js";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, path.resolve(process.cwd(), env.UPLOAD_DIR));
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    callback(null, `${Date.now()}-${safeName}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3
  }
});

export function mapUploadedFiles(files = []) {
  return files.map((file) => ({
    originalName: file.originalname,
    fileName: file.filename,
    path: `/uploads/${file.filename}`,
    mimeType: file.mimetype,
    size: file.size
  }));
}
