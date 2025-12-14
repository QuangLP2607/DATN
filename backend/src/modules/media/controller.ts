import { Request, Response, NextFunction } from "express";
import { Res } from "@/core/response";
import { Service } from "./service";
import { ClassModel } from "@/models/Class";
import { Types } from "mongoose";

export const Controller = {
  getUploadUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { class_id, file_name, file_type } = req.body;
      if (!class_id || !file_name || !file_type) {
        return Res.badRequest(res, "Missing required fields");
      }

      if (!Types.ObjectId.isValid(class_id as string)) {
        return Res.badRequest(res, "Invalid class_id");
      }

      const exists = await ClassModel.exists({ _id: class_id });
      if (!exists) return Res.notFound(res, "Class not found");

      const result = await Service.getUploadUrl({
        class_id,
        file_name,
        file_type,
      });
      return Res.success(res, "Upload URL generated", result);
    } catch (error) {
      next(error);
    }
  },

  saveMedia: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { class_id, file_key, file_type, size, uploaded_by, file_url } =
        req.body;
      if (!class_id || !file_key || !file_type) {
        return Res.badRequest(res, "Missing required fields");
      }

      if (!Types.ObjectId.isValid(class_id as string)) {
        return Res.badRequest(res, "Invalid class_id");
      }

      const exists = await ClassModel.exists({ _id: class_id });
      if (!exists) return Res.notFound(res, "Class not found");

      const media = await Service.saveMedia({
        class_id,
        file_key,
        file_type,
        size,
        uploaded_by,
        file_url,
      });

      return Res.created(res, "Media saved", media);
    } catch (error) {
      next(error);
    }
  },

  getMediaByClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { classId } = req.params;
      if (!Types.ObjectId.isValid(classId as string)) {
        return Res.badRequest(res, "Invalid classId");
      }

      const exists = await ClassModel.exists({ _id: classId });
      if (!exists) return Res.notFound(res, "Class not found");

      const mediaList = await Service.getMediaByClass(classId);
      return Res.success(res, "Media list fetched", mediaList);
    } catch (error) {
      next(error);
    }
  },

  getViewUrl: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fileKey =
        (req.query.fileKey as string) || (req.params.fileKey as string);
      if (!fileKey) return Res.badRequest(res, "Missing fileKey");

      const signed = await Service.getViewUrl(fileKey);
      return Res.success(res, "View URL generated", { url: signed });
    } catch (error) {
      next(error);
    }
  },
};
