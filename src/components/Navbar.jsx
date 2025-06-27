import React, { useState } from 'react';
// Tambahkan FaSun dan FaMoon untuk ikon tema
import { FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';
import '../App.css';
import '../index.js';
import '../index.css';
import { useTranslation } from 'react-i18next';


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

  // State untuk tema dan bahasa
  const [theme, setTheme] = useState('dark');

  const links = [
    { to: 'home', label: t('navbar.home') },
    { to: 'about', label: t('navbar.about') },
    { to: 'education', label: t('navbar.education') },
    { to: 'experience', label: t('navbar.experience') },
    { to: 'projects', label: t('navbar.projects') },
    { to: 'contact', label: t('navbar.contact') },
  ];

  // 4. Perbarui fungsi toggle
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const toggleLanguage = () => {
    const newLang = i18n.language === 'id' ? 'en' : 'id';
    i18n.changeLanguage(newLang);
  };


  // CSS untuk animasi fade/pulse saat ikon berganti
  const iconTransitionStyles = `
    @keyframes icon-fade-in {
      from {
        opacity: 0;
        transform: scale(0.7);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    .icon-transition-enter {
      animation: icon-fade-in 0.3s ease-out;
    }
  `;

  return (
    <>
      {/* Sisipkan CSS animasi ke dalam dokumen */}
      <style>{iconTransitionStyles}</style>

      <nav className="fixed top-0 left-0 right-0 bg-dark/80 backdrop-blur-md z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <ScrollLink to="home" smooth={true} duration={500} className="text-2xl font-bold gradient-text cursor-pointer">
              DA.
            </ScrollLink>
            
            <div className="hidden md:flex items-center">
              {/* Menu Links */}
              <div className="flex space-x-8">
                {links.map(link => (
                  <ScrollLink key={link.to} to={link.to} smooth={true} duration={500} className="nav-link cursor-pointer" activeClass="active-nav" spy={true}>
                    {link.label}
                  </ScrollLink>
                ))}
              </div>

              {/* Kontrol Tema dan Bahasa */}
              <div className="flex items-center space-x-4 ml-8">
                {/* Tombol Tema */}
                <button
                  onClick={toggleTheme}
                  className="text-primary hover:text-blue-400 transition-colors duration-300 w-8 h-8 flex items-center justify-center"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <FaSun key="sun" className="text-xl icon-transition-enter" />
                  ) : (
                    <FaMoon key="moon" className="text-xl icon-transition-enter" />
                  )}
                </button>

                {/* Garis Pemisah */}
                <div className="w-[1px] h-6 bg-gray-600"></div>

                {/* Tombol Bahasa */}
                <button
                  onClick={toggleLanguage}
                  className="hover:opacity-80 transition-opacity duration-300 w-8 h-8 flex items-center justify-center"
                  aria-label="Toggle language"
                >
                  {i18n.language.startsWith('en') ? (
                    <UkFlagIcon key="uk-flag" className="w-8 h-6 rounded icon-transition-enter" />
                  ) : (
                    <IndonesiaFlagIcon key="id-flag" className="w-8 h-6 rounded icon-transition-enter" />
                  )}
                </button>
              </div>
            </div>
            
            <button className="md:hidden text-primary focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-darker py-4 px-6">
            <div className="flex flex-col space-y-4">
              {links.map(link => (
                <ScrollLink key={link.to} to={link.to} smooth={true} duration={500} className="nav-link cursor-pointer text-center py-2" activeClass="active-nav" spy={true} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </ScrollLink>
              ))}

              <div className="border-t border-gray-700 mt-4 pt-4">
                <div className="flex justify-center items-center space-x-6">
                  {/* Tombol Tema Mobile */}
                  <button
                    onClick={toggleTheme}
                    className="text-primary hover:text-blue-400 transition-colors duration-300 flex items-center gap-2"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <FaSun key="sun-mobile" className="text-xl icon-transition-enter" />
                    ) : (
                      <FaMoon key="moon-mobile" className="text-xl icon-transition-enter" />
                    )}
                    <span className="text-gray-300 text-sm">Mode</span>
                  </button>

                  {/* Tombol Bahasa Mobile */}
                   <button
                      onClick={toggleLanguage}
                      className="hover:opacity-80 transition-opacity duration-300 flex items-center gap-2"
                      aria-label="Toggle language"
                  >
                      {i18n.language.startsWith('en') ? (
                       <UkFlagIcon key="uk-flag-mobile" className="w-8 h-6 rounded icon-transition-enter" />
                    ) : (
                       <IndonesiaFlagIcon key="id-flag-mobile" className="w-8 h-6 rounded icon-transition-enter" />
                    )}
                      <span className="text-gray-300 text-sm">Bahasa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}