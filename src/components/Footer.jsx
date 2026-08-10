import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaEnvelope, FaPhone, FaEye } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import PresenceIndicator from './PresenceIndicator';

export default function Footer() {
  const { t } = useTranslation();
  const links = ['home', 'about', 'education', 'experience', 'projects', 'guestbook', 'contact'];
  const [pageViews, setPageViews] = useState(null);

  useEffect(() => {
    const fetchPageViews = async () => {
      const { data, error } = await supabase
        .from('site_stats')
        .select('value')
        .eq('key', 'page_views')
        .single();
      if (!error && data) {
        setPageViews(data.value);
      }
    };
    fetchPageViews();
  }, []);

  return (
    <footer className="py-8 bg-slate-200 dark:bg-dark border-t border-slate-300 dark:border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <ScrollLink to="home" smooth={true} duration={500} className="text-2xl font-bold gradient-text cursor-pointer">
              DA.
            </ScrollLink>
          </div>
          <div className="flex flex-wrap justify-center space-x-6 mb-4 md:mb-0">
            {links.map(link => (
              <ScrollLink
                key={link}
                to={link}
                smooth={true}
                duration={500}
                className="text-slate-600 dark:text-gray-400 hover:text-primary transition duration-300 cursor-pointer capitalize font-medium"
              >
                {t(`navbar.${link}`)}
              </ScrollLink>
            ))}
          </div>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/aswito-406ab0216/" target="_blank" rel="noopener noreferrer" className="text-xl text-slate-500 dark:text-gray-400 hover:text-primary transition duration-300">
              <FaLinkedin />
            </a>
            <a href="mailto:dimasaswito@gmail.com" className="text-xl text-slate-500 dark:text-gray-400 hover:text-primary transition duration-300">
              <FaEnvelope />
            </a>
            <a href="wa.me/6282116848497" className="text-xl text-slate-500 dark:text-gray-400 hover:text-primary transition duration-300">
              <FaPhone />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-300 dark:border-gray-800 text-center text-slate-500 dark:text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Dimas Aswito. {t('footer.rights')}</p>
          <div className="mt-2 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-gray-600">
            {pageViews !== null && (
              <span className="flex items-center gap-1.5">
                <FaEye />
                <span>{t('site_stats.page_views')}: {pageViews.toLocaleString()}</span>
              </span>
            )}
            <PresenceIndicator />
          </div>
        </div>
      </div>
    </footer>
  );
}