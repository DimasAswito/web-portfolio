import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { supabase } from '../supabaseClient';
import useKonamiCode from '../hooks/useKonamiCode';

export default function PublicLayout({ children }) {
  const { t } = useTranslation();
  const hasCountedView = useRef(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    if (hasCountedView.current) return;
    hasCountedView.current = true;

    supabase.rpc('increment_page_views').then(({ error }) => {
      if (error) {
        console.error('Failed to increment page views:', error);
      }
    });
  }, []);

  const handleKonamiActivate = useCallback(() => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#0ea5e9', '#3b82f6', '#6366f1'],
    });
    setShowEasterEgg(true);
    setTimeout(() => setShowEasterEgg(false), 4000);
  }, []);

  useKonamiCode(handleKonamiActivate);

  return (
    <div className={`transition-colors duration-300 bg-light dark:bg-transparent`}>
      <ParticleBackground />
      <Navbar />
      <main>{children}</main>
      <Footer />

      {showEasterEgg && (
        <div
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] px-6 py-3 rounded-full bg-primary text-white dark:text-dark font-semibold shadow-xl shadow-primary/40 pointer-events-none"
          role="status"
        >
          {t('easterEgg.konami_message')}
        </div>
      )}
    </div>
  );
}
