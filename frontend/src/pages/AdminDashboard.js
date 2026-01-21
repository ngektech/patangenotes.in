import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, LogOut, Plus, Edit, Trash2, Eye, Users, FileText, 
  Tag, X, Save, ArrowLeft, BarChart3 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../App';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const categories = [
  'Artificial Intelligence',
  'Geopolitics',
  'Security',
  'Healthcare',
  'Public Policy',
  'Technology',
  'Blockchain',
  'Meditation',
  'Research',
  'Programming'
];

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total_posts: 0, total_subscribers: 0, total_categories: 0 });
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    tags: '',
    featured_image: '',
    sources: '',
    is_featured: false
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getToken = () => localStorage.getItem('admin_token');

  const fetchData = async () => {
    try {
      const [postsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/posts`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        }),
        axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
      ]);
      setPosts(postsRes.data.posts);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const openEditor = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags?.join(', ') || '',
        featured_image: post.featured_image || '',
        sources: post.sources?.join('\n') || '',
        is_featured: post.is_featured || false
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Technology',
        tags: '',
        featured_image: '',
        sources: '',
        is_featured: false
      });
    }
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured_image: formData.featured_image,
      sources: formData.sources.split('\n').map(s => s.trim()).filter(Boolean),
      is_featured: formData.is_featured
    };

    try {
      if (editingPost) {
        await axios.put(`${API_URL}/api/admin/posts/${editingPost.id}`, payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        toast.success('Post updated successfully');
      } else {
        await axios.post(`${API_URL}/api/admin/posts`, payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        toast.success('Post created successfully');
      }
      closeEditor();
      fetchData();
    } catch (error) {
      toast.error('Failed to save post');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${API_URL}/api/admin/posts/${postId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success('Post deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-[#0A0A0A] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-7 h-7 text-white" strokeWidth={1.5} />
            <span className="font-heading text-xl font-bold text-white">PatangeNotes</span>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500 ml-2 px-2 py-1 bg-[#171717] rounded-sm">
              Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white font-mono text-sm uppercase tracking-wider transition-colors duration-300"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0A] border border-[#262626] p-6"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-gray-500" />
              <div>
                <p className="font-mono text-3xl text-white font-bold">{stats.total_posts}</p>
                <p className="text-gray-500 text-sm">Total Posts</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0A0A] border border-[#262626] p-6"
          >
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-gray-500" />
              <div>
                <p className="font-mono text-3xl text-white font-bold">{stats.total_subscribers}</p>
                <p className="text-gray-500 text-sm">Subscribers</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A0A0A] border border-[#262626] p-6"
          >
            <div className="flex items-center gap-4">
              <BarChart3 className="w-8 h-8 text-gray-500" />
              <div>
                <p className="font-mono text-3xl text-white font-bold">{stats.total_categories}</p>
                <p className="text-gray-500 text-sm">Categories</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl text-white">Manage Posts</h2>
          <button
            onClick={() => openEditor()}
            className="bg-white text-black hover:bg-gray-200 font-mono uppercase tracking-wider text-sm px-6 py-3 rounded-sm transition-colors duration-300 flex items-center gap-2"
            data-testid="create-post-btn"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="bg-[#0A0A0A] border border-[#262626] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#171717]">
                  <tr>
                    <th className="text-left font-mono text-xs uppercase tracking-widest text-gray-500 px-6 py-4">Title</th>
                    <th className="text-left font-mono text-xs uppercase tracking-widest text-gray-500 px-6 py-4">Category</th>
                    <th className="text-left font-mono text-xs uppercase tracking-widest text-gray-500 px-6 py-4">Date</th>
                    <th className="text-left font-mono text-xs uppercase tracking-widest text-gray-500 px-6 py-4">Featured</th>
                    <th className="text-right font-mono text-xs uppercase tracking-widest text-gray-500 px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-t border-[#262626] hover:bg-[#171717] transition-colors duration-200"
                      data-testid={`post-row-${post.id}`}
                    >
                      <td className="px-6 py-4">
                        <p className="text-white font-medium truncate max-w-xs">{post.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-400">{post.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-500">{formatDate(post.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        {post.is_featured && (
                          <span className="font-mono text-xs text-white bg-[#262626] px-2 py-1 rounded-sm">Featured</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/blog/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-white transition-colors duration-200"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => openEditor(post)}
                            className="p-2 text-gray-500 hover:text-white transition-colors duration-200"
                            title="Edit"
                            data-testid={`edit-post-${post.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                            title="Delete"
                            data-testid={`delete-post-${post.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-[#262626] p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Create your first insight to get started.</p>
            <button
              onClick={() => openEditor()}
              className="bg-white text-black font-mono uppercase tracking-wider text-sm px-6 py-3 rounded-sm hover:bg-gray-200 transition-colors duration-300"
            >
              Create First Post
            </button>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-4xl bg-[#0A0A0A] border border-[#262626]"
              data-testid="post-editor-modal"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#262626]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={closeEditor}
                    className="text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-heading text-xl text-white">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h2>
                </div>
                <button
                  onClick={closeEditor}
                  className="text-gray-500 hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-body text-lg transition-colors duration-300"
                    placeholder="Enter post title"
                    data-testid="post-title-input"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows={2}
                    className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-body transition-colors duration-300"
                    placeholder="Brief summary of the post"
                    data-testid="post-excerpt-input"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={12}
                    className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-body leading-relaxed transition-colors duration-300"
                    placeholder="Write your insight in plain English..."
                    data-testid="post-content-input"
                  />
                </div>

                {/* Category & Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#050505] border border-[#262626] text-white focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-mono text-sm transition-colors duration-300"
                      data-testid="post-category-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-5 h-5 bg-[#050505] border border-[#262626] text-white focus:ring-0 rounded-sm"
                        data-testid="post-featured-checkbox"
                      />
                      <span className="font-mono text-sm text-gray-400">Feature this post</span>
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                    <Tag className="w-3 h-3 inline mr-2" />
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-mono text-sm transition-colors duration-300"
                    placeholder="AI, Policy, Future, Innovation"
                    data-testid="post-tags-input"
                  />
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Featured Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-mono text-sm transition-colors duration-300"
                    placeholder="https://example.com/image.jpg"
                    data-testid="post-image-input"
                  />
                </div>

                {/* Sources */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Sources (one per line)
                  </label>
                  <textarea
                    value={formData.sources}
                    onChange={(e) => setFormData({ ...formData, sources: e.target.value })}
                    rows={3}
                    className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-mono text-sm transition-colors duration-300"
                    placeholder="https://source1.com&#10;https://source2.org&#10;Book: Author Name - Title"
                    data-testid="post-sources-input"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#262626]">
                  <button
                    type="button"
                    onClick={closeEditor}
                    className="bg-transparent border border-[#262626] text-gray-400 hover:border-white hover:text-white font-mono uppercase tracking-wider text-sm px-6 py-3 rounded-sm transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-white text-black hover:bg-gray-200 font-mono uppercase tracking-wider text-sm px-6 py-3 rounded-sm transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
                    data-testid="save-post-btn"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : (editingPost ? 'Update Post' : 'Publish Post')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
