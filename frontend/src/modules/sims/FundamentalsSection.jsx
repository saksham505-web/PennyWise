import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import Tooltip from '../../components/Tooltip';
import { FUNDAMENTALS_TOOLTIPS } from '../../data/initialData';

export default function FundamentalsSection({ fundamentals }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const entries = Object.entries(fundamentals || {});

  return (
    <div className="bg-[#084850]/70 rounded-2xl border border-[#087985]/50 overflow-hidden shadow-md">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#042c31]/50 hover:bg-[#042c31]/80 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <h4 className="text-base font-bold text-[#F4F3E9]">Fundamentals</h4>
          <Tooltip
            title="What are Fundamentals?"
            text="Core accounting ratios and financial health metrics used to assess a company's financial soundness and valuation."
          />
        </div>
        <div className="text-[#D7ECE5]/60 hover:text-[#C5E86C]">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* 2-Column Grid of Fundamental Ratios */}
      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-[#087985]/30 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
          {entries.map(([label, value]) => {
            const tooltipText = FUNDAMENTALS_TOOLTIPS[label] || 'Financial metric indicator.';
            return (
              <div
                key={label}
                className="flex items-center justify-between py-2 border-b border-[#087985]/20 last:border-b-0"
              >
                <div className="flex items-center gap-1.5 text-xs text-[#D7ECE5]/80 font-medium">
                  <span>{label}</span>
                  <Tooltip title={label} text={tooltipText}>
                    <Info className="w-3 h-3 text-[#D7ECE5]/50 hover:text-[#C5E86C]" />
                  </Tooltip>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-[#F4F3E9] tracking-tight">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
