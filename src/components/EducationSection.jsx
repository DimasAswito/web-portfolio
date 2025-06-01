import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function EducationSection() {
  const [educations, setEducations] = useState([]);

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
    <section id="education" className="py-20 bg-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">Education</h2>
        <div className="max-w-3xl mx-auto">
          {educations.map((edu, index) => (
            <div key={index} className="relative pl-8 mb-12 timeline-item">
              <div className="timeline-dot"></div>
              <div className="bg-darker rounded-xl p-6 shadow-lg card-hover">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-primary">
                    {edu.education_name}
                  </h3>
                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
                    {edu.start_year} - {edu.end_year}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">
                  {edu.jurusan}, {edu.nilai}
                </p>
                <p className="text-gray-400">{edu.location}</p>
                {/* Optional: Add achievements or highlights here if needed */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
