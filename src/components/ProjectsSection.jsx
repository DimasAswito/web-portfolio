import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaExternalLinkAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import useInView from '../hooks/useInView';

const getLikedIdsFromStorage = () => {
  if (typeof window === 'undefined') return new Set();
  return new Set(
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith('liked_'))
      .map((key) => key.replace('liked_', ''))
  );
};

export default function ProjectSection() {
  const { t } = useTranslation();
  const [ref, isVisible] = useInView();
  const [projects, setProjects] = useState([]);
  const [likedIds, setLikedIds] = useState(getLikedIdsFromStorage);

  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedTag, setSelectedTag] = useState(null);

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

  const handleLike = async (project) => {
    const idKey = String(project.id);
    if (likedIds.has(idKey)) return;

    window.localStorage.setItem(`liked_${idKey}`, '1');
    setLikedIds(prev => new Set(prev).add(idKey));
    setProjects(prev =>
      prev.map(p => (p.id === project.id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    );

    const { error } = await supabase.rpc('increment_project_likes', { project_id: project.id });
    if (error) {
      console.error('Failed to like project:', error);
    }
  };

  const allTags = Array.from(
    new Set(projects.flatMap(project => Array.isArray(project.tagline) ? project.tagline : []))
  );

  const handleSelectTag = (tag) => {
    setSelectedTag(prevTag => (prevTag === tag ? null : tag));
    setVisibleCount(6);
  };

  const filteredProjects = selectedTag
    ? projects.filter(project => Array.isArray(project.tagline) && project.tagline.includes(selectedTag))
    : projects;

  return (
    <section
      id="projects"
      ref={ref}
      className={`flex items-center py-20 ${isVisible ? 'reveal-visible' : 'reveal-bottom'}`}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t('projects.title')}</h2>

        {allTags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => handleSelectTag(null)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-300 ${
                selectedTag === null
                  ? 'bg-primary text-white dark:text-dark'
                  : 'bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30'
              }`}
            >
              {t('projects.filter_all')}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-300 ${
                  selectedTag === tag
                    ? 'bg-primary text-white dark:text-dark'
                    : 'bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, visibleCount).map((project, index) => (
            <div key={index} className="bg-white dark:bg-dark rounded-xl overflow-hidden shadow-lg dark:shadow-xl card-hover flex flex-col border border-gray-100 dark:border-transparent">
              {project.img && (
                <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <img src={project.img} alt={project.project_name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                    {formatDisplayDate(project.start_month)} - {formatDisplayDate(project.end_month)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLike(project)}
                    disabled={likedIds.has(String(project.id))}
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full transition-colors duration-300 ${
                      likedIds.has(String(project.id))
                        ? 'text-red-500 cursor-default'
                        : 'text-slate-400 hover:text-red-500'
                    }`}
                    aria-label={t('projects.like')}
                    title={t('projects.like')}
                  >
                    {likedIds.has(String(project.id)) ? <FaHeart /> : <FaRegHeart />}
                    <span>{project.likes || 0}</span>
                  </button>
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
            </div>
          ))}
        </div>

        {visibleCount < filteredProjects.length && (
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