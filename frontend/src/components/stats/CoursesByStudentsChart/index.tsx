import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Cell, Pie, PieChart, ResponsiveContainer,Tooltip } from "recharts";
import styles from "./CoursesByStudentsChart.module.scss";

import type { CourseStudents } from "@interfaces/stats";
import statsService from "@services/statsService";

const cx = classNames.bind(styles);

// Mảng màu cho từng phần trong Pie
const COLORS = [
  "#4f46e5",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#0ea5e9",
  "#14b8a6",
  "#ec4899",
];

const CoursesByStudentsPieChart = () => {
  const [data, setData] = useState<CourseStudents[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await statsService.getStudentsPerCourse();
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map dữ liệu sang định dạng ChartDataInput của Recharts
  const chartData = data.map((item) => ({
    name: item.course_name,
    value: item.total_students,
  }));

  return (
    <div className={cx("chart-container")}>
      <div className={cx("header")}>
        <h3 className={cx("title")}>Học viên theo khóa học</h3>
      </div>

      {loading && <div className={cx("loading")}>Đang tải dữ liệu...</div>}
      {error && <div className={cx("empty")}>{error}</div>}

      {!loading && !error && (
        <>
          {chartData.length > 0 ? (
            <div className={cx("chart")}>
              <div className={cx("chart-wrapper")}>
                {/* PieChart */}
                <ResponsiveContainer width={320} height={320}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      labelLine={false}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                        value,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          innerRadius + (outerRadius - innerRadius) / 2;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="#fff"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `${value} học viên`}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend custom */}
                <div className={cx("legend")}>
                  {chartData.map((entry, index) => (
                    <div key={index} className={cx("legend-item")}>
                      <span
                        className={cx("color-box")}
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      {entry.name} ({entry.value})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={cx("empty")}>Không có dữ liệu</div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesByStudentsPieChart;
