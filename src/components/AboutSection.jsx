import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const iconMap = {
  linkedin: 'fab fa-linkedin',
  email: 'fas fa-envelope',
  phone: 'fas fa-phone',
};

  const GITHUB_USERNAME = 'DimasAswito';

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
        <div className="mt-20 flex flex-col items-center text-center">
  {/* Penjelasan:
    - `flex flex-col items-center`: Membuat div ini menjadi flex container, 
      menyusun anak-anaknya secara vertikal (flex-col), dan memusatkan mereka secara horizontal (items-center).
    - `text-center`: Memusatkan teks di dalam elemen ini dan anak-anaknya (berguna untuk h3 dan h5).
  */}
  <h3 className="text-2xl md:text-3xl font-bold mb-8 gradient-text">
    {/* text-center sudah ada di sini, jadi gradient-text akan terpusat */}
    My GitHub Contributions
  </h3>

  {/* Wrapper untuk mengontrol ukuran dan pemusatan gambar */}
  <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-4">
    {/* Penjelasan Wrapper Gambar:
      - `w-full`: Mengambil lebar penuh dari kontainer induknya (yang dibatasi oleh layout halaman Anda).
      - `max-w-xl md:max-w-2xl lg:max-w-3xl`: Ini yang akan membuat gambar Anda "lebih besar".
        Anda bisa sesuaikan nilai ini (misalnya, `max-w-md`, `max-w-4xl`, dll.) 
        untuk mendapatkan ukuran yang paling sesuai. Ini adalah lebar maksimum yang responsif.
      - `px-4`: Memberi sedikit padding horizontal jika diperlukan.
    */}
    <img
      className="w-full h-auto mx-auto" // `w-full` membuat gambar mengisi wrapper, `h-auto` menjaga aspek rasio, `mx-auto` memastikan terpusat jika ada sisa ruang.
      src="https://raw.githubusercontent.com/DimasAswito/DimasAswito/output/snake.svg"
      alt="Snake animation GitHub contributions"
    />
  </div>

  <h5 className="text-sm text-gray-500 mt-6"> 
    {/* mt-6 untuk jarak lebih dari gambar, text-center diwarisi dari div luar */}
    <a
      href={`https://github.com/${GITHUB_USERNAME}`} 
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary transition-colors duration-300"
    >
      Look my Github Profile
    </a>
  </h5>
</div>
      </div>
    </section>
  );
}
