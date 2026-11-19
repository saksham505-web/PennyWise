import React from 'react';
import { X, PieChart, TrendingUp, TrendingDown, Layers, Wallet } from 'lucide-react';
import { FICTIONAL_STOCKS } from '../../data/initialData';
import { formatINR, formatPercent } from '../../utils/formatters';

export default function PortfolioModal({
  isOpen,
  onClose,
  simsState
}) {
  if (!isOpen) return null;

  const holdings = simsState.holdings || [];

  // Compute portfolio valuation
  let totalInvested = 0;
  let currentValuation = 0;

  const enrichedHoldings = holdings.map((h) => {
    const stock = FICTIONAL_STOCKS.find((s) => s.id === h.stockId);
    const currentPrice = stock ? stock.price : h.avgPrice;
    const stockName = stock ? stock.name : h.stockId;
    const invested = h.shares * h.avgPrice;
    const currentVal = h.shares * currentPrice;
    const pnl = currentVal - invested;
    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;

    totalInvested += invested;
    currentValuation += currentVal;

    return {
      ...h,
      stockName,
      currentPrice,
      invested,
      currentVal,
      pnl,
      pnlPct
    };
  });

  const totalPortfolioValue = simsState.virtualCash + currentValuation;
  const netPnl = currentValuation - totalInvested;
  const netPnlPct = totalInvested > 0 ? (netPnl / totalInvested) * 100 : 0;
  const isProfitable = netPnl >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#063F46] border border-[#087985] rounded-3xl shadow-2xl p-6 relative text-[#F4F3E9] max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#087985]/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#087985] text-[#C5E86C]">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#F4F3E9]">Virtual Portfolio Overview</h3>
              <p className="text-xs text-[#D7ECE5]/60">Simulated holdings and asset allocation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#D7ECE5]/60 hover:text-[#C5E86C] hover:bg-[#084850]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio Valuation Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#084850]/50 border border-[#087985]/30 mb-5">
          <div>
            <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Virtual Cash</span>
            <span className="text-sm sm:text-base font-extrabold text-[#F4F3E9]">
              {formatINR(simsState.virtualCash)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Holdings Value</span>
            <span className="text-sm sm:text-base font-extrabold text-[#C5E86C]">
              {formatINR(currentValuation)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Total Net Worth</span>
            <span className="text-sm sm:text-base font-extrabold text-[#F4F3E9]">
              {formatINR(totalPortfolioValue)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Unrealized P&L</span>
            <span
              className={`text-sm sm:text-base font-extrabold ${
                isProfitable ? 'text-[#10B981]' : 'text-[#F87171]'
              }`}
            >
              {isProfitable ? `+${formatINR(netPnl)}` : formatINR(netPnl)} (
              {formatPercent(netPnlPct)})
            </span>
          </div>
        </div>

        {/* Holdings List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#D7ECE5]/70 mb-2">
            Current Equity Holdings ({enrichedHoldings.length})
          </h4>

          {enrichedHoldings.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-[#087985]/40 rounded-2xl">
              <p className="text-xs text-[#D7ECE5]/70">No simulated stocks held yet.</p>
              <p className="text-[11px] text-[#D7ECE5]/50 mt-1">
                Explore the Trading Simulation and buy fictional shares to build your portfolio.
              </p>
            </div>
          ) : (
            enrichedHoldings.map((h) => {
              const itemProfitable = h.pnl >= 0;
              return (
                <div
                  key={h.stockId}
                  className="p-4 rounded-xl bg-[#084850]/40 border border-[#087985]/30 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-extrabold text-sm text-[#F4F3E9]">{h.stockName}</div>
                    <div className="text-[11px] text-[#D7ECE5]/60 mt-0.5">
                      {h.shares} shares @ Avg {formatINR(h.avgPrice)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold text-[#F4F3E9]">
                      {formatINR(h.currentVal)}
                    </div>
                    <div
                      className={`text-xs font-bold ${
                        itemProfitable ? 'text-[#10B981]' : 'text-[#F87171]'
                      }`}
                    >
                      {itemProfitable ? `+${formatINR(h.pnl)}` : formatINR(h.pnl)} (
                      {formatPercent(h.pnlPct)})
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
