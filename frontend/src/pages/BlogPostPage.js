import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Share2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard.');
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categoryImages = {
    'Artificial Intelligence': 'https://images.pexels.com/photos/25626449/pexels-photo-25626449.jpeg',
    'Security': 'https://images.pexels.com/photos/30839470/pexels-photo-30839470.jpeg',
    'Geopolitics': 'https://images.pexels.com/photos/17483869/pexels-photo-17483869.jpeg',
    'Healthcare': 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    'Technology': 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
    'Public Policy': 'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background" data-testid="blog-post-error">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <h1 className="font-heading text-4xl text-white mb-4">Post Not Found.</h1>
          <p className="text-gray-400 mb-8">The insight you are looking for does not exist.</p>
          <Link
            to="/blog"
            className="bg-white text-black font-mono uppercase tracking-wider text-sm px-6 py-3 rounded-sm hover:bg-gray-200 transition-colors duration-300"
          >
            Back to Insights
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = post.featured_image || categoryImages[post.category] || 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg';

  return (
    <div className="min-h-screen bg-background" data-testid="blog-post-page">
      <Navbar />

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
      </div>

      {/* Content */}
      <article className="relative -mt-32 z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm uppercase tracking-wider transition-colors duration-300"
              data-testid="back-to-blog-btn"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Insights
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                to={`/blog?category=${encodeURIComponent(post.category)}`}
                className="font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors duration-300"
              >
                {post.category}
              </Link>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="font-mono text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.reading_time || 5} min read
              </span>
              <span className="w-1 h-1 bg-gray-600 rounded-full" />
              <span className="font-mono text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(post.created_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-400 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Share */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#171717] rounded-full flex items-center justify-center font-heading text-white font-bold">
                  AP
                </div>
                <div>
                  <p className="text-white font-medium">{post.author || 'Aditya Patange'}</p>
                  <p className="text-gray-500 text-sm font-mono">Author</p>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm uppercase tracking-wider transition-colors duration-300"
                data-testid="share-post-btn"
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </motion.header>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-12"
            >
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="font-mono text-xs text-gray-500 bg-[#171717] px-3 py-1 rounded-sm hover:bg-[#262626] hover:text-white transition-colors duration-300"
                >
                  #{tag}
                </Link>
              ))}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            data-testid="blog-post-content"
          />

          {/* Sources */}
          {post.sources && post.sources.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 pt-8 border-t border-white/10"
              data-testid="blog-post-sources"
            >
              <h3 className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Sources & Attribution
              </h3>
              <ul className="space-y-3">
                {post.sources.map((source, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ExternalLink className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <a
                      href={source.startsWith('http') ? source : `https://${source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors duration-300 break-all"
                    >
                      {source}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 bg-[#0A0A0A] border border-[#262626] text-center"
          >
            <h3 className="font-heading text-2xl text-white mb-4">
              Enjoyed this insight?
            </h3>
            <p className="text-gray-400 mb-6">
              Subscribe to receive thoughtful analysis on technology, policy, and the future.
            </p>
            <Link
              to="/#newsletter"
              className="inline-block bg-white text-black font-mono uppercase tracking-wider text-sm px-8 py-4 rounded-sm hover:bg-gray-200 transition-colors duration-300"
            >
              Subscribe to Newsletter
            </Link>
          </motion.div>
        </div>
      </article>

      <div className="pt-24">
        <Footer />
      </div>
    </div>
  );
}
