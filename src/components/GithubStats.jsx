import React, { useEffect, useState } from 'react';
import { FaCodeBranch, FaUserFriends, FaUsers } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const GITHUB_USERNAME = 'DimasAswito';

export default function GithubStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setStats({
            repos: data.public_repos,
            followers: data.followers,
            following: data.following,
          });
        }
      } catch (err) {
        // Rate limit atau proxy gagal: gagal diam-diam, komponen tidak render apa-apa.
        console.error('Failed to fetch GitHub stats:', err);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  if (!stats) return null;

  const items = [
    { icon: <FaCodeBranch />, label: t('about.githubRepos'), value: stats.repos },
    { icon: <FaUserFriends />, label: t('about.githubFollowers'), value: stats.followers },
    { icon: <FaUsers />, label: t('about.githubFollowing'), value: stats.following },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 bg-white dark:bg-darker rounded-xl px-5 py-3 shadow border border-gray-200 dark:border-gray-800">
          <span className="text-primary text-xl">{item.icon}</span>
          <div className="text-left">
            <p className="text-lg font-semibold text-slate-800 dark:text-white">{(item.value ?? 0).toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-gray-400">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
