import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function SkillsChart() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function fetchSkills() {
      const { data, error } = await supabase
        .from('skill')
        .select('*')
        .order('level', { ascending: true });

      if (!error && data) {
        setSkills(data);
      } else if (error) {
        console.error('Failed to fetch skill data:', error);
      }
    }
    fetchSkills();
  }, []);

  if (skills.length === 0) return null;

  const data = {
    labels: skills.map((skill) => skill.name),
    datasets: [
      {
        label: 'Level',
        data: skills.map((skill) => skill.level),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.parsed.x}%` } },
    },
    scales: {
      x: { min: 0, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.15)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { display: false } },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ height: `${skills.length * 40 + 40}px` }}>
      <Bar data={data} options={options} />
    </div>
  );
}
