import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Card = ({ title, value }) => (
  <div className="bg-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-md w-full">
    <h3 className="text-sm text-muted-foreground mb-1 font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const Tabs = ({ selected, setSelected }) => (
  <div className="flex gap-2 p-1 bg-dark/80 backdrop-blur-md rounded-xl mb-4 ml-auto w-fit">
    {["Semua", "1 Tahun", "1 Bulan"].map((label) => (
      <button
        key={label}
        className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
          selected === label
            ? "bg-white text-black"
            : "text-white hover:bg-white/10"
        }`}
        onClick={() => setSelected(label)}
      >
        {label}
      </button>
    ))}
  </div>
);

export default function Dashboard() {
  const [filter, setFilter] = useState("Semua");
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    certificate: 0,
    qna: 0,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const tables = ["project", "experience", "certificate", "qna"];
      const newStats = { ...stats };

      for (const table of tables) {
        const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
        newStats[table] = count || 0;
      }

      setStats(newStats);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      let fromDate = new Date();
      if (filter === "1 Tahun") {
        fromDate.setFullYear(fromDate.getFullYear() - 1);
      } else if (filter === "1 Bulan") {
        fromDate.setMonth(fromDate.getMonth() - 1);
      } else {
        fromDate = new Date("2000-01-01");
      }

      const { data, error } = await supabase
        .from("qna")
        .select("created_at")
        .gte("created_at", fromDate.toISOString());

      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      const countByMonth = {};
      data.forEach((item) => {
        const date = new Date(item.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        countByMonth[month] = (countByMonth[month] || 0) + 1;
      });

      const labels = Object.keys(countByMonth).sort();
      const values = labels.map((label) => countByMonth[label]);

      setChartData({
        labels,
        datasets: [
          {
            label: "QnA Count",
            data: values,
            fill: false,
            borderColor: "#3b82f6",
            tension: 0.1,
          },
        ],
      });
    };

    fetchChartData();
  }, [filter]);

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card title="Projects" value={stats.project} />
        <Card title="Experience" value={stats.experience} />
        <Card title="Certificate" value={stats.certificate} />
        <Card title="Contact" value={stats.qna} />
      </div>

      <div className="bg-dark/80 backdrop-blur-md rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">QnA Activity</h2>
          <Tabs selected={filter} setSelected={setFilter} />
        </div>
        <div className="h-64">
          <Line data={chartData} />
        </div>
      </div>
    </div>
  );
}
