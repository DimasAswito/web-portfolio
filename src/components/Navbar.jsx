import React, { useState } from 'react';
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';
import '../App.css';
import '../index.js';
import '../index.css';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../ThemeContext';


// Komponen kustom untuk bendera Indonesia (SVG)
const IndonesiaFlagIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6" aria-hidden="true">
    <rect fill="#fff" width="9" height="6"/>
    <rect fill="#ce1126" width="9" height="3"/>
  </svg>
);

// Komponen kustom untuk bendera Inggris (UK) (SVG)
const UkFlagIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" aria-hidden="true">
    <rect fill="#012169" width="1200" height="600"/>
    <g transform="translate(600,300)">
      <path d="M-600,300L600,-300M-600,-300L600,300" stroke="#fff" strokeWidth="60"/>
      <path d="M-600,300L600,-300M-600,-300L600,300" stroke="#C8102E" strokeWidth="40" transform="scale(0.85,1)"/>
      <path d="M-600,0H600M0,-300V300" stroke="#fff" strokeWidth="200"/>
      <path d="M-600,0H600M0,-300V300" stroke="#C8102E" strokeWidth="120"/>
    </g>
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { to: 'home', label: t('navbar.home') },
    { to: 'about', label: t('navbar.about') },
    { to: 'education', label: t('navbar.education') },
    { to: 'experience', label: t('navbar.experience') },
    { to: 'projects', label: t('navbar.projects') },
    { to: 'contact', label: t('navbar.contact') },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('id') ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };

  const iconTransitionStyles = `
    @keyframes icon-fade-in {
      from { opacity: 0; transform: scale(0.7); }
      to { opacity: 1; transform: scale(1); }
    }
    .icon-transition-enter {
      animation: icon-fade-in 0.3s ease-out;
    }
  `;

  return (
    <>
      <style>{iconTransitionStyles}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 shadow-lg transition-colors duration-300 
                      dark:bg-dark/80 bg-white/80 backdrop-blur-md`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <ScrollLink to="home" smooth={true} duration={500} className="text-2xl font-bold gradient-text cursor-pointer">
              DA.
            </ScrollLink>
            
            <div className="hidden md:flex items-center">
              <div className="flex space-x-8">
                {links.map(link => (
                  <ScrollLink
                    key={link.to}
                    to={link.to}
                    smooth={true}
                    duration={500}
                    spy={true}
                    // --- PERUBAHAN DI SINI ---
                    // Kembalikan kelas .nav-link dan .active-nav dari CSS
                    className="nav-link cursor-pointer"
                    activeClass="active-nav"
                  >
                    {link.label}
                  </ScrollLink>
                ))}
              </div>

              <div className="flex items-center space-x-4 ml-8">
                {/* ... Tombol tema dan bahasa tidak berubah ... */}
                <button
                  onClick={toggleTheme}
                  className="text-blue-900 dark:text-primary dark:hover:text-blue-400 hover:text-blue-600 transition-colors duration-300 w-8 h-8 flex items-center justify-center"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <FaSun key="sun" className="text-xl icon-transition-enter text-yellow-400" />
                  ) : (
                    <FaMoon key="moon" className="text-xl icon-transition-enter text-blue-900" />
                  )}
                </button>
                <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600"></div>
                <button onClick={toggleLanguage} className="hover:opacity-80 transition-opacity duration-300 w-8 h-8 flex items-center justify-center" aria-label="Toggle language">
                  {i18n.language.startsWith('en') ? (
                    <UkFlagIcon key="uk-flag" className="w-8 h-6 rounded icon-transition-enter" />
                  ) : (
                    <IndonesiaFlagIcon key="id-flag" className="w-8 h-6 rounded icon-transition-enter" />
                  )}
                </button>
              </div>
            </div>
            
            <button className="md:hidden text-primary dark:text-primary focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars className="text-2xl" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-darker py-4 px-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              {links.map(link => (
                <ScrollLink
                  key={link.to}
                  to={link.to}
                  smooth={true}
                  duration={500}
                  spy={true}
                  onClick={() => setMenuOpen(false)}
                  // --- PERUBAHAN DI SINI (MOBILE) ---
                  className="nav-link cursor-pointer text-center py-2"
                  activeClass="active-nav"
                >
                  {link.label}
                </ScrollLink>
              ))}
              {/* ... Kontrol mobile ... */}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}