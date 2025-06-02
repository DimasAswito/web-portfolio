import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Komponen halaman publik
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import EducationSection from './components/EducationSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

// Komponen admin
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route publik dengan layout */}
        <Route path="/" element={
          <PublicLayout>
            <HeroSection />
            <AboutSection />
            <EducationSection />
            <ExperienceSection />
            <ProjectsSection />
            <ContactSection />
          </PublicLayout>
        } />

        {/* Login tanpa layout (halaman kosong) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Dashboard dengan AdminLayout */}
        <Route path="/admin/dashboard" element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
