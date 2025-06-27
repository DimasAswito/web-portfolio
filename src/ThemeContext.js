import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Buat Context
const ThemeContext = createContext();

// 2. Buat Provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); // Default theme

  // Efek untuk menambahkan/menghapus kelas 'dark' dari elemen <html>
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Buat custom hook untuk menggunakan context dengan mudah
export const useTheme = () => useContext(ThemeContext);