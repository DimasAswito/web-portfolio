import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// 1. Impor useTheme
import { useTheme } from '../ThemeContext';

export default function PublicLayout({ children }) {
  // 2. Panggil hook untuk mendapatkan tema saat ini
  const { theme } = useTheme();

  return (
    // 3. Ganti React Fragment (<>) dengan div dan terapkan kelas dinamis
    <div className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}