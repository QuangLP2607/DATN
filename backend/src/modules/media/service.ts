import AppError from "@/core/AppError";
import { UserModel } from "@/models/User";
import { MediaModel } from "@/models/Media";
import { redis } from "@/config/redis";
import s3 from "@/config/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { normalizeMongo } from "@/utils/mongoNormalize";
import { fetchS3Url } from "@/utils/s3UrlCache";
import { CreateMediaInput } from "./dto/create";
import { CreateUploadUrlInput } from "./dto/createUploadUrl";
import { UpdateMediaInput } from "./dto/update";

const BUCKET = process.env.AWS_BUCKET_NAME!;
const EXPIRES_IN = Number(process.env.AWS_EXPIRES_IN || 900);

export default {
  // -------------------- create upload url --------------------
  createUploadUrl: async (data: CreateUploadUrlInput) => {
    const [domain, type] = data.purpose.split("/", 2);
    const ext = data.file_type.split("/").pop() ?? "bin";

    const fileKey = `${domain}/${
      data.domain_id
    }/${type}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

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

  // -------------------- get view url --------------------
  getViewUrl: async (id: string) => {
    const media = await MediaModel.findOne({ _id: id });
    if (!media) throw AppError.notFound("Media not found");
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: media.file_key,
    });

    const url = id ? await fetchS3Url(media.file_key) : undefined;

    return { ...normalizeMongo(media.toObject()), url };
  },

  // -------------------- get download url --------------------
  getDownloadUrl: async (id: string) => {
    const media = await MediaModel.findById(id);
    if (!media) throw AppError.notFound("Media not found");

    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: media.file_key,
      ResponseContentDisposition: `attachment; filename="${media.file_name}"`,
      ResponseContentType: media.file_type,
    });

    const url = await getSignedUrl(s3, command, {
      expiresIn: EXPIRES_IN,
    });

    return { url };
  },

  // -------------------- create --------------------
  create: async (userId: string, data: CreateMediaInput) => {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw AppError.notFound("User not found");
    }

    const media = await MediaModel.create({
      ...data,
      uploaded_by: userId,
    });

    return normalizeMongo(media.toObject());
  },

  // -------------------- update --------------------
  update: async (id: string, data: UpdateMediaInput) => {
    const media = await MediaModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!media) throw AppError.notFound("Media not found");
    return normalizeMongo(media.toObject());
  },

  // -------------------- delete --------------------
  delete: async (id: string) => {
    const media = await MediaModel.findById(id);
    if (!media) throw AppError.notFound("Media not found");
    await redis.del(media.file_key);
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: media.file_key,
      })
    );

    await media.deleteOne();
  },
};
