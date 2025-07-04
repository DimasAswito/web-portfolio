import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export default function ProjectSection() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  
  const [visibleCount, setVisibleCount] = useState(6);

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

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };

  return (
    <section id="projects" className=" flex items-center py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('projects.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, visibleCount).map((project, index) => (
            <div key={index} className="bg-white dark:bg-dark rounded-xl p-6 shadow-lg dark:shadow-xl card-hover flex flex-col border border-gray-100 dark:border-transparent">
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
              
              {(project.github || project.detail_link) && (
                <div 
                  className={`mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center 
                              ${project.github && project.detail_link ? 'justify-between' : 'justify-center'}`}
                >
                  {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-gray-400 hover:text-primary transition duration-300" title="Lihat di GitHub">
                       <FaGithub className="text-2xl" />
                     </a>
                  )}
                  
                  {project.detail_link && (
                      <a 
                        href={project.detail_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-4 py-2 border border-primary text-primary font-semibold rounded-lg text-sm transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-px"
                      >
                       <span>{t('projects.view_project')}</span>
                       <FaExternalLinkAlt className="ml-2" />
                     </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {visibleCount < projects.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-primary/10 dark:bg-primary/20 text-primary font-semibold rounded-lg transition-all duration-300 hover:bg-primary hover:text-white dark:hover:text-dark hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1"
            >
              {t('projects.load_more', 'Lihat Proyek Lainnya')}
            </button>
          </div>
        )}

      </div>
    </section>
  );
}