import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../App';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back, Admin');
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6" data-testid="admin-login-page">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-white" strokeWidth={1.5} />
            <span className="font-heading text-2xl font-bold text-white">PatangeNotes</span>
          </div>
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-[#0A0A0A] border border-[#262626] p-8">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="w-5 h-5 text-gray-500" />
            <h1 className="font-mono text-sm uppercase tracking-widest text-gray-400">
              Secure Access
            </h1>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-mono text-sm transition-colors duration-300"
                placeholder="admin@patangenotes.in"
                data-testid="admin-email-input"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#050505] border border-[#262626] text-white placeholder:text-gray-600 focus:border-white focus:ring-0 rounded-sm px-4 py-3 font-mono text-sm transition-colors duration-300"
                placeholder="••••••••••••"
                data-testid="admin-password-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 font-mono uppercase tracking-wider text-sm px-8 py-4 rounded-sm transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-btn"
            >
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        </div>

        {/* Security Notice */}
        <p className="text-center text-gray-600 text-xs font-mono mt-6">
          Protected by enterprise-grade security
        </p>
      </motion.div>
    </div>
  );
}
