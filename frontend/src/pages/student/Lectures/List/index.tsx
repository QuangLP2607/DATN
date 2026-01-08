import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Lectures.module.scss";
import { Icon } from "@iconify/react";
import { useClass } from "@/hooks/useClass";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useLecturesQuery } from "@/hooks/queries/useLecturesQuery";
import { PaginationControls } from "@/components/commons/PaginationControls";
import SearchBar from "@/components/commons/SearchBar";
import Filters from "../components/Filters";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { formatDate } from "@/utils/date";
import type { GetLecturesParams } from "@/services/lectureService";

const cx = classNames.bind(styles);

export default function Lectures() {
  const navigate = useNavigate();
  const { activeClass } = useClass();
  const classId = activeClass?.id;

  // ---------------- State ----------------
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue, 300);

  const [filters, setFilters] = useState<GetLecturesParams>({
    search: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    order: "desc",
  });

  const [draftFilters, setDraftFilters] = useState({
    order: "desc" as "asc" | "desc",
  });

  // ---------------- React Query ----------------
  const { data, isLoading } = useLecturesQuery({
    classId: classId!,
    ...filters,
  });

  // ---------------- Sync search ----------------
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  if (!classId) return <p>Please select a class</p>;

  const lectures = data?.lectures || [];

  return (
    <div className={cx("lectures")}>
      {/* Header */}
      <div className={cx("lectures__header")}>
        <h2>Bài giảng</h2>

        <div className={cx("toolbar")}>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Tìm kiếm bài giảng..."
            className={cx("toolbar__search")}
          />

          <Filters
            filters={{ order: draftFilters.order }}
            onChange={(key, value) =>
              setDraftFilters((prev) => ({ ...prev, [key]: value }))
            }
            onClear={() => setDraftFilters({ order: "desc" })}
            onApply={() =>
              setFilters((prev) => ({
                ...prev,
                ...draftFilters,
                page: 1,
              }))
            }
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Loading />
      ) : lectures.length === 0 ? (
        <Empty
          icon="mdi:video-off-outline"
          title="Chưa có bài giảng"
          description="Hiện tại lớp chưa có nội dung"
        />
      ) : (
        <div className={cx("lectures__content")}>
          {lectures.map((item) => (
            <div
              key={item.id}
              className={cx("card")}
              onClick={() =>
                navigate(`/learning/class/lectures/${item.video.id}`)
              }
            >
              <div className={cx("thumb")}>
                {item.thumbnail ? (
                  <img src={item.thumbnail.url} alt={item.video.file_name} />
                ) : (
                  <div className={cx("thumb-icon")}>
                    <Icon icon="mdi:video-outline" />
                  </div>
                )}

                <div className={cx("thumb-overlay")}>
                  <Icon icon="gridicons:play" />
                </div>
              </div>

              <div className={cx("info")}>
                <p className={cx("name")}>{item.video.file_name}</p>
                <span className={cx("date")}>
                  {item.createdAt && formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className={cx("lectures__pagination")}>
        <PaginationControls
          currentPage={filters.page}
          totalPages={data?.pagination.totalPages || 1}
          itemsPerPage={filters.limit}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onItemsPerPageChange={(limit) =>
            setFilters((prev) => ({ ...prev, limit, page: 1 }))
          }
        />
      </div>
    </div>
  );
}
