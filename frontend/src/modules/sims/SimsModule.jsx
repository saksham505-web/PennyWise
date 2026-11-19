import React, { useState } from 'react';
import TradingSimulation from './TradingSimulation';
import MutualFundSimulation from './MutualFundSimulation';
import PortfolioModal from './PortfolioModal';
import ActivityModal from './ActivityModal';

export default function SimsModule({
  subTab = 'mutual-funds',
  setSubTab,
  simsState,
  onUpdateSimsState,
  isPortfolioOpen,
  setIsPortfolioOpen,
  isActivityOpen,
  setIsActivityOpen
}) {
  const handleNavigateToSip = (stock) => {
    setSubTab('mutual-funds');
  };

  return (
    <div className="space-y-6">
      {subTab === 'mutual-funds' ? (
        <MutualFundSimulation
          simsState={simsState}
          onUpdateSimsState={onUpdateSimsState}
        />
      ) : (
        <TradingSimulation
          simsState={simsState}
          onUpdateSimsState={onUpdateSimsState}
          onNavigateToSip={handleNavigateToSip}
        />
      )}

      {/* Portfolio & Activity Modals */}
      <PortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        simsState={simsState}
      />

      <ActivityModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        activities={simsState.activities}
      />
    </div>
  );
}
