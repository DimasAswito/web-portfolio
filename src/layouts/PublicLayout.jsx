import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useTheme } from '../ThemeContext';

export default function PublicLayout({ children }) {
  const { theme } = useTheme();

  return (
    <div className={`transition-colors duration-300 bg-light dark:bg-transparent`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
