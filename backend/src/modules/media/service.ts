import { MediaModel } from "@/models/MediaFile";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "@/config/s3";
import { Types } from "mongoose";

const BUCKET = process.env.AWS_BUCKET_NAME!;
const REGION = process.env.AWS_REGION || "ap-southeast-1";
const EXPIRES_IN = Number(process.env.AWS_EXPIRES_IN || 900);

export const Service = {
  // trả upload URL (PUT)
  getUploadUrl: async (data: {
    class_id: string;
    file_name: string;
    file_type: string;
  }) => {
    const ext = data.file_name.split(".").pop();
    const fileKey = `classes/${data.class_id}/${Date.now()}.${ext ?? ""}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: fileKey,
      ContentType: data.file_type,
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: EXPIRES_IN,
    });

    return { uploadUrl, fileKey };
  },

  // lưu thông tin media vào DB
  saveMedia: async (data: {
    class_id: string;
    file_key: string;
    file_type: string; // mime
    size?: number;
    uploaded_by?: string | null;
    file_url?: string | null; // optional
  }) => {
    // derive media_type
    const mediaType = data.file_type?.startsWith("video") ? "video" : "image";

    const doc = await MediaModel.create({
      class_id: Types.ObjectId.isValid(data.class_id)
        ? new Types.ObjectId(data.class_id)
        : data.class_id,
      file_key: data.file_key,
      file_url: data.file_url || undefined,
      file_type: data.file_type,
      media_type: mediaType,
      file_size: data.size,
      uploaded_by:
        data.uploaded_by && Types.ObjectId.isValid(data.uploaded_by)
          ? new Types.ObjectId(data.uploaded_by)
          : data.uploaded_by || null,
    });

    return doc;
  },

  // get media list for a class
  getMediaByClass: async (classId: string) => {
    const q =
      Types.ObjectId.isValid(classId) && typeof classId === "string"
        ? { class_id: new Types.ObjectId(classId) }
        : { class_id: classId };
    return MediaModel.find(q).sort({ createdAt: -1 }).lean();
  },

  // trả pre-signed GET URL (view/download)
  getViewUrl: async (fileKey: string) => {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: fileKey,
    });
    return getSignedUrl(s3, command, { expiresIn: EXPIRES_IN });
  },
};
