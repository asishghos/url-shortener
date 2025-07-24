import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DailyClicksChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/analytics/daily-clicks")
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <Line
      data={{
        labels: data.map(day => day._id.date),
        datasets: [{
          label: 'Daily Clicks',
          data: data.map(day => day.clicks),
          fill: false,
          borderColor: 'rgba(255, 99, 132, 0.8)',
        }]
      }}
    />
  );
}

export default DailyClicksChart;
