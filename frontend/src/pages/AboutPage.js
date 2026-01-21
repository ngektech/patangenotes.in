import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Globe, Shield, Database, Heart, Award, Code, TrendingUp } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const expertise = [
  { icon: Shield, title: 'Security Engineering', description: 'Expert in cybersecurity, threat analysis, and infrastructure protection.' },
  { icon: Database, title: 'Data Analytics', description: 'Transforming complex data into actionable insights.' },
  { icon: Heart, title: 'Healthcare', description: 'UN Healthcare Associate working on global health initiatives.' },
  { icon: Globe, title: 'Geopolitics', description: 'Understanding global power dynamics and policy implications.' },
  { icon: Code, title: 'Engineering', description: 'Full-stack development and system architecture.' },
  { icon: TrendingUp, title: 'Business Strategy', description: 'Multi-dimensional entrepreneurship and growth.' }
];

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/adityapatange_', label: 'Instagram', handle: '@adityapatange_' },
  { icon: Linkedin, href: 'https://linkedin.com/in/adityapatange1', label: 'LinkedIn', handle: '/in/adityapatange1' },
  { icon: Github, href: 'https://github.com/AdityaPatange1', label: 'GitHub', handle: '@AdityaPatange1' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background" data-testid="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-[#0A0A0A] border border-[#262626] overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/5653485/pexels-photo-5653485.jpeg"
                  alt="Aditya Patange"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-white/20" />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4 block">
                The Founder
              </span>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
                Aditya Patange
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Multi-dimensional business entrepreneur, security engineer, data analyst, 
                and healthcare associate for the United Nations. An engineer in all departments, 
                driven by the belief that knowledge should serve the public good.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-[#0A0A0A] border border-[#262626] p-4">
                  <p className="font-mono text-3xl text-white font-bold">6+</p>
                  <p className="text-gray-500 text-sm mt-1">Areas of Expertise</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#262626] p-4">
                  <p className="font-mono text-3xl text-white font-bold">UN</p>
                  <p className="text-gray-500 text-sm mt-1">Healthcare Associate</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#0A0A0A] border border-[#262626] hover:border-white/40 px-4 py-3 transition-colors duration-300"
                    data-testid={`about-social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                    <span className="font-mono text-sm text-gray-400">{social.handle}</span>
                  </a>
                ))}
                <a
                  href="https://threads.net/@adityapatange_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#0A0A0A] border border-[#262626] hover:border-white/40 px-4 py-3 transition-colors duration-300"
                  data-testid="about-social-threads"
                >
                  <span className="font-mono text-lg text-gray-400">@</span>
                  <span className="font-mono text-sm text-gray-400">@adityapatange_</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expertise Grid */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4 block">
              Multidisciplinary
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              Areas of Expertise
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-[#262626] p-8 hover:border-white/40 transition-colors duration-500"
                data-testid={`expertise-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-8 h-8 text-gray-500 mb-6" strokeWidth={1.5} />
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4 block">
                Philosophy
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                Impatient Optimist
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Inspired by Bill Gates and his relentless pursuit of solving humanity's biggest 
                challenges, PatangeNotes embodies the spirit of an impatient optimist. We believe 
                that with the right knowledge, tools, and collective will, we can create a more 
                equitable world.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                This platform is built for public welfare and public good. Every insight shared 
                here aims to democratize knowledge, foster critical thinking, and inspire action 
                towards positive change.
              </p>
              <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#262626]">
                <Award className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
                <p className="text-gray-400 text-sm">
                  Built for Microsoft showcase - demonstrating enterprise-grade web engineering.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-[#0A0A0A] border border-[#262626] p-8">
                <blockquote className="font-heading text-2xl text-white leading-relaxed mb-4 italic">
                  "We are impatient optimists working for a future where technology serves 
                  humanity, not the other way around."
                </blockquote>
                <p className="font-mono text-sm text-gray-500 uppercase tracking-widest">
                  — Aditya Patange
                </p>
              </div>

              <div className="bg-[#0A0A0A] border border-[#262626] p-8">
                <h4 className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4">
                  Our Commitment
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                    Plain English writing with full source attribution.
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                    Evidence-based analysis and critical thinking.
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                    Open knowledge for public welfare.
                  </li>
                  <li className="flex items-start gap-3 text-gray-400">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mt-2" />
                    Enterprise-grade security and privacy.
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-8">
              Built for Public Good
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-12">
              PatangeNotes exists to share knowledge freely, inspire critical thinking, 
              and contribute to equitable outcomes worldwide. We believe that information, 
              when presented clearly and honestly, has the power to transform lives and societies.
            </p>
            <div className="inline-flex items-center gap-4 p-6 bg-[#0A0A0A] border border-[#262626]">
              <Globe className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
              <p className="text-gray-400 font-mono text-sm">
                Open. Transparent. For everyone.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
