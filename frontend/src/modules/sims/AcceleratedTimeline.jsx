import React, { useState, useMemo } from 'react';
import {
  Play,
  FastForward,
  RotateCcw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Info,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { formatINR, formatPercent } from '../../utils/formatters';

export default function AcceleratedTimeline({
  experiment,
  onResetExperiment,
  onFinishExperiment
}) {
  const { fund, contributionAmount, frequency } = experiment;

  // Current day in simulation: 1 to 30
  const [currentDay, setCurrentDay] = useState(1);

  // Check if a day has a contribution scheduled
  const isContributionDay = (day) => {
    if (frequency === 'daily') return true;
    if (frequency === 'weekly') {
      return [1, 8, 15, 22, 29].includes(day);
    }
    if (frequency === 'monthly') {
      return day === 1;
    }
    return false;
  };

  // Compute state up to currentDay deterministically
  const simulationHistory = useMemo(() => {
    let accumulatedUnits = 0;
    let totalInvested = 0;
    const history = [];

    for (let day = 1; day <= 30; day++) {
      const nav = fund.navCurve[day - 1] || fund.initialNav;
      let unitsBoughtToday = 0;

      if (isContributionDay(day)) {
        unitsBoughtToday = contributionAmount / nav;
        accumulatedUnits += unitsBoughtToday;
        totalInvested += contributionAmount;
      }

      const portfolioVal = accumulatedUnits * nav;
      const profitLoss = portfolioVal - totalInvested;
      const returnPct = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

      history.push({
        day,
        nav,
        unitsBoughtToday,
        accumulatedUnits,
        totalInvested,
        portfolioVal,
        profitLoss,
        returnPct,
        isContribution: isContributionDay(day)
      });
    }

    return history;
  }, [fund, contributionAmount, frequency]);

  const currentSnapshot = simulationHistory[currentDay - 1];
  const isFinished = currentDay >= 30;

  // Chart data up to current day
  const chartData = simulationHistory.slice(0, currentDay).map((item) => ({
    name: `Day ${item.day}`,
    day: item.day,
    nav: item.nav,
    portfolioVal: Math.round(item.portfolioVal),
    invested: item.totalInvested
  }));

  const handleNextDay = () => {
    if (currentDay < 30) {
      setCurrentDay((prev) => prev + 1);
    }
  };

  const handleSkipTo30 = () => {
    setCurrentDay(30);
  };

  const isProfitable = currentSnapshot.profitLoss >= 0;

  return (
    <div className="bg-[#084850]/70 rounded-3xl p-6 sm:p-8 border border-[#087985]/50 shadow-lg space-y-6 animate-fade-in">
      
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#087985]/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5E86C] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7ECE5]/70">
              Accelerated 30-Day SIP Engine
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#F4F3E9] mt-0.5">
            {fund.name}
          </h3>
          <p className="text-xs text-[#D7ECE5]/70">
            {formatINR(contributionAmount)} • {frequency.toUpperCase()} Contribution schedule
          </p>
        </div>

        {/* Timeline Control Buttons */}
        <div className="flex items-center gap-2">
          {!isFinished ? (
            <>
              <button
                onClick={handleNextDay}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-xs rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Next Day ({currentDay + 1}/30)</span>
              </button>
              <button
                onClick={handleSkipTo30}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#063F46] hover:bg-[#087985] text-[#D7ECE5] text-xs font-bold rounded-xl border border-[#087985] transition-colors"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip to Day 30</span>
              </button>
            </>
          ) : (
            <button
              onClick={onResetExperiment}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-xs rounded-xl shadow-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Experiment</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Day Slider */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-[#D7ECE5]/70">Simulation Progress</span>
          <span className="text-[#C5E86C] font-extrabold">Day {currentDay} of 30</span>
        </div>
        <div className="w-full bg-[#042c31] h-3 rounded-full overflow-hidden p-0.5 border border-[#087985]/30">
          <div
            className="h-full bg-gradient-to-r from-[#087985] to-[#C5E86C] rounded-full transition-all duration-300"
            style={{ width: `${(currentDay / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Real-time Metric Cards on Current Day */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#063F46]/70 p-4 rounded-2xl border border-[#087985]/30">
          <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Current NAV</span>
          <div className="text-xl font-extrabold text-[#F4F3E9] mt-0.5">
            ₹{currentSnapshot.nav.toFixed(2)}
          </div>
          <span className="text-[10px] text-[#D7ECE5]/50 block mt-0.5">
            Initial: ₹{fund.initialNav.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#063F46]/70 p-4 rounded-2xl border border-[#087985]/30">
          <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Virtual Invested</span>
          <div className="text-xl font-extrabold text-[#D7ECE5] mt-0.5">
            {formatINR(currentSnapshot.totalInvested)}
          </div>
          <span className="text-[10px] text-[#D7ECE5]/50 block mt-0.5">
            {currentSnapshot.isContribution ? 'Contribution made today!' : 'No contribution today'}
          </span>
        </div>

        <div className="bg-[#063F46]/70 p-4 rounded-2xl border border-[#087985]/30">
          <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Accumulated Units</span>
          <div className="text-xl font-extrabold text-[#C5E86C] mt-0.5">
            {currentSnapshot.accumulatedUnits.toFixed(3)}
          </div>
          <span className="text-[10px] text-[#D7ECE5]/50 block mt-0.5">
            Units = Rupee / NAV
          </span>
        </div>

        <div className="bg-[#063F46]/70 p-4 rounded-2xl border border-[#087985]/30">
          <span className="text-[11px] text-[#D7ECE5]/60 block font-medium">Simulated Value & P&L</span>
          <div className="text-xl font-extrabold text-[#F4F3E9] mt-0.5">
            {formatINR(currentSnapshot.portfolioVal)}
          </div>
          <div
            className={`flex items-center gap-1 text-[11px] font-bold mt-0.5 ${
              isProfitable ? 'text-[#10B981]' : 'text-[#F87171]'
            }`}
          >
            {isProfitable ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {isProfitable ? `+${formatINR(currentSnapshot.profitLoss)}` : formatINR(currentSnapshot.profitLoss)} (
              {formatPercent(currentSnapshot.returnPct)})
            </span>
          </div>
        </div>
      </div>

      {/* 30-Day Timeline Chart: Portfolio Value vs Virtual Invested */}
      <div className="bg-[#063F46]/40 p-4 sm:p-5 rounded-2xl border border-[#087985]/30">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#D7ECE5]">
            Value vs. Cumulative Contributions (Days 1 - {currentDay})
          </h4>
          <span className="text-[11px] text-[#D7ECE5]/60">Updated on each simulated step</span>
        </div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5E86C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C5E86C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#D7ECE5" opacity={0.5} fontSize={10} tickLine={false} />
              <YAxis
                stroke="#D7ECE5"
                opacity={0.5}
                fontSize={10}
                tickLine={false}
                tickFormatter={(val) => `₹${val}`}
              />
              <RechartsTooltip
                formatter={(val, name) => [
                  `₹${val}`,
                  name === 'portfolioVal' ? 'Portfolio Value' : 'Virtual Invested'
                ]}
                contentStyle={{
                  backgroundColor: '#063F46',
                  borderColor: '#087985',
                  borderRadius: '8px',
                  color: '#F4F3E9'
                }}
              />
              <Area
                type="monotone"
                dataKey="portfolioVal"
                name="portfolioVal"
                stroke="#C5E86C"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#valGrad)"
              />
              <Area
                type="stepAfter"
                dataKey="invested"
                name="invested"
                stroke="#087985"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day 30 Final Result Screen & Education debrief */}
      {isFinished && (
        <div className="p-6 rounded-2xl bg-[#042c31] border border-[#C5E86C]/40 space-y-4 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#C5E86C]" />
            <h4 className="text-base font-extrabold text-[#F4F3E9]">
              30-Day SIP Experiment Completed!
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#063F46] border border-[#087985]/40 text-xs">
            <div>
              <span className="text-[#D7ECE5]/60 block">Total Contributions</span>
              <span className="text-base font-extrabold text-[#F4F3E9]">
                {formatINR(currentSnapshot.totalInvested)}
              </span>
            </div>
            <div>
              <span className="text-[#D7ECE5]/60 block">Final Portfolio Value</span>
              <span className="text-base font-extrabold text-[#C5E86C]">
                {formatINR(currentSnapshot.portfolioVal)}
              </span>
            </div>
            <div>
              <span className="text-[#D7ECE5]/60 block">Net Gain / Loss</span>
              <span
                className={`text-base font-extrabold ${
                  isProfitable ? 'text-[#10B981]' : 'text-[#F87171]'
                }`}
              >
                {isProfitable ? `+${formatINR(currentSnapshot.profitLoss)}` : formatINR(currentSnapshot.profitLoss)} (
                {formatPercent(currentSnapshot.returnPct)})
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#084850]/50 border border-[#087985]/30 text-xs text-[#D7ECE5] leading-relaxed space-y-2">
            <p className="font-bold text-[#C5E86C]">
              Key SIP Takeaway: Rupee Cost Averaging in Practice
            </p>
            <p>
              Notice how when the NAV dipped midway, your regular contributions acquired <em>more units</em> for the same rupee amount. When the NAV recovered, those cheaper units magnified your total value.
            </p>
            <p className="text-[11px] text-[#D7ECE5]/70">
              <strong>Important:</strong> A Systematic Investment Plan (SIP) is a disciplined contribution vehicle, not an insurance policy against bear markets. Mutual fund values fluctuate with market forces.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
