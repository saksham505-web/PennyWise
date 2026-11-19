import React, { useState } from 'react';
import {
  Layers,
  Repeat,
  Shield,
  TrendingUp,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { FICTIONAL_FUNDS } from '../../data/initialData';
import { formatINR } from '../../utils/formatters';
import AcceleratedTimeline from './AcceleratedTimeline';

export default function MutualFundSimulation({
  simsState,
  onUpdateSimsState
}) {
  const [selectedFundId, setSelectedFundId] = useState(FICTIONAL_FUNDS[0].id);
  const [contributionAmount, setContributionAmount] = useState('1000');
  const [frequency, setFrequency] = useState('weekly'); // daily, weekly, monthly
  const [activeExperiment, setActiveExperiment] = useState(null);

  const selectedFund = FICTIONAL_FUNDS.find((f) => f.id === selectedFundId) || FICTIONAL_FUNDS[0];

  const handleStartExperiment = (e) => {
    e.preventDefault();
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) return;

    setActiveExperiment({
      fund: selectedFund,
      contributionAmount: amount,
      frequency
    });
  };

  const handleResetExperiment = () => {
    setActiveExperiment(null);
  };

  // If experiment is running, render accelerated timeline
  if (activeExperiment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleResetExperiment}
            className="text-xs font-bold text-[#D7ECE5]/80 hover:text-[#C5E86C] flex items-center gap-1.5 transition-colors"
          >
            ← Back to Mutual Fund Catalog
          </button>
        </div>

        <AcceleratedTimeline
          experiment={activeExperiment}
          onResetExperiment={handleResetExperiment}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Intro Banner */}
      <div className="bg-[#084850]/70 rounded-3xl p-6 sm:p-8 border border-[#087985]/50 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7ECE5]/70">
              Systematic Investment Plan Lab
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#F4F3E9] tracking-tight">
            Mutual Fund Simulation
          </h2>
          <p className="text-xs text-[#D7ECE5]/70 mt-1 max-w-xl">
            Simulate a 30-day recurring SIP with daily, weekly, or monthly contributions.
            Observe Rupee Cost Averaging across realistic market cycles.
          </p>
        </div>

        <div className="bg-[#063F46] p-4 rounded-2xl border border-[#087985]/40 text-left sm:text-right w-full sm:w-auto">
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium block">
            Virtual Portfolio Cash
          </span>
          <span className="text-2xl font-extrabold text-[#C5E86C] tracking-tight">
            {formatINR(simsState.virtualCash)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Fund Selector & SIP Setup Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#084850]/70 rounded-3xl p-6 border border-[#087985]/50 shadow-md">
            <h3 className="font-extrabold text-base text-[#F4F3E9] mb-4 flex items-center gap-2">
              <Repeat className="w-4 h-4 text-[#C5E86C]" />
              Configure Virtual SIP Experiment
            </h3>

            <form onSubmit={handleStartExperiment} className="space-y-4">
              {/* Select Fund */}
              <div>
                <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1.5">
                  Select Fictional Mutual Fund *
                </label>
                <div className="space-y-2">
                  {FICTIONAL_FUNDS.map((fund) => {
                    const isSelected = fund.id === selectedFundId;
                    return (
                      <div
                        key={fund.id}
                        onClick={() => setSelectedFundId(fund.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#087985] text-[#F4F3E9] border-[#C5E86C]/50 shadow-sm'
                            : 'bg-[#063F46]/50 hover:bg-[#063F46] text-[#D7ECE5]/80 border-[#087985]/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{fund.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#063F46] text-[#C5E86C] border border-[#C5E86C]/30">
                              {fund.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#D7ECE5]/70 mt-0.5">
                            {fund.description}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <span className="text-xs font-extrabold block">
                            NAV ₹{fund.currentNav.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-[#D7ECE5]/60">
                            Risk: {fund.risk}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contribution Amount & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1.5">
                    Contribution Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="w-full bg-[#063F46] border border-[#087985] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1.5">
                    Frequency *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#063F46] p-1 rounded-xl border border-[#087985]/40 text-xs font-semibold">
                    {['daily', 'weekly', 'monthly'].map((freq) => (
                      <button
                        type="button"
                        key={freq}
                        onClick={() => setFrequency(freq)}
                        className={`py-1.5 rounded-lg capitalize transition-colors ${
                          frequency === freq
                            ? 'bg-[#087985] text-[#C5E86C]'
                            : 'text-[#D7ECE5]/70 hover:text-[#F4F3E9]'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-4"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch 30-Day Accelerated Timeline</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Educational Glossary on Mutual Funds */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#084850]/70 rounded-3xl p-6 border border-[#087985]/50 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[#C5E86C]" />
              <h3 className="font-extrabold text-sm text-[#F4F3E9]">
                Mutual Funds & SIP Knowledge Hub
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-[#063F46]/60 border border-[#087985]/30">
                <div className="font-bold text-[#C5E86C] mb-1">What is a Mutual Fund?</div>
                <p className="text-[#D7ECE5]/80 leading-relaxed">
                  A mutual fund pools money from many investors to purchase a diversified portfolio of stocks, bonds, or money market instruments managed by professional asset managers.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#063F46]/60 border border-[#087985]/30">
                <div className="font-bold text-[#C5E86C] mb-1">What is NAV (Net Asset Value)?</div>
                <p className="text-[#D7ECE5]/80 leading-relaxed">
                  NAV represents the per-unit price of the mutual fund, calculated as the fund's total assets minus liabilities divided by the number of outstanding units.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#063F46]/60 border border-[#087985]/30">
                <div className="font-bold text-[#C5E86C] mb-1">What is a SIP?</div>
                <p className="text-[#D7ECE5]/80 leading-relaxed">
                  A Systematic Investment Plan automatically invests a fixed sum at regular intervals. It builds wealth through discipline and Rupee Cost Averaging without timing the market.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#063F46]/60 border border-[#087985]/30">
                <div className="font-bold text-[#C5E86C] mb-1">Rupee Cost Averaging</div>
                <p className="text-[#D7ECE5]/80 leading-relaxed">
                  When prices are low, your fixed contribution buys more units. When prices rise, it buys fewer. Over time, this lowers your average acquisition cost per unit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
