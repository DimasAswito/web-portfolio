import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
// Impor ikon yang akan digunakan
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export default function ProjectSection() {
  const { t } = useTranslation();
  const [projects, setProjects] =useState([]);

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
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('project')
        .select('*')
        .order('start_month', { ascending: false });

      if (!error && data) {
        setProjects(data);
      } else {
        console.error('Failed to fetch project data:', error);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-20 overflow-hidden bg-white dark:bg-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('projects.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white dark:bg-darker rounded-xl p-6 shadow-lg dark:shadow-xl card-hover flex flex-col border border-gray-100 dark:border-transparent">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                  {formatDisplayDate(project.start_month)} - {formatDisplayDate(project.end_month)}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {project.project_name}
              </h3>
              <p className="text-slate-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(project.tagline || []).map((tag, i) => (
                  <span key={i} className="text-xs bg-sky-100 dark:bg-blue-900/40 text-sky-800 dark:text-primary px-2 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                {project.github && (
                   <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-gray-400 hover:text-primary transition duration-300" title="Lihat di GitHub">
                    <FaGithub className="text-2xl" />
                  </a>
                )}
                
                {project.detail_link && (
                   <a href={project.detail_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-sky-700 dark:hover:text-sky-400 flex items-center font-semibold text-sm">
                    <span>{t('projects.view_project')}</span>
                    <FaExternalLinkAlt className="ml-2" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}