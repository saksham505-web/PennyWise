import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { loginUser, signupUser, getRegisteredUsers } from '../utils/auth';
import MrLlamaMascot from './MrLlamaMascot';

export default function AuthModal({
  isOpen,
  onClose,
  initialTab = 'login',
  onAuthSuccess
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup'
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPersona, setSignupPersona] = useState('College Student');
  const [signupError, setSignupError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const result = loginUser(loginEmail, loginPassword);
    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setLoginError(result.error || 'Invalid credentials.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      setSignupError('Please fill in all required fields.');
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    const result = signupUser({
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      persona: signupPersona
    });

    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setSignupError(result.error || 'Failed to create account.');
    }
  };

  // Quick Demo Login Handler
  const handleQuickLogin = (email, pwd) => {
    const result = loginUser(email, pwd);
    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#063F46] border border-[#087985] rounded-3xl shadow-2xl p-6 sm:p-7 relative text-[#F4F3E9] overflow-hidden">
        
        {/* Top Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-[#087985]/40 mb-4">
          <div className="flex items-center gap-3">
            <MrLlamaMascot expression="happy" size="sm" />
            <div>
              <h3 className="font-extrabold text-lg text-[#F4F3E9] tracking-tight">
                {activeTab === 'login' ? 'Welcome Back!' : 'Join Pennywise'}
              </h3>
              <p className="text-[11px] text-[#D7ECE5]/70">
                {activeTab === 'login'
                  ? 'Access your saved finances and learning path'
                  : 'Start your risk-free financial journey today'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#D7ECE5]/60 hover:text-[#C5E86C] hover:bg-[#084850] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Log In vs Sign Up */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#042c31] p-1.5 rounded-2xl border border-[#087985]/40 mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'login'
                ? 'bg-[#087985] text-[#C5E86C] shadow-sm border border-[#C5E86C]/30'
                : 'text-[#D7ECE5]/70 hover:text-[#F4F3E9]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setSignupError('');
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signup'
                ? 'bg-[#087985] text-[#C5E86C] shadow-sm border border-[#C5E86C]/30'
                : 'text-[#D7ECE5]/70 hover:text-[#F4F3E9]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* TAB 1: LOG IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
            {loginError && (
              <div className="p-3 bg-[#F87171]/20 border border-[#F87171]/40 rounded-xl text-xs text-[#F87171] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D7ECE5]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#042c31] border border-[#087985] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#D7ECE5]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#042c31] border border-[#087985] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <span>Sign In to Pennywise</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Logins Preset */}
            <div className="pt-2 border-t border-[#087985]/30">
              <span className="text-[11px] font-semibold text-[#D7ECE5]/60 block mb-2 text-center">
                Or instantly log in as demo profile:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('aarav@example.com', 'password123')}
                  className="p-2 rounded-xl bg-[#084850]/50 hover:bg-[#084850] border border-[#087985]/40 text-left transition-colors"
                >
                  <div className="text-xs font-bold text-[#F4F3E9]">🎓 Aarav Sharma</div>
                  <div className="text-[10px] text-[#D7ECE5]/60">Student (₹10k Balance)</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('priya@example.com', 'password123')}
                  className="p-2 rounded-xl bg-[#084850]/50 hover:bg-[#084850] border border-[#087985]/40 text-left transition-colors"
                >
                  <div className="text-xs font-bold text-[#F4F3E9]">💼 Priya Patel</div>
                  <div className="text-[10px] text-[#D7ECE5]/60">Professional (₹25k)</div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: SIGN UP FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 animate-fade-in max-h-[60vh] overflow-y-auto pr-1">
            {signupError && (
              <div className="p-3 bg-[#F87171]/20 border border-[#F87171]/40 rounded-xl text-xs text-[#F87171] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#D7ECE5]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full bg-[#042c31] border border-[#087985] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#D7ECE5]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="vikram@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full bg-[#042c31] border border-[#087985] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                Role / Stage in Life
              </label>
              <select
                value={signupPersona}
                onChange={(e) => setSignupPersona(e.target.value)}
                className="w-full bg-[#042c31] border border-[#087985] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
              >
                <option value="College Student">🎓 College Student</option>
                <option value="Teen / High School">🎒 Teen / High School</option>
                <option value="Young Professional">💼 Young Professional</option>
                <option value="Finance Beginner">🌱 Finance Beginner</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full bg-[#042c31] border border-[#087985] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                  Confirm *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repeat"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="w-full bg-[#042c31] border border-[#087985] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-2"
            >
              <span>Create Account</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
