import React, { useState } from 'react';
import { WLogo } from './WLogo';
import { User } from '../types/messenger';
import { SEED_USERS } from '../services/chatService';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.vance@wmessenger.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [handle, setHandle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'login') {
        // Find existing or fallback
        const found = SEED_USERS.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (found) {
          onLoginSuccess(found);
        } else {
          // Allow login with any email
          const dynamicUser: User = {
            id: 'user_' + Date.now(),
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            handle: '@' + email.split('@')[0],
            avatarUrl: SEED_USERS[0].avatarUrl,
            status: 'online',
            email,
            isVerified: true
          };
          onLoginSuccess(dynamicUser);
        }
      } else {
        // Register
        if (!name.trim()) {
          setError('Please enter your full name');
          return;
        }
        const newUser: User = {
          id: 'user_' + Date.now(),
          name: name.trim(),
          handle: handle.trim() ? (handle.startsWith('@') ? handle : '@' + handle) : '@' + name.toLowerCase().replace(/\s+/g, '_'),
          avatarUrl: SEED_USERS[1].avatarUrl,
          status: 'online',
          email: email.trim(),
          bio: 'New W Messenger member.',
          isVerified: false
        };
        onLoginSuccess(newUser);
      }
    }, 400);
  };

  const handleQuickLogin = (user: User) => {
    onLoginSuccess(user);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950 overflow-y-auto">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/80 to-slate-950 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto my-auto">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center text-center mb-6">
          <WLogo size="xl" showText={true} className="mb-3" />
          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            Next-generation private messaging engineered for mobile, desktop, and web.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-blue-950/50">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Maya Henderson"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Unique Username Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={e => setHandle(e.target.value.replace(/^@/, ''))}
                      placeholder="maya_h"
                      className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email or W ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Demo Reset Link sent to: ' + email)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protected by W Messenger 256-bit PFS Encryption</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to W Messenger' : 'Create W Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center mb-3">
              One-Click Demo Profiles
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SEED_USERS.slice(0, 3).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-blue-500/50 hover:bg-blue-950/20 text-center transition-all group flex flex-col items-center"
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover mb-1 ring-1 ring-slate-700 group-hover:ring-blue-500"
                  />
                  <span className="text-[11px] font-medium text-slate-200 truncate w-full">
                    {u.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-500 truncate w-full">
                    {u.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security watermark footer */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Zero-Knowledge Architecture · Cross-Platform Client</span>
        </div>
      </div>
    </div>
  );
};
