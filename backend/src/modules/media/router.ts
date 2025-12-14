import { Router } from "express";
import { Controller } from "./controller";

const router = Router();

// tạo presigned PUT URL
router.post("/upload-url", Controller.getUploadUrl);

// lưu metadata sau khi upload thành công
router.post("/save", Controller.saveMedia);

// lấy list
router.get("/class/:classId", Controller.getMediaByClass);

// lấy pre-signed GET URL để view (query param ?fileKey=...)
router.get("/view-url", Controller.getViewUrl);

export default router;
