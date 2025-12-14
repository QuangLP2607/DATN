import { useEffect, useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./Lectures.module.scss";
import mediaApi from "@/services/mediaService";
import type { MediaItem } from "@/interfaces/media";

const cx = classNames.bind(styles);

const TeacherLectures = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewUrl, setViewUrl] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const classId = "692fc49cd5cf52445ee32f5e";
  const teacherId = "692f6055f72f2173f4d9df0b";

  // === LOAD MEDIA ===
  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaApi.getMediaByClass(classId);
      setMediaList(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // === UPLOAD ===
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Signed URL
      const { uploadUrl, fileKey } = await mediaApi.getUploadUrl({
        class_id: classId,
        file_name: file.name,
        file_type: file.type,
        uploaded_by: teacherId,
      });

      // 2. Upload lên S3
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // 3. Lưu metadata
      const media = await mediaApi.saveMedia({
        class_id: classId,
        file_key: fileKey,
        file_type: file.type,
        size: file.size,
        uploaded_by: teacherId,
      });

      // 4. Thêm vào list
      setMediaList((prev) => [media, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }

    setUploading(false);
  };

  // === OPEN VIDEO ===
  const openVideo = async (fileKey: string) => {
    const url = await mediaApi.getViewUrl(fileKey);
    setViewUrl(url);
  };

  // === FILTER & SORT ===
  const filtered = useMemo(() => {
    let list = [...mediaList];

    if (search.trim()) {
      list = list.filter((m) =>
        m.file_key.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "newest") {
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else {
      list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    }

    return list;
  }, [mediaList, search, sort]);

  return (
    <div className={cx("lectures")}>
      {/* Header */}
      <div className={cx("header")}>
        <h2>Lectures</h2>

        <label className={cx("upload-btn")}>
          {uploading ? "Uploading..." : "Upload video"}
          <input
            type="file"
            accept="video/*"
            hidden
            disabled={uploading}
            onChange={handleUpload}
          />
        </label>
      </div>

      {/* Search & Sort */}
      <div className={cx("toolbar")}>
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : filtered.length === 0 ? (
        <p>No videos found</p>
      ) : (
        <div className={cx("grid")}>
          {filtered.map((m) => (
            <div
              key={m._id}
              className={cx("card")}
              onClick={() => openVideo(m.file_key)}
            >
              <div className={cx("thumb")}>🎞</div>
              <div className={cx("info")}>
                <p className={cx("name")}>{m.file_key}</p>
                <span className={cx("date")}>
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {viewUrl && (
        <div className={cx("modal")} onClick={() => setViewUrl(null)}>
          <div
            className={cx("modal-inner")}
            onClick={(e) => e.stopPropagation()}
          >
            <video src={viewUrl} controls autoPlay width={650} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLectures;
