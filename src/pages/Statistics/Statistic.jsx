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

const Statistic = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/statistics")
      .then((response) => {
        setData(response.data.statistics);
      })
      .catch((error) => {
        console.error("Error fetching statistics:", error);
      });
  }, []);

  return (
    <div className="chart-container">
      <h4>Statistics of Disease Prediction</h4>
      <h6>Base on Prediction times</h6>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="disease" type="category" />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Statistic;
