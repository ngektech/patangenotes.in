import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Globe, Heart, Cpu, BookOpen } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BlogCard } from '../components/BlogCard';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const categories = [
  { name: 'Artificial Intelligence', icon: Cpu, description: 'Exploring the frontier of machine intelligence.' },
  { name: 'Geopolitics', icon: Globe, description: 'Understanding global power dynamics.' },
  { name: 'Security', icon: Shield, description: 'Cybersecurity and infrastructure protection.' },
  { name: 'Healthcare', icon: Heart, description: 'Innovation in public health.' },
  { name: 'Public Policy', icon: BookOpen, description: 'Shaping equitable outcomes.' },
  { name: 'Technology', icon: TrendingUp, description: 'Emerging tech and data analytics.' }
];

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [featuredRes, recentRes] = await Promise.all([
          axios.get(`${API_URL}/api/posts?featured=true&limit=2`),
          axios.get(`${API_URL}/api/posts?limit=6`)
        ]);
        setFeaturedPosts(featuredRes.data.posts);
        setRecentPosts(recentRes.data.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-6 block">
              Insights for Public Good
            </span>
            
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-white mb-8">
              Shaping the Future
              <span className="block text-gray-500">Through Knowledge</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mb-12">
              Exploring geopolitics, artificial intelligence, public policy, and technology 
              to create equitable outcomes for all. Inspired by visionaries, built for public welfare.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/blog"
                className="bg-white text-black hover:bg-gray-200 font-mono uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-colors duration-300 flex items-center justify-center gap-2"
                data-testid="hero-explore-btn"
              >
                Explore Insights <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="bg-transparent border border-white/20 text-white hover:border-white hover:bg-white/5 font-mono uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-colors duration-300 text-center"
                data-testid="hero-about-btn"
              >
                About the Author
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <blockquote className="font-heading text-2xl md:text-4xl text-white leading-relaxed mb-8 italic">
              "Like Bill Gates, we are impatient optimists. We believe that through knowledge, 
              innovation, and collective action, we can solve humanity's greatest challenges."
            </blockquote>
            <p className="font-mono text-sm uppercase tracking-widest text-gray-500">
              — The PatangeNotes Philosophy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-24 border-t border-white/5" data-testid="featured-posts-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
                Featured Insights
              </h2>
              <Link
                to="/blog"
                className="text-gray-400 hover:text-white font-mono uppercase tracking-widest text-xs hover:underline decoration-1 underline-offset-4 transition-colors duration-300"
              >
                View All
              </Link>
            </div>

            <div className="space-y-8">
              {featuredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4 block">
              Areas of Focus
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              Topics We Explore
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/blog?category=${encodeURIComponent(category.name)}`}
                  className="group block bg-[#0A0A0A] border border-[#262626] hover:border-white/40 p-8 transition-all duration-500 hover:-translate-y-1"
                  data-testid={`category-card-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <category.icon className="w-8 h-8 text-gray-500 group-hover:text-white transition-colors duration-300 mb-6" strokeWidth={1.5} />
                  <h3 className="font-heading text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {category.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="py-24 border-t border-white/5" data-testid="recent-posts-section">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
                Recent Insights
              </h2>
              <Link
                to="/blog"
                className="text-gray-400 hover:text-white font-mono uppercase tracking-widest text-xs hover:underline decoration-1 underline-offset-4 transition-colors duration-300"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && recentPosts.length === 0 && (
        <section className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="font-heading text-2xl text-white mb-4">No insights yet.</h3>
            <p className="text-gray-500 mb-8">Check back soon for thought-provoking content on technology, policy, and innovation.</p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
