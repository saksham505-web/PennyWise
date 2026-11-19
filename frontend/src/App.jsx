import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import TrackerModule from './modules/tracker/TrackerModule';
import SimsModule from './modules/sims/SimsModule';
import LearningModule from './modules/learning/LearningModule';
import AiCoachModule from './modules/coach/AiCoachModule';
import AuthModal from './components/AuthModal';
import {
  loadTrackerData,
  saveTrackerData,
  loadSimsData,
  saveSimsData,
  loadUserStats,
  saveUserStats,
  loadActiveTab,
  saveActiveTab,
  resetAllDataToDemo
} from './utils/storage';
import {
  getCurrentUser,
  logoutUser
} from './utils/auth';
import {
  INITIAL_TRACKER_DATA,
  INITIAL_SIMS_STATE,
  INITIAL_USER_STATS
} from './data/initialData';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const [activeTab, setActiveTabState] = useState(() => loadActiveTab());
  const [simsSubTab, setSimsSubTab] = useState('mutual-funds');
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // Core Data Domains scoped by user ID
  const [trackerData, setTrackerData] = useState(() =>
    loadTrackerData(currentUser?.id)
  );
  const [simsState, setSimsState] = useState(() =>
    loadSimsData(currentUser?.id)
  );
  const [userStats, setUserStats] = useState(() =>
    loadUserStats(currentUser?.id)
  );

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    saveActiveTab(tab);
  };

  // When active user changes, reload their personalized records
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setTrackerData(loadTrackerData(user.id));
    setSimsState(loadSimsData(user.id));
    setUserStats(loadUserStats(user.id));
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setTrackerData(loadTrackerData(null));
    setSimsState(loadSimsData(null));
    setUserStats(loadUserStats(null));
  };

  const handleOpenAuth = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // Auto-persist changes per user
  useEffect(() => {
    saveTrackerData(trackerData, currentUser?.id);
  }, [trackerData, currentUser]);

  useEffect(() => {
    saveSimsData(simsState, currentUser?.id);
  }, [simsState, currentUser]);

  useEffect(() => {
    saveUserStats(userStats, currentUser?.id);
  }, [userStats, currentUser]);

  const handleResetDemo = () => {
    if (window.confirm('Reset all prototype data back to the default demonstration state?')) {
      resetAllDataToDemo(currentUser?.id);
      setTrackerData(INITIAL_TRACKER_DATA);
      setSimsState(INITIAL_SIMS_STATE);
      setUserStats(INITIAL_USER_STATS);
      setActiveTab('tracker');
      setSimsSubTab('mutual-funds');
    }
  };

  return (
    <div className="min-h-screen bg-[#063F46] text-[#F4F3E9] flex flex-col font-sans selection:bg-[#C5E86C] selection:text-[#063F46]">
      {/* Top Application Bar with Auth Profile, 4 Destinations & Sims Sub-nav */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        simsSubTab={simsSubTab}
        setSimsSubTab={setSimsSubTab}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenPortfolio={() => setIsPortfolioOpen(true)}
        onOpenActivity={() => setIsActivityOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Destination Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'tracker' && (
          <TrackerModule
            trackerData={trackerData}
            onUpdateTrackerData={setTrackerData}
          />
        )}

        {activeTab === 'sims' && (
          <SimsModule
            subTab={simsSubTab}
            setSubTab={setSimsSubTab}
            simsState={simsState}
            onUpdateSimsState={setSimsState}
            isPortfolioOpen={isPortfolioOpen}
            setIsPortfolioOpen={setIsPortfolioOpen}
            isActivityOpen={isActivityOpen}
            setIsActivityOpen={setIsActivityOpen}
          />
        )}

        {activeTab === 'learning' && (
          <LearningModule
            userStats={userStats}
            onUpdateUserStats={setUserStats}
          />
        )}

        {activeTab === 'coach' && <AiCoachModule />}
      </main>

      {/* Authentication Modal (Log In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-[#087985]/30 bg-[#042c31]/80 py-4 px-4 text-center text-xs text-[#D7ECE5]/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Pennywise • Learn money. Master money.</span>
          <span className="text-[11px] text-[#D7ECE5]/40">
            Educational Prototype • All investments & transactions are fictional.
          </span>
        </div>
      </footer>
    </div>
  );
}
