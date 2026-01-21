import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BlogCard } from '../components/BlogCard';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          axios.get(`${API_URL}/api/categories`),
          axios.get(`${API_URL}/api/tags`)
        ]);
        setCategories(catRes.data.categories);
        setTags(tagRes.data.tags);
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.append('category', activeCategory);
        if (activeTag) params.append('tag', activeTag);
        if (searchQuery) params.append('search', searchQuery);
        params.append('limit', '50');

        const response = await axios.get(`${API_URL}/api/posts?${params.toString()}`);
        setPosts(response.data.posts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeCategory, activeTag, searchQuery]);

  const handleCategoryClick = (category) => {
    const newCategory = activeCategory === category ? '' : category;
    setActiveCategory(newCategory);
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  };

  const handleTagClick = (tag) => {
    const newTag = activeTag === tag ? '' : tag;
    setActiveTag(newTag);
    if (newTag) {
      setSearchParams({ tag: newTag });
    } else {
      searchParams.delete('tag');
      setSearchParams(searchParams);
    }
  };

  const clearFilters = () => {
    setActiveCategory('');
    setActiveTag('');
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = activeCategory || activeTag || searchQuery;

  return (
    <div className="min-h-screen bg-background" data-testid="blog-list-page">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-4 block">
              Knowledge Archive
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              All Insights
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Deep dives into geopolitics, artificial intelligence, security, healthcare, 
              and public policy. Written in plain English with full source attribution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search insights..."
                className="w-full bg-[#0A0A0A] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm pl-12 pr-4 py-3 font-mono text-sm transition-colors duration-300"
                data-testid="blog-search-input"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 transition-colors duration-300"
                  data-testid="clear-filters-btn"
                >
                  <X className="w-4 h-4" /> Clear Filters
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`font-mono text-xs uppercase tracking-wider flex items-center gap-2 px-4 py-2 border rounded-sm transition-colors duration-300 ${
                  showFilters 
                    ? 'border-white text-white' 
                    : 'border-[#262626] text-gray-400 hover:border-white hover:text-white'
                }`}
                data-testid="toggle-filters-btn"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-8 border-t border-white/5"
            >
              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`font-mono text-xs px-4 py-2 rounded-sm transition-colors duration-300 ${
                          activeCategory === category
                            ? 'bg-white text-black'
                            : 'bg-[#0A0A0A] border border-[#262626] text-gray-400 hover:border-white hover:text-white'
                        }`}
                        data-testid={`filter-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-4">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`font-mono text-xs px-3 py-1 rounded-sm transition-colors duration-300 ${
                          activeTag === tag
                            ? 'bg-white text-black'
                            : 'bg-[#171717] text-gray-500 hover:text-white'
                        }`}
                        data-testid={`filter-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-6" />
              <h3 className="font-heading text-2xl text-white mb-4">
                No insights found.
              </h3>
              <p className="text-gray-500 mb-8">
                {hasActiveFilters 
                  ? 'Try adjusting your filters or search query.'
                  : 'Check back soon for new content.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-white text-black font-mono uppercase tracking-wider text-sm px-6 py-3 rounded-sm hover:bg-gray-200 transition-colors duration-300"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
