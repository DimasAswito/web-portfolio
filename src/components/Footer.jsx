import React from 'react';
import { FaHeart, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa'; // FaHeart ditambahkan
import { Link as ScrollLink } from 'react-scroll';

// 1. Impor hook useTranslation
import { useTranslation } from 'react-i18next';

export default function Footer() {
  // 2. Panggil hook untuk mendapatkan fungsi 't'
  const { t } = useTranslation();

  // Array ini berisi kunci untuk navigasi
  const links = ['home', 'about', 'education', 'experience', 'projects', 'contact'];

  return (
    <footer className="py-8 bg-dark border-t border-gray-800">
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
                className="text-gray-400 hover:text-primary transition duration-300 cursor-pointer capitalize"
              >
                {/* 3. Gunakan t() untuk menerjemahkan label dari kunci di array */}
                {t(`navbar.${link}`)}
              </ScrollLink>
            ))}
          </div>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/aswito-406ab0216/" target="_blank" rel="noopener noreferrer" className="text-xl text-gray-400 hover:text-primary transition duration-300">
              <FaLinkedin />
            </a>
            <a href="mailto:dimasaswito@gmail.com" className="text-xl text-gray-400 hover:text-primary transition duration-300">
              <FaEnvelope />
            </a>
            <a href="tel:082116848487" className="text-xl text-gray-400 hover:text-primary transition duration-300">
              <FaPhone />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          {/* 4. Ganti teks hak cipta */}
          <p>&copy; {new Date().getFullYear()} Dimas Aswito. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}