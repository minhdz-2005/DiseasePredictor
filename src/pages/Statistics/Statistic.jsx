import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Statistic.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const Statistic = () => {
  const { t } = useTranslation();
  const [rawData, setRawData] = useState([]);
  const [translatedData, setTranslatedData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/statistics")
      .then((response) => {
        setRawData(response.data.statistics);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, []);

  useEffect(() => {
    // B1: Sắp xếp giảm dần theo count
    const sortedData = [...rawData].sort((a, b) => b.count - a.count);
    // B2: Lấy 5 phần tử đầu
    const top5 = sortedData.slice(0, 5);
    // B3: Dịch tên bệnh
    const mapped = top5.map((item) => ({
      ...item,
      disease: t(`disease.${item.disease}`),
    }));
    setTranslatedData(mapped);
  }, [rawData, t]); // Gọi lại khi ngôn ngữ thay đổi

  return (
    <div className="page-container">
      <div className="chart-container">
        <div className="statistic-header">
          <span className="statisticIcon">📊</span>
          <h4>{t("statisticpage.title")}</h4>
          <h6>{t("statisticpage.subtitle")}</h6>
        </div>

        <ResponsiveContainer width="100%" height="75%">
          <BarChart data={translatedData} layout="vertical" margin={{ top: 20, right: 40, left: 50, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              dataKey="disease" 
              type="category" 
              width={150}
              tick={{ fontSize: 15 }} />
            <Tooltip formatter={(value) => [value, t("statisticpage.countLabel")]} />
            <Bar dataKey="count" fill="#7169DA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistic;
