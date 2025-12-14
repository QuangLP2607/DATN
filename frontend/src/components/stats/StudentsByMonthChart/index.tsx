import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./StudentsByMonthChart.module.scss";

import type { StudentsByMonth } from "@interfaces/stats";
import statsService from "@services/statsService";

const cx = classNames.bind(styles);

const StudentsByMonthChart = () => {
  const [data, setData] = useState<StudentsByMonth[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await statsService.getStudentsByMonth();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format month/year for XAxis label
  const chartData = data.map((item) => ({
    ...item,
    label: `${String(item.month).padStart(2, "0")}/${item.year}`,
  }));

  return (
    <div className={cx("chart-container")}>
      <div className={cx("header")}>
        <h3 className={cx("title")}>Học viên đăng ký theo tháng</h3>
      </div>

      {loading && <div className={cx("loading")}>Đang tải dữ liệu...</div>}
      {error && <div className={cx("empty")}>{error}</div>}

      {!loading && !error && (
        <>
          {chartData.length > 0 ? (
            <div className={cx("chart")}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className={cx("empty")}>Không có dữ liệu</div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentsByMonthChart;
