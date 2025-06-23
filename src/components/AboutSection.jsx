import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const GITHUB_USERNAME = 'DimasAswito';

const sampleTechStack = [
  { name: 'HTML5', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'JavaScript', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'React', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'Node.js', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg' },
  { name: 'Tailwind CSS', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Supabase', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg' },
  { name: 'Figma', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
  { name: 'Kotlin', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg' },
  { name: 'Laravel', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg' },
];

export default function AboutSection() {
  const [about, setAbout] = useState({
    description: [],
    tags: [],
    tech_stack: [],
  });

  useEffect(() => {
    async function fetchAbout() {
      const { data, error } = await supabase.from('about').select('*').single();
      if (!error && data) {
        setAbout({
          description: data.description || [],
          tags: data.tag || [],
          // Gunakan data dari Supabase jika ada, jika tidak pakai data contoh
          tech_stack: (Array.isArray(data.tech_stack) && data.tech_stack.length > 0) ? data.tech_stack : sampleTechStack,
        });
      } else {
        console.error('Failed to fetch about data:', error);
        setAbout(prev => ({ ...prev, tech_stack: sampleTechStack }));
      }
    }
    fetchAbout();
  }, []);

  // CSS untuk animasi marquee. Perhatikan baik-baik bagian ini.
  const marqueeStyles = `
  @keyframes scroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  .scroller {
    animation: scroll 30s linear infinite;
  }
  `;


  return (
    <>
      <style>{marqueeStyles}</style>
      <section id="about" className="py-20 overflow-hidden bg-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">About Me</h2>
          
          <div className="max-w-3xl mx-auto text-center mb-6">
            {about.description.map((para, index) => (
              <p key={index} className="text-lg mb-6 text-gray-300">{para}</p>
            ))}
            <div className="flex flex-wrap gap-3 justify-center">
              {about.tags.map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-blue-900/40 text-primary rounded-full text-sm">{tag}</span>
              ))}
            </div>
            {/* Bagian Kontribusi GitHub */}
            <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-4">
              <img
                className="w-full h-auto mx-auto"
                src="https://raw.githubusercontent.com/DimasAswito/DimasAswito/output/snake.svg"
                alt="Snake animation GitHub contributions"
              />
            </div>
            <h5 className="text-sm text-gray-500 mt-6"> 
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-300">
                Look my Github Profile
              </a>
            </h5>
          </div>

          {/* === BAGIAN TECH STACK YANG DIPERBAIKI === */}
          <div className="w-full text-center">
            <h3 className="md:text-2xl font-bold mb-5 gradient-text">My Tech Stack</h3>
            
            {/* Kontainer luar untuk efek fade (masking) dan overflow */}
            <div 
              className="w-full inline-flex flex-nowrap overflow-hidden" 
              style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}
            >
              {/* Ini adalah elemen yang akan dianimasikan */}
              <div className="flex items-center justify-start scroller">
                  {/* Render item DUA KALI untuk loop yang mulus */}
                  {[...about.tech_stack, ...about.tech_stack].map((tech, index) => (
                      <div key={index} className="flex-shrink-0 w-40 flex flex-col items-center justify-center p-4">
                          <img
                              src={tech.logo_url}
                              alt={tech.name}
                              className="h-16 w-16 object-contain filter grayscale transition-all duration-300 hover:grayscale-0"
                          />
                          <p className="mt-2 text-sm text-gray-400">{tech.name}</p>
                      </div>
                  ))}
              </div>
            </div>
          </div>
          {/* === AKHIR BAGIAN TECH STACK === */}

          </div>
      </section>
    </>
  );
}