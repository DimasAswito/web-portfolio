import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link as ScrollLink } from 'react-scroll';
import '../App.css';
import '../index.js';
import '../index.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: 'home', label: 'Home' },
    { to: 'about', label: 'About' },
    { to: 'education', label: 'Education' },
    { to: 'experience', label: 'Experience' },
    { to: 'projects', label: 'Projects' },
    { to: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-dark/80 backdrop-blur-md z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <ScrollLink to="home" smooth={true} duration={500} className="text-2xl font-bold gradient-text cursor-pointer">
            DA.
          </ScrollLink>
          <div className="hidden md:flex space-x-8">
            {links.map(link => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                className="nav-link cursor-pointer"
                activeClass="active-nav"
                spy={true}
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>
          <button
            className="md:hidden text-primary focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaBars className="text-2xl" />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-darker py-4 px-6">
          <div className="flex flex-col space-y-4">
            {links.map(link => (
              <ScrollLink
                key={link.to}
                to={link.to}
                smooth={true}
                duration={500}
                className="nav-link cursor-pointer"
                activeClass="active-nav"
                spy={true}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </ScrollLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
