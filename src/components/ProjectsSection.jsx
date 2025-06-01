import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ProjectSection() {
  const [projects, setProjects] = useState([]);

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
    <section id="projects" className="py-20 bg-dark">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">My Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-darker rounded-xl p-6 shadow-lg card-hover">
              <div className="mb-4">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                  {project.start_month} - {project.end_month}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-primary">
                {project.project_name}
              </h3>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(project.tagline || []).map((tag, i) => (
                  <span key={i} className="text-xs bg-blue-900/30 text-primary px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <a href="https://github.com/ryvdyzrdffvjqfvkxdou" className="text-primary hover:text-blue-400 flex items-center">
                <span>View Details</span>
                <i className="fas fa-arrow-right ml-2"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
