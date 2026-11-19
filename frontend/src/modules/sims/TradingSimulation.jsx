import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldAlert,
  Wallet,
  Building2,
  Cpu,
  Leaf,
  Home,
  ShoppingBag,
  Plane
} from 'lucide-react';
import { FICTIONAL_STOCKS } from '../../data/initialData';
import { formatINR, formatPercent } from '../../utils/formatters';
import StockDetailView from './StockDetailView';

const INDUSTRY_ICONS = {
  Technology: Cpu,
  'Renewable Energy': Leaf,
  'Real Estate': Home,
  'Consumer Goods': ShoppingBag,
  Transportation: Plane
};

export default function TradingSimulation({
  simsState,
  onUpdateSimsState,
  onNavigateToSip
}) {
  const [selectedStockId, setSelectedStockId] = useState(null);

  const selectedStock = FICTIONAL_STOCKS.find((s) => s.id === selectedStockId);

  // Buy handler
  const handleBuyStock = (stock, qty, price) => {
    const totalCost = qty * price;
    const newCash = simsState.virtualCash - totalCost;

    const existingHoldingIndex = (simsState.holdings || []).findIndex(
      (h) => h.stockId === stock.id
    );

    let updatedHoldings = [...(simsState.holdings || [])];
    if (existingHoldingIndex >= 0) {
      const existing = updatedHoldings[existingHoldingIndex];
      const newTotalShares = existing.shares + qty;
      const newAvgPrice =
        (existing.shares * existing.avgPrice + qty * price) / newTotalShares;
      updatedHoldings[existingHoldingIndex] = {
        ...existing,
        shares: newTotalShares,
        avgPrice: newAvgPrice
      };
    } else {
      updatedHoldings.push({
        stockId: stock.id,
        shares: qty,
        avgPrice: price
      });
    }

    const activityRecord = {
      id: `act-${Date.now()}`,
      assetType: 'stock',
      name: stock.name,
      type: 'BUY',
      shares: qty,
      price: price,
      totalValue: totalCost,
      date: new Date().toISOString()
    };

    onUpdateSimsState({
      ...simsState,
      virtualCash: newCash,
      holdings: updatedHoldings,
      activities: [activityRecord, ...(simsState.activities || [])]
    });
  };

  // Sell handler
  const handleSellStock = (stock, qty, price) => {
    const totalPayout = qty * price;
    const newCash = simsState.virtualCash + totalPayout;

    const existingHoldingIndex = (simsState.holdings || []).findIndex(
      (h) => h.stockId === stock.id
    );

    let updatedHoldings = [...(simsState.holdings || [])];
    if (existingHoldingIndex >= 0) {
      const existing = updatedHoldings[existingHoldingIndex];
      const remainingShares = existing.shares - qty;
      if (remainingShares > 0) {
        updatedHoldings[existingHoldingIndex] = {
          ...existing,
          shares: remainingShares
        };
      } else {
        updatedHoldings.splice(existingHoldingIndex, 1);
      }
    }

    const activityRecord = {
      id: `act-${Date.now()}`,
      assetType: 'stock',
      name: stock.name,
      type: 'SELL',
      shares: qty,
      price: price,
      totalValue: totalPayout,
      date: new Date().toISOString()
    };

    onUpdateSimsState({
      ...simsState,
      virtualCash: newCash,
      holdings: updatedHoldings,
      activities: [activityRecord, ...(simsState.activities || [])]
    });
  };

  // If a stock is selected, render its detail view
  if (selectedStock) {
    return (
      <StockDetailView
        stock={selectedStock}
        onBack={() => setSelectedStockId(null)}
        virtualCash={simsState.virtualCash}
        holdings={simsState.holdings}
        onBuy={handleBuyStock}
        onSell={handleSellStock}
        onNavigateToSip={onNavigateToSip}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Simulation Info Card */}
      <div className="bg-[#084850]/70 rounded-3xl p-6 sm:p-8 border border-[#087985]/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7ECE5]/70">
              Virtual Trading Desk
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#F4F3E9] tracking-tight">
            Educational Stock Market
          </h2>
          <p className="text-xs text-[#D7ECE5]/70 mt-1 max-w-xl">
            Simulate equity purchases across 5 fictional market-leading enterprises.
            Test valuation principles without risking real capital.
          </p>
        </div>

        <div className="bg-[#063F46] p-4 rounded-2xl border border-[#087985]/40 text-left sm:text-right w-full sm:w-auto">
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium block">
            Available Virtual Trading Balance
          </span>
          <span className="text-2xl font-extrabold text-[#C5E86C] tracking-tight">
            {formatINR(simsState.virtualCash)}
          </span>
          <span className="text-[10px] text-[#D7ECE5]/50 block mt-0.5">
            Initial standard: ₹1,00,000
          </span>
        </div>
      </div>

      {/* Exactly Five Fictional Stocks Table / Listing */}
      <div className="bg-[#084850]/70 rounded-3xl border border-[#087985]/50 overflow-hidden shadow-lg">
        <div className="p-5 sm:p-6 border-b border-[#087985]/40 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#F4F3E9]">Curated Market Watchlist</h3>
            <p className="text-xs text-[#D7ECE5]/70">5 fictional companies representing key economic sectors</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#063F46] text-[#C5E86C] border border-[#C5E86C]/30">
            5 Active Listings
          </span>
        </div>

        <div className="divide-y divide-[#087985]/30">
          {FICTIONAL_STOCKS.map((stock) => {
            const isPositive = stock.change >= 0;
            const holding = (simsState.holdings || []).find((h) => h.stockId === stock.id);
            const ownedShares = holding ? holding.shares : 0;
            const IndustryIcon = INDUSTRY_ICONS[stock.industry] || Building2;

            return (
              <div
                key={stock.id}
                onClick={() => setSelectedStockId(stock.id)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#084850] cursor-pointer transition-colors group"
              >
                {/* Stock Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#063F46] border border-[#087985]/60 flex items-center justify-center text-[#C5E86C] group-hover:scale-105 transition-transform flex-shrink-0">
                    <IndustryIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base text-[#F4F3E9] group-hover:text-[#C5E86C] transition-colors">
                        {stock.name}
                      </span>
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#063F46] text-[#D7ECE5]/70 border border-[#087985]/40">
                        {stock.symbol}
                      </span>
                      {ownedShares > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5E86C]/20 text-[#C5E86C] border border-[#C5E86C]/30">
                          {ownedShares} held
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#D7ECE5]/60 mt-1">
                      <span>{stock.industry}</span>
                      <span>•</span>
                      <span className="line-clamp-1 max-w-sm hidden md:inline">
                        {stock.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                  <div className="text-left sm:text-right">
                    <div className="text-base sm:text-lg font-extrabold text-[#F4F3E9] tracking-tight">
                      {formatINR(stock.price)}
                    </div>
                    <div
                      className={`flex items-center sm:justify-end gap-1 text-xs font-bold ${
                        isPositive ? 'text-[#10B981]' : 'text-[#F87171]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {isPositive ? `+${formatINR(stock.change)}` : formatINR(stock.change)} (
                        {formatPercent(stock.changePercent)})
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#063F46] flex items-center justify-center text-[#D7ECE5]/60 group-hover:text-[#C5E86C] group-hover:bg-[#087985] transition-colors flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
