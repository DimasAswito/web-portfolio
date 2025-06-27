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
import CertificateSection from './components/CertificateSection';
import ContactSection from './components/ContactSection';

// Komponen admin
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import HeroAdmin from './admin/HeroAdmin';
import AboutAdmin from './admin/AboutAdmin';
import EducationAdmin from './admin/EducationAdmin';
import ExperienceAdmin from './admin/ExperienceAdmin';
import ProjectsAdmin from './admin/ProjectAdmin';
import CertificateAdmin from './admin/CertificateAdmin';
import ContactAdmin from './admin/ContactAdmin';
import QnAAdmin from './admin/QnAAdmin';

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
            <CertificateSection />
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

        <Route path="/admin/hero" element={
          <AdminLayout>
            <HeroAdmin />
          </AdminLayout>
        } />

        <Route path="/admin/about" element={
          <AdminLayout>
            <AboutAdmin />
          </AdminLayout>
        } />

        <Route path="/admin/education" element={
          <AdminLayout>
            <EducationAdmin />
          </AdminLayout>
        } />

        <Route path="/admin/experience" element={
          <AdminLayout>
            <ExperienceAdmin />
          </AdminLayout>
        } />

        <Route path="/admin/project" element={
          <AdminLayout>
            <ProjectsAdmin />
          </AdminLayout>
        } />

        <Route path="/admin/certificate" element={
          <AdminLayout>
            <CertificateAdmin />
          </AdminLayout>
        } />

        <Route path="/admin/contact" element={
          <AdminLayout>
            <ContactAdmin />
          </AdminLayout>
        } />

        <Route path="/admin/qna" element={
          <AdminLayout>
            <QnAAdmin />
          </AdminLayout>
        } />

      </Routes>
    </Router>
  );
}

export default App;
