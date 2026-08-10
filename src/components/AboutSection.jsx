import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { ActivityCalendar } from 'react-activity-calendar';
import GithubStats from './GithubStats';
import useInView from '../hooks/useInView';
import { useTheme } from '../ThemeContext';

const GITHUB_USERNAME = 'DimasAswito';

const CALENDAR_THEME = {
  light: ['#e2e8f0', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9'],
  dark: ['#1e293b', '#075985', '#0369a1', '#0284c7', '#38bdf8'],
};

const sampleTechStack = [
  { name: 'HTML5', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'JavaScript', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'React', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Node.js', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg' },
  { name: 'Tailwind CSS', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Supabase', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
  { name: 'Figma', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
  { name: 'Kotlin', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg' },
  { name: 'Laravel', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg' },
];

export default function AboutSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [ref, isVisible] = useInView();

  const [about, setAbout] = useState({
    description: [],
    tags: [],
    tech_stack: [],
  });

  const [contributions, setContributions] = useState([]);
  const [contribLoading, setContribLoading] = useState(true);
  const [contribError, setContribError] = useState(false);

  useEffect(() => {
    async function fetchAbout() {
      const { data, error } = await supabase.from('about').select('*').single();
      if (!error && data) {
        setAbout({
          description: data.description || [],
          tags: data.tag || [],
          tech_stack: (Array.isArray(data.tech_stack) && data.tech_stack.length > 0) ? data.tech_stack : sampleTechStack,
        });
      } else {
        console.error('Failed to fetch about data:', error);
        setAbout(prev => ({ ...prev, tech_stack: sampleTechStack }));
      }
    }
    fetchAbout();
  }, []);

  useEffect(() => {
    async function fetchContributions() {
      setContribLoading(true);
      setContribError(false);
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`);
        if (!res.ok) throw new Error(`Contributions API error: ${res.status}`);
        const json = await res.json();
        const rawContributions = Array.isArray(json.contributions) ? json.contributions : [];
        // The API returns entries newest-year-first (not strictly chronological),
        // but ActivityCalendar derives its date range from the first/last array
        // items, so an unsorted array can hand it an inverted (end-before-start)
        // range and crash with "RangeError: Invalid interval".
        const sortedContributions = [...rawContributions].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setContributions(sortedContributions);
      } catch (err) {
        console.error('Failed to fetch GitHub contributions:', err);
        setContribError(true);
      } finally {
        setContribLoading(false);
      }
    }
    fetchContributions();
  }, []);

  const marqueeStyles = `
    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .scroller {
      animation: scroll 30s linear infinite;
    }
  `;

  return (
    <>
      <style>{marqueeStyles}</style>
      <section
        id="about"
        ref={ref}
        className={`py-20 overflow-hidden bg-slate-300 dark:bg-dark ${isVisible ? 'reveal-visible' : 'reveal-bottom'}`}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('about.title')}</h2>
          
          <div className="max-w-3xl mx-auto text-center mb-20">
            {about.description.map((para, index) => (
              <p key={index} className="text-lg mb-6 text-slate-700 dark:text-gray-300">{para}</p>
            ))}
            <div className="flex flex-wrap gap-3 justify-center">
              {about.tags.map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-primary/10 text-primary dark:bg-blue-900/40 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full text-center mb-20">
            <h3 className="md:text-2xl font-bold mb-7 gradient-text">{t('about.techStackTitle')}</h3>
            <div 
              className="w-full inline-flex flex-nowrap overflow-hidden" 
              style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}
            >
              <div className="flex items-center justify-start scroller">
                {[...about.tech_stack, ...about.tech_stack].map((tech, index) => (
                  <div key={index} className="flex-shrink-0 w-40 flex flex-col items-center justify-center p-4">
                    <img
                      src={tech.logo_url}
                      alt={tech.name}
                      className="h-16 w-16 object-contain filter grayscale transition-all duration-300 hover:grayscale-0"
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{tech.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h3 className="md:text-2xl font-bold mb-8 gradient-text">{t('about.githubTitle')}</h3>
            <GithubStats />
            <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-4 overflow-x-auto">
              {contribError ? (
                <img
                  className="w-full h-auto mx-auto"
                  src="https://raw.githubusercontent.com/DimasAswito/DimasAswito/output/snake.svg"
                  alt="Snake animation GitHub contributions"
                />
              ) : (
                <div className="flex justify-center min-w-max mx-auto">
                  <ActivityCalendar
                    data={contributions}
                    loading={contribLoading}
                    colorScheme={theme === 'dark' ? 'dark' : 'light'}
                    theme={CALENDAR_THEME}
                    blockSize={11}
                    blockMargin={3}
                    fontSize={12}
                    labels={{ totalCount: '{{count}} contributions in {{year}}' }}
                  />
                </div>
              )}
            </div>
            <h5 className="text-sm text-gray-600 dark:text-gray-500 mt-6">
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
                {t('about.githubLink')}
              </a>
            </h5>
          </div>
        </div>
      </section>
    </>
  );
}