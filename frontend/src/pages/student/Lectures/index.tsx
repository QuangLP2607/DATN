import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Lectures.module.scss";
import mediaApi from "@/services/mediaService";
import type { MediaItem } from "@/interfaces/media";

const cx = classNames.bind(styles);

const StudentLectures = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [filteredList, setFilteredList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const classId = "692fc49cd5cf52445ee32f5e";

  // Fetch danh sách video
  useEffect(() => {
    const fetchMedia = async () => {
      const data = await mediaApi.getMediaByClass(classId);
      setMediaList(data);
      setFilteredList(data);
    };
    fetchMedia();
  }, []);

  // Search + Filter + Sort
  useEffect(() => {
    let list = [...mediaList];

    // Search
    if (search.trim()) {
      list = list.filter((m) =>
        m.file_key.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter date
    if (dateFilter) {
      const d = new Date(dateFilter);
      list = list.filter((m) => {
        const c = new Date(m.createdAt);
        return c.toDateString() === d.toDateString();
      });
    }

    // Sort
    switch (sort) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "az":
        list.sort((a, b) => a.file_key.localeCompare(b.file_key));
        break;
      case "za":
        list.sort((a, b) => b.file_key.localeCompare(a.file_key));
        break;
    }

    setFilteredList(list);
  }, [search, dateFilter, sort, mediaList]);

  // Click để xem video bằng pre-signed URL
  const openVideo = async (fileKey: string) => {
    const url = await mediaApi.getViewUrl(fileKey);
    setSelectedVideo(url);
  };

  return (
    <div className={cx("lectures")}>
      <h2>Class Lectures</h2>

      {/* Filters UI */}
      <div className={cx("filters")}>
        <input
          type="text"
          placeholder="Search video name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cx("search")}
        />

        <input
          type="date"
          className={cx("dateFilter")}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        <select
          value={sort}
          className={cx("sort")}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>

      {/* Video grid */}
      <div className={cx("grid")}>
        {filteredList.length === 0 ? (
          <p>No videos found.</p>
        ) : (
          filteredList.map((m) => (
            <div
              key={m._id}
              className={cx("videoCard")}
              onClick={() => openVideo(m.file_key)}
            >
              <div className={cx("thumb")}>🎞️</div>

              <div className={cx("info")}>
                <p className={cx("title")}>{m.file_key}</p>
                <span className={cx("date")}>
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video modal */}
      {selectedVideo && (
        <div className={cx("modal")} onClick={() => setSelectedVideo(null)}>
          <div
            className={cx("modalContent")}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className={cx("player")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLectures;
