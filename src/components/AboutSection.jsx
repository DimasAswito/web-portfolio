import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

// Hapus atau sesuaikan iconMap karena sudah tidak digunakan
// const iconMap = { ... };

// GITHUB_USERNAME bisa dipindah ke dalam komponen jika Anda lebih suka
const GITHUB_USERNAME = 'DimasAswito';

// Data contoh untuk Tech Stack. Nantinya, Anda akan mengambil ini dari Supabase.
// Pastikan URL logo valid. Anda bisa mencari logo di situs seperti devicon.dev
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
          // Nantinya, Anda akan mengambil data tech_stack seperti ini:
          tech_stack: data.tech_stack || [],
          
          // Untuk sekarang, kita gunakan data contoh
          // tech_stack: sampleTechStack,
        });
      } else {
        console.error('Failed to fetch about data:', error);
        // Jika gagal fetch, tetap gunakan data contoh agar komponen tidak kosong
        setAbout(prev => ({ ...prev, tech_stack: sampleTechStack }));
      }
    }
    fetchAbout();
  }, []);

  // CSS untuk animasi marquee
const marqueeStyles = `
    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .scroller {
      animation: scroll 15s linear infinite;
    }
  `;


  return (
    <>
      {/* Sisipkan CSS animasi ke dalam dokumen */}
      <style>{marqueeStyles}</style>

      <section id="about" className="pt-20 overflow-hidden bg-dark"> {/* Tambahkan overflow-hidden */}
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">About Me</h2>
          
          {/* Layout Satu Kolom Terpusat untuk Deskripsi dan Tag */}
          <div className="max-w-3xl mx-auto text-center mb-8">
            {about.description.map((para, index) => (
              <p key={index} className="text-lg mb-6 text-gray-300">
                {para}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 justify-center">
              {about.tags.map((tag, index) => (
                <span key={index} className="px-4 py-2 bg-blue-900/40 text-primary rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col items-center text-center">
            <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-4">
              <img
                className="w-full h-auto mx-auto"
                src="https://raw.githubusercontent.com/DimasAswito/DimasAswito/output/snake.svg"
                alt="Snake animation GitHub contributions"
              />
            </div>
            <h4 className="text-sm text-gray-500 mt-6"> 
              <a
                href={`https://github.com/${GITHUB_USERNAME}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300"
              >
                Look my Github Profile
              </a>
            </h4>
          </div>
          </div>

          
{/* === BAGIAN TECH STACK (Loop Mulus & Tidak Berhenti Saat Hover) === */}
<div className="w-full text-center mb-20">
  <h5 className="md:text-2xl font-bold mb-7 gradient-text">My Tech Stack </h5>
  
  <div 
    className="relative w-full" 
    style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'}}
  >
      <div className="flex min-w-full scroller">
          {/* 1. Render item DUA KALI untuk loop yang mulus */}
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

          {/* Bagian Kontribusi GitHub (tetap sama) */}
          
        </div>
      </section>
    </>
  );
}