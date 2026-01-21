import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Instagram, Linkedin, Github, Send, Heart } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/newsletter/subscribe`, { email });
      toast.success('Successfully subscribed to newsletter');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/adityapatange_', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/in/adityapatange1', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/AdityaPatange1', label: 'GitHub' }
  ];

  return (
    <footer className="bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {/* Newsletter Section */}
        <div className="mb-16 pb-16 border-b border-white/5">
          <div className="max-w-2xl">
            <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Informed
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              Get insights on geopolitics, AI, security, and public policy delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-[#0A0A0A] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-4 font-mono text-sm transition-colors duration-300"
                data-testid="newsletter-email-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black hover:bg-gray-200 font-mono uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="newsletter-submit-btn"
              >
                {loading ? 'Subscribing...' : (
                  <>
                    Subscribe <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <Activity className="w-7 h-7 text-white" strokeWidth={1.5} />
              <span className="font-heading text-xl font-bold text-white">PatangeNotes</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Inspired by Bill Gates and his vision for a better world. We are impatient optimists 
              committed to public welfare and creating equitable outcomes through knowledge sharing.
            </p>
            <p className="text-sm text-gray-500 font-mono">
              Built for public good. Open knowledge for all.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest text-white mb-6">Navigate</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest text-white mb-6">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 text-gray-400 hover:border-white hover:text-white transition-colors duration-300 rounded-sm"
                  data-testid={`footer-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-5 h-5" strokeWidth={1.5} />
                </a>
              ))}
              <a
                href="https://threads.net/@adityapatange_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-white/20 text-gray-400 hover:border-white hover:text-white transition-colors duration-300 rounded-sm font-mono text-xs"
                data-testid="footer-social-threads"
              >
                @
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-mono">
            © {new Date().getFullYear()} PatangeNotes. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500" /> for public welfare
          </p>
        </div>
      </div>
    </footer>
  );
};
