import React, { useState, useRef, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  GraduationCap,
  Sparkles,
  PieChart,
  History,
  RotateCcw,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  UserCheck
} from 'lucide-react';

export default function Navigation({
  activeTab,
  setActiveTab,
  simsSubTab,
  setSimsSubTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenPortfolio,
  onOpenActivity,
  onResetDemo
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainTabs = [
    {
      id: 'tracker',
      label: 'Personal Tracker',
      icon: Wallet,
      desc: 'Income, expenses & budget'
    },
    {
      id: 'sims',
      label: 'Sims',
      icon: TrendingUp,
      desc: 'Virtual market & mutual funds'
    },
    {
      id: 'learning',
      label: 'Learning',
      icon: GraduationCap,
      desc: 'Curved pathway & quizzes'
    },
    {
      id: 'coach',
      label: 'AI Coach',
      icon: Sparkles,
      desc: 'Mr. LLAMA Financial Brain'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#063F46]/95 backdrop-blur-md border-b border-[#087985]/40 transition-all">
      {/* Brand & Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#087985] to-[#042c31] border border-[#C5E86C]/40 flex items-center justify-center p-1 shadow-md">
              <img src="/static/llama.png" alt="Pennywise Mascot" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#F4F3E9]">
                  PENNY<span className="text-[#C5E86C]">WISE</span>
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#087985]/50 text-[#C5E86C] rounded-full border border-[#C5E86C]/30">
                  Prototype
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#D7ECE5]/70 hidden sm:block">
                Learn money. Master money.
              </p>
            </div>
          </div>

          {/* Primary 4 Destinations (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#042c31]/60 p-1.5 rounded-2xl border border-[#087985]/30">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#087985] text-[#F4F3E9] shadow-md border border-[#C5E86C]/40'
                      : 'text-[#D7ECE5]/80 hover:text-[#F4F3E9] hover:bg-[#084850]/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5E86C]' : 'text-[#D7ECE5]/70'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: User Auth / Profile Pill & Reset Demo */}
          <div className="flex items-center gap-2.5">
            
            {/* User Profile Pill or Login Button */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#084850]/60 hover:bg-[#084850] border border-[#087985]/60 transition-all text-left shadow-sm"
                >
                  <span className="text-base leading-none select-none">
                    {currentUser.avatar || '👤'}
                  </span>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-[#F4F3E9] block leading-tight truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#C5E86C] block leading-tight">
                      {currentUser.persona || 'Member'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#D7ECE5]/60 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#042c31] border border-[#087985] rounded-2xl shadow-2xl p-2 z-50 animate-fade-in text-xs">
                    <div className="p-2.5 border-b border-[#087985]/40 mb-1">
                      <div className="font-bold text-[#F4F3E9]">{currentUser.name}</div>
                      <div className="text-[11px] text-[#D7ECE5]/60 truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#087985] text-[#C5E86C]">
                        {currentUser.persona}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenAuth('login');
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#D7ECE5] hover:bg-[#084850] hover:text-[#C5E86C] transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[#F87171] hover:bg-[#F87171]/20 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* Demo Data Reset */}
            <button
              onClick={onResetDemo}
              title="Reset prototype data to initial demonstration state"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#D7ECE5]/60 hover:text-[#C5E86C] hover:bg-[#084850]/40 border border-transparent hover:border-[#087985]/50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Mobile Primary Navigation Bar */}
        <div className="flex md:hidden grid-cols-4 gap-1 pb-3 overflow-x-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-1.5 px-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#087985] text-[#C5E86C] border border-[#C5E86C]/30 shadow-sm'
                    : 'text-[#D7ECE5]/70 hover:bg-[#084850]/40'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Navigation for Sims (Rendered directly underneath main navigation) */}
      {activeTab === 'sims' && (
        <div className="bg-[#042c31] border-t border-[#087985]/30 py-2.5 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Secondary Tabs */}
            <div className="flex items-center gap-1 bg-[#063F46] p-1 rounded-xl border border-[#087985]/40">
              <button
                onClick={() => setSimsSubTab('mutual-funds')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  simsSubTab === 'mutual-funds'
                    ? 'bg-[#087985] text-[#C5E86C] shadow-sm border border-[#C5E86C]/30'
                    : 'text-[#D7ECE5]/70 hover:text-[#F4F3E9]'
                }`}
              >
                Mutual Fund Simulation
              </button>
              <button
                onClick={() => setSimsSubTab('trading')}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  simsSubTab === 'trading'
                    ? 'bg-[#087985] text-[#C5E86C] shadow-sm border border-[#C5E86C]/30'
                    : 'text-[#D7ECE5]/70 hover:text-[#F4F3E9]'
                }`}
              >
                Trading Simulation
              </button>
            </div>

            {/* Portfolio and Activity Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenPortfolio}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#084850] hover:bg-[#087985] text-[#F4F3E9] text-xs sm:text-sm font-semibold rounded-lg border border-[#087985] transition-colors shadow-sm"
              >
                <PieChart className="w-3.5 h-3.5 text-[#C5E86C]" />
                <span>Portfolio</span>
              </button>
              <button
                onClick={onOpenActivity}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#084850] hover:bg-[#087985] text-[#F4F3E9] text-xs sm:text-sm font-semibold rounded-lg border border-[#087985] transition-colors shadow-sm"
              >
                <History className="w-3.5 h-3.5 text-[#B7D16A]" />
                <span>Activity</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
