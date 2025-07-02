import React, { useEffect, useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { supabase } from '../supabaseClient';

import { useTranslation } from 'react-i18next';

//will add glow effect on public layout
export default function HeroSection() {
  const { t } = useTranslation();

  const [heroData, setHeroData] = useState({
    name: '',
    tagline: '',
    description: '',
    photo: 'https://ryvdyzrdffvjqfvkxdou.supabase.co/storage/v1/object/public/portfolio/profile/photo_2.jpg',
  });

  useEffect(() => {
    async function fetchHero() {
      const { data, error } = await supabase.from('header').select('*').single();
      if (!error && data) {
        setHeroData({
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          photo: data.photo_url, 
        });
      }
    }
    fetchHero();
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 dark:text-white">
              {t('home.greeting')} <span className="gradient-text">{heroData.name}</span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-primary">
              {heroData.tagline}
            </h2>

            <p className="text-lg mb-8 text-slate-700 dark:text-gray-300 max-w-lg">
              {heroData.description}
            </p>

            <div className="flex space-x-4">
              <ScrollLink
                to="contact"
                smooth={true}
                duration={500}
                className="cursor-pointer px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg shadow-primary/20 hover:bg-sky-600 transition duration-300"
              >
                {t('home.contact_me')}
              </ScrollLink>

              <ScrollLink
                to="projects"
                smooth={true}
                duration={500}
                className="cursor-pointer px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white dark:hover:bg-blue-900/30 dark:hover:text-primary transition duration-300"
              >
                {t('home.view_projects')}
              </ScrollLink>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-dark bg-opacity-90 flex items-center justify-center overflow-hidden">
                  <img
                    src={heroData.photo}
                    alt={heroData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}