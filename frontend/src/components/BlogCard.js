import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowUpRight } from 'lucide-react';

export const BlogCard = ({ post, index = 0, featured = false }) => {
  const categoryImages = {
    'Artificial Intelligence': 'https://images.pexels.com/photos/25626449/pexels-photo-25626449.jpeg',
    'Security': 'https://images.pexels.com/photos/30839470/pexels-photo-30839470.jpeg',
    'Geopolitics': 'https://images.pexels.com/photos/17483869/pexels-photo-17483869.jpeg',
    'Healthcare': 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg',
    'Technology': 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
    'Public Policy': 'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg'
  };

  const imageUrl = post.featured_image || categoryImages[post.category] || 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg';

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="blog-card group relative bg-[#0A0A0A] border border-[#262626] hover:border-white/40 transition-colors duration-500 overflow-hidden"
        data-testid={`featured-blog-card-${post.id}`}
      >
        <Link to={`/blog/${post.id}`} className="block">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 lg:h-full overflow-hidden">
              <img
                src={imageUrl}
                alt={post.title}
                className="blog-card-image w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A]/50" />
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
                  {post.category}
                </span>
                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                <span className="font-mono text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.reading_time || 5} min read
                </span>
              </div>

              <h2 className="font-heading text-2xl lg:text-4xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                {post.title}
              </h2>

              <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-2 text-white font-mono text-sm uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
                Read Insight <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="blog-card group relative bg-[#0A0A0A] border border-[#262626] hover:border-white/40 transition-colors duration-500 flex flex-col h-full"
      data-testid={`blog-card-${post.id}`}
    >
      <Link to={`/blog/${post.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={post.title}
            className="blog-card-image w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-4 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
              {post.category}
            </span>
            <span className="font-mono text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.reading_time || 5} min
            </span>
          </div>

          <h3 className="font-heading text-xl font-semibold text-white mb-3 group-hover:text-gray-200 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs text-gray-500 bg-[#171717] px-2 py-1 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
};
