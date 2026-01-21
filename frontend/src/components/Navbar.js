import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, Search, Lock } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/blog', label: 'Insights' },
    { path: '/about', label: 'About' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            data-testid="navbar-logo"
          >
            <Activity className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <span className="font-heading text-xl font-bold tracking-tight text-white">
              PatangeNotes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`text-sm font-mono uppercase tracking-widest transition-colors duration-300 ${
                  isActive(link.path) 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/blog?search=true"
              className="text-gray-400 hover:text-white transition-colors duration-300"
              data-testid="nav-search-btn"
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300 ml-4 px-4 py-2 border border-white/20 hover:border-white/40 rounded-sm"
              data-testid="nav-admin-login-btn"
            >
              <Lock className="w-4 h-4" strokeWidth={1.5} />
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            data-testid="mobile-menu-btn"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050505] border-b border-white/5"
          >
            <div className="px-6 py-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-mono uppercase tracking-widest ${
                    isActive(link.path) ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-gray-400"
              >
                <Lock className="w-4 h-4" strokeWidth={1.5} />
                Admin Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
