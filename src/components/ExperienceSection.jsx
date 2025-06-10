import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState([]);

  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === 'Present') {
      return dateString;
    }
    
    if (!/^\d{4}-\d{2}$/.test(dateString)) {
      return dateString; 
    }

    try {
      const [year, month] = dateString.split('-');
      const date = new Date(year, month - 1);
      
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
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">Work Experience</h2>
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 mb-12 timeline-item">
              <div className="timeline-dot"></div>
              <div className="bg-dark rounded-xl p-6 shadow-lg card-hover">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-primary">{exp.name}</h3>
                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
                    {formatDisplayDate(exp.start_month)} - {formatDisplayDate(exp.end_month)}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">{exp.position}</p>
                <p className="text-gray-400">{exp.location}</p>
                <ul className="mt-4 space-y-3 text-gray-300">
                  {exp.description?.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <i className="fas fa-code text-primary mt-1 mr-2"></i>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
