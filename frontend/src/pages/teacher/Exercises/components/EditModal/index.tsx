import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./EditModal.module.scss";
import quizApi, {
  type UpdateQuizPayload,
  type CreateQuizPayload,
} from "@/services/quizService";
import mediaApi from "@/services/mediaService";
import type { Quiz, QuizStatus } from "@/interfaces/quiz";
import { Icon } from "@iconify/react";
import Overlay from "@/components/ui/Overlay";

const cx = classNames.bind(styles);

interface Props {
  quiz: Quiz;
  onClose: () => void;
  onUpdated: (updatedQuiz: Quiz) => void;
}

interface QuizForm {
  title: string;
  description: string;
  duration: number;
  status: QuizStatus;
}

const ExerciseEditModal = ({ quiz, onClose, onUpdated }: Props) => {
  const [form, setForm] = useState<QuizForm>({
    title: quiz.title,
    description: quiz.description ?? "",
    duration: quiz.id ? quiz.duration ?? 1 : 1,
    status: quiz.status ?? "draft",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const previewUrl = thumbnailFile
    ? URL.createObjectURL(thumbnailFile)
    : quiz.thumbnailUrl;

  const handleChange = (field: keyof QuizForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);

    try {
      let thumbnailId = quiz.thumbnail_id;

      if (thumbnailFile) {
        const { uploadUrl, fileKey } = await mediaApi.getUploadUrl({
          domain_id: quiz.id || "new",
          file_type: thumbnailFile.type,
          purpose: "quiz/thumbnail",
        });

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": thumbnailFile.type },
          body: thumbnailFile,
        });
        if (!uploadRes.ok) throw new Error("Upload thumbnail failed");

        const createdThumb = await mediaApi.create({
          file_key: fileKey,
          file_type: thumbnailFile.type,
          file_name: thumbnailFile.name,
          file_size: thumbnailFile.size,
        });

        thumbnailId = createdThumb.id;
      }

      let updatedQuiz: Quiz;

      if (!quiz.id) {
        // Quiz mới → CreateQuizPayload, status mặc định "draft"
        const payload: CreateQuizPayload = {
          title: form.title.trim(),
          description: form.description.trim(),
          duration: form.duration,
          class_id: quiz.class_id,
          thumbnail_id: thumbnailId,
        };

        const newQuiz = await quizApi.create(payload);
        updatedQuiz = { ...newQuiz, thumbnailUrl: previewUrl };
      } else {
        // Quiz đã tồn tại → UpdateQuizPayload
        const payload: UpdateQuizPayload = {
          title: form.title.trim(),
          description: form.description.trim(),
          duration: form.duration,
          status: form.status,
          thumbnail_id: thumbnailId,
        };

        const res = await quizApi.update(quiz.id, payload);
        updatedQuiz = { ...quiz, ...res, thumbnailUrl: previewUrl };
      }

      onUpdated(updatedQuiz);
      onClose();
    } catch (err) {
      console.error("Save quiz failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay open onClose={onClose} closeOnBackdropClick={false}>
      <div className={cx("modal")}>
        <div className={cx("header")}>
          <h3>{quiz.id ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}</h3>
          <button className={cx("close-btn")} onClick={onClose} type="button">
            <Icon icon="mdi:close" />
          </button>
        </div>

        <hr />

        <div className={cx("body")}>
          <label className={cx("field")}>
            <span>Tiêu đề</span>
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Nhập tiêu đề bài tập"
            />
          </label>

          <label className={cx("field")}>
            <span>Mô tả</span>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả ngắn cho bài tập"
              rows={3}
            />
          </label>

          <div className={cx("thumb")}>
            {previewUrl && <img src={previewUrl} alt="Thumbnail preview" />}
          </div>

          <label className={cx("field")}>
            <span>Thumbnail</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            />
          </label>

          <div className={cx("row")}>
            <label className={cx("field")}>
              <span>Thời gian (phút)</span>
              <input
                type="number"
                min={1}
                value={form.duration}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  handleChange("duration", value < 1 ? 1 : value);
                }}
              />
            </label>

            {quiz.id && (
              <label className={cx("field")}>
                <span>Trạng thái</span>
                <select
                  value={form.status}
                  onChange={(e) =>
                    handleChange("status", e.target.value as QuizStatus)
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
            )}
          </div>
        </div>

        <div className={cx("actions")}>
          <button
            onClick={onClose}
            className={cx("btn", "cancel")}
            disabled={saving}
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={cx("btn", "save")}
            disabled={saving || !form.title.trim()}
            type="button"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Overlay>
  );
};

export default ExerciseEditModal;
