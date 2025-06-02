import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const iconMap = {
  linkedin: 'fab fa-linkedin',
  email: 'fas fa-envelope',
  phone: 'fas fa-phone',
};

export default function AboutSection() {
  const [about, setAbout] = useState({
    description: [],
    tags: [],
    skills: [],
    social_media: [],
  });

  useEffect(() => {
    async function fetchAbout() {
      const { data, error } = await supabase.from('about').select('*').single();
      if (!error && data) {
        setAbout({
          description: data.description || [],
          tags: data.tag || [],
          skills: data.skill || [],
          social_media: data.socialMedia || [],
        });
      } else {
        console.error('Failed to fetch about data:', error);
      }
    }
    fetchAbout();
  }, []);

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">About Me</h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            {about.description.map((para, index) => (
              <p key={index} className="text-lg mb-6 text-gray-300">
                {para}
              </p>
            ))}
            <div className="flex flex-wrap gap-4 mb-8">
              {about.tags.map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-blue-900/30 text-primary rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex space-x-4">
              {about.social_media.map((s, index) => (
                <a
                  key={index}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-primary hover:text-blue-400 transition duration-300"
                >
                  <i className={iconMap[s.type] || 'fas fa-link'}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="bg-dark rounded-xl p-8 shadow-lg card-hover">
              <h3 className="text-xl font-semibold mb-6 text-primary">My Skills</h3>
              <div className="space-y-6">
                {about.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-primary">{skill.percentage}%</span>
                    </div>
                    <div className="skill-bar bg-gray-700 h-2 rounded-full">
                      <div
                        className="skill-progress bg-primary h-2 rounded-full"
                        style={{ width: `${skill.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
