import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
// Impor ikon yang akan digunakan
import { FaCode } from 'react-icons/fa';

export default function ExperienceSection() {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState([]);

  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === 'Present') {
      return 'Present'; // Pastikan output konsisten
    }
    
    if (!/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString; 
    }

    try {
      const [year, month] = dateString.split('-');
      const date = new Date(year, parseInt(month) - 1); // parseInt untuk keamanan
      
      return date.toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      });
    } catch (e) {
      console.error("Gagal memformat tanggal:", dateString, e);
      return dateString;
    }
  };

  useEffect(() => {
    async function fetchExperiences() {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_month', { ascending: false });

      if (!error && data) {
        setExperiences(data);
      } else {
        console.error('Failed to fetch experience data:', error);
      }
    }

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-20 overflow-hidden bg-slate-300 dark:bg-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('experience.title')}</h2>
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 mb-12 timeline-item">
              <div className="timeline-dot"></div>
              <div className="bg-white dark:bg-darker rounded-xl p-6 shadow-md dark:shadow-lg card-hover border border-gray-200 dark:border-transparent">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-primary">{exp.name}</h3>
                  <span className="text-sm bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                    {formatDisplayDate(exp.start_month)} - {formatDisplayDate(exp.end_month)}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-gray-300 mb-2 font-bold">{exp.position}</p>
                <p className="text-slate-500 dark:text-gray-400">{exp.location}</p>
                
                {Array.isArray(exp.description) && exp.description.length > 0 && (
                  <ul className="mt-4 space-y-3 text-slate-600 dark:text-gray-300">
                    {exp.description.filter(point => point && point.trim() !== "").map((point, i) => (
                      <li key={i} className="flex items-start">
                        <FaCode className="text-primary mt-1 mr-3 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}