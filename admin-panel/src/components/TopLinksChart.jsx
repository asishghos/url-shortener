import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function TopLinksChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/top-links")
      .then(res => setData(res.data));
  }, []);

  return (
    <Bar
      data={{
        labels: data.map(link => link._id),
        datasets: [{
          label: 'Top Short Links',
          data: data.map(link => link.clicks),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      }}
    />
  );
}

export default TopLinksChart;
