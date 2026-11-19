import React, { useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Repeat,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { formatINR, formatPercent } from '../../utils/formatters';
import FundamentalsSection from './FundamentalsSection';
import FinancialPerformanceSection from './FinancialPerformanceSection';
import BuyModal from './BuyModal';
import SellModal from './SellModal';

export default function StockDetailView({
  stock,
  onBack,
  virtualCash,
  holdings,
  onBuy,
  onSell,
  onNavigateToSip
}) {
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [chartTimeframe, setChartTimeframe] = useState('1D');

  if (!stock) return null;

  const isPositive = stock.change >= 0;
  const holding = (holdings || []).find((h) => h.stockId === stock.id);
  const ownedShares = holding ? holding.shares : 0;

  return (
    <div className="space-y-6 pb-28 animate-fade-in relative">
      
      {/* Top Bar: Back Action & Stock Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#D7ECE5]/80 hover:text-[#C5E86C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Stocks</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#084850] text-[#D7ECE5] border border-[#087985]">
            NSE Virtual: {stock.symbol}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#063F46] text-[#C5E86C] border border-[#C5E86C]/30">
            {stock.industry}
          </span>
        </div>
      </div>

      {/* Stock Header Banner with Current Price & Description */}
      <div className="bg-[#084850]/70 rounded-3xl p-6 sm:p-8 border border-[#087985]/50 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F3E9]">
                {stock.name}
              </h2>
              {ownedShares > 0 && (
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#C5E86C]/20 text-[#C5E86C] border border-[#C5E86C]/40">
                  Owned: {ownedShares} shares
                </span>
              )}
            </div>
            <p className="text-xs text-[#D7ECE5]/70 max-w-2xl mt-1 leading-relaxed">
              {stock.description}
            </p>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F3E9]">
              {formatINR(stock.price)}
            </div>
            <div
              className={`flex items-center lg:justify-end gap-1.5 text-xs font-bold mt-1 ${
                isPositive ? 'text-[#10B981]' : 'text-[#F87171]'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>
                {isPositive ? `+${formatINR(stock.change)}` : formatINR(stock.change)} (
                {formatPercent(stock.changePercent)})
              </span>
              <span className="text-[#D7ECE5]/50 font-normal">Today</span>
            </div>
          </div>
        </div>

        {/* Intraday Price Sparkline Chart */}
        <div className="mt-6 pt-4 border-t border-[#087985]/30">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-[#D7ECE5]/70">Simulated Price Movement</span>
            <div className="flex gap-1 bg-[#063F46] p-1 rounded-lg border border-[#087985]/40 text-[11px] font-semibold">
              {['1D', '1W', '1M', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-2 py-0.5 rounded ${
                    chartTimeframe === tf
                      ? 'bg-[#087985] text-[#C5E86C]'
                      : 'text-[#D7ECE5]/60 hover:text-[#D7ECE5]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stock.chartHistory || []} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`color-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? '#C5E86C' : '#F87171'}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? '#C5E86C' : '#F87171'}
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#D7ECE5" opacity={0.4} fontSize={10} tickLine={false} />
                <YAxis
                  stroke="#D7ECE5"
                  opacity={0.4}
                  fontSize={10}
                  tickLine={false}
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tickFormatter={(val) => `₹${val}`}
                />
                <RechartsTooltip
                  formatter={(val) => [`₹${val}`, 'Simulated Price']}
                  contentStyle={{
                    backgroundColor: '#063F46',
                    borderColor: '#087985',
                    borderRadius: '8px',
                    color: '#F4F3E9'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? '#C5E86C' : '#F87171'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#color-${stock.id})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vertically Stacked Sections per spec: Fundamentals & Financial Performance */}
      <div className="space-y-6">
        <FundamentalsSection fundamentals={stock.fundamentals} />
        <FinancialPerformanceSection performance={stock.performance} />
      </div>

      {/* Bottom Sticky Action Bar: SIP, Sell, Buy */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#063F46]/95 backdrop-blur-md border-t border-[#087985]/60 py-3.5 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* SIP (navigates to mutual funds per spec) */}
          <button
            onClick={() => onNavigateToSip(stock)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#C5E86C]/50 text-[#C5E86C] hover:bg-[#C5E86C]/10 text-xs sm:text-sm font-bold transition-colors"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Setup SIP</span>
          </button>

          <div className="flex items-center gap-3 flex-1 sm:flex-none justify-end">
            {/* Sell Button */}
            <button
              onClick={() => setIsSellOpen(true)}
              disabled={ownedShares === 0}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md ${
                ownedShares > 0
                  ? 'bg-[#084850] hover:bg-[#F87171] text-[#F4F3E9] border border-[#087985]'
                  : 'bg-[#084850]/40 text-[#D7ECE5]/30 border border-transparent cursor-not-allowed'
              }`}
            >
              Sell {ownedShares > 0 ? `(${ownedShares})` : ''}
            </button>

            {/* Buy Button */}
            <button
              onClick={() => setIsBuyOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-8 py-2.5 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Buy Shares</span>
            </button>
          </div>
        </div>
      </div>

      {/* Buy & Sell Modals */}
      <BuyModal
        isOpen={isBuyOpen}
        onClose={() => setIsBuyOpen(false)}
        stock={stock}
        virtualCash={virtualCash}
        onConfirmBuy={onBuy}
      />

      <SellModal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
        stock={stock}
        ownedShares={ownedShares}
        onConfirmSell={onSell}
      />
    </div>
  );
}
