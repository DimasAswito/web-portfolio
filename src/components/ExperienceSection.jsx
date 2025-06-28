import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { FaCode } from 'react-icons/fa';

export default function ExperienceSection() {
  const { t } = useTranslation();
  const [experiences, setExperiences] = useState([]);

  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === 'Present') {
      return 'Present'; 
    }
    
    if (!/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString; 
    }

    try {
      const [year, month] = dateString.split('-');
      const date = new Date(year, parseInt(month) - 1); 
      
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

  const ExperienceCard = ({ exp, isRightSide }) => (
    <div className="bg-white dark:bg-darker rounded-xl p-6 shadow-md dark:shadow-lg card-hover border border-gray-200 dark:border-transparent">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg md:text-xl font-semibold text-primary">{exp.name}</h3>
        <span className="text-xs md:text-sm bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full font-medium whitespace-nowrap">
          {formatDisplayDate(exp.start_month)} - {formatDisplayDate(exp.end_month)}
        </span>
      </div>
      <p className="text-slate-700 dark:text-gray-300 mb-2 font-semibold text-sm md:text-base">{exp.position}</p>
      <p className="text-slate-500 dark:text-gray-400 text-sm md:text-base">{exp.location}</p>
      {Array.isArray(exp.description) && exp.description.length > 0 && (
        <ul className="mt-4 space-y-3 text-slate-600 dark:text-gray-300 text-sm md:text-base">
          {exp.description.filter(point => point && point.trim() !== "").map((point, i) => (
            <li key={i} className="flex items-start">
              <FaCode className="text-primary mt-1 mr-3 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <section id="experience" className="py-20 bg-slate-300 dark:bg-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center gradient-text">{t('experience.title')}</h2>
        
        <div className="relative max-w-10xl mx-auto">
          <div className="hidden md:block absolute top-0 h-full w-0.5 bg-gradient-to-b from-primary/50 to-blue-600/50 left-1/2 -translate-x-1/2"></div>
          <div className="md:hidden absolute top-0 h-full w-0.5 bg-gradient-to-b from-primary/50 to-blue-600/50 left-4 -translate-x-1/2"></div>
          <div className="space-y-12 md:space-y-0">
            {experiences.map((exp, index) => {
              const isRightSide = index % 2 !== 0;

              return (
                <div key={exp.id} className="relative">
                  
                  <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full border-4 border-white dark:border-dark z-10 
                                  md:left-1/2 md:-translate-x-1/2 
                                  left-4 -translate-x-1/2`}>
                  </div>
                  
                  <div className={`
                    w-full md:w-1/2 
                    ${isRightSide ? 'md:pl-16' : 'md:pr-16'}
                    ${isRightSide ? 'md:ml-auto' : ''}
                    pl-12
                  `}>
                    <ExperienceCard exp={exp} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}