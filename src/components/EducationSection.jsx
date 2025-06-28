import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';

export default function EducationSection() {
  const { t } = useTranslation();
  const [educations, setEducations] = useState([]);

  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === 'Present') return 'Present';
    try {
      if (!/^\d{4}-\d{2}$/.test(dateString)) return dateString;
      const [year, month] = dateString.split('-');
      const date = new Date(year, parseInt(month) - 1);
      return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    } catch (e) { return dateString; }
  };
  
  useEffect(() => {
    async function fetchEducations() {
      const { data, error } = await supabase.from('education').select('*').order('start_year', { ascending: false });
      if (!error && data) {
        setEducations(data);
      } else {
        console.error('Failed to fetch education data:', error);
      }
    }
    fetchEducations();
  }, []);

  return (
    <section id="education" className="min-h-screen flex items-center pt-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center gradient-text">{t('education.title')}</h2>
        
        <div className="max-w-3xl mx-auto">
          {educations.map((edu) => (
            <div key={edu.id} className="relative timeline-item">
              <div className="timeline-dot"></div>              
                <div className="bg-white dark:bg-dark rounded-xl p-6 shadow-md dark:shadow-lg card-hover border border-gray-200 dark:border-transparent">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-primary">
                      {edu.education_name}
                    </h3>
                    <span className="text-sm bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                      {formatDisplayDate(edu.start_year)} - {formatDisplayDate(edu.end_year)}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-gray-300 mb-2 font-medium">
                    {t('education.major')}: {edu.jurusan}{edu.nilai ? `, GPA: ${edu.nilai}` : ''}
                  </p>
                  <p className="text-slate-500 dark:text-gray-400">{edu.location}</p>
                      {(() => {
                        if (!Array.isArray(edu.description)) return null;
                        const validDescriptionPoints = edu.description.filter(point => point && point.trim() !== "");
                        if (validDescriptionPoints.length === 0) return null;
                        return (
                          <ul className="mt-4 space-y-2 text-slate-700 dark:text-gray-300">
                            {validDescriptionPoints.map((point, i) => (
                              <li key={i} className="flex items-start">
                                <FaCheck className="text-primary mt-1 mr-3 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
