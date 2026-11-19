import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { formatINR, formatPercent } from '../../utils/formatters';

export default function FinancialPerformanceSection({ performance }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [periodType, setPeriodType] = useState('quarterly'); // quarterly | yearly

  const data = performance ? performance[periodType] || [] : [];

  // Latest entry metrics
  const latest = data[data.length - 1] || { revenue: 0, profit: 0, period: '' };
  const prev = data[data.length - 2] || { revenue: latest.revenue, profit: latest.profit };
  const revenueGrowth = prev.revenue > 0 ? ((latest.revenue - prev.revenue) / prev.revenue) * 100 : 0;
  const profitMargin = latest.revenue > 0 ? (latest.profit / latest.revenue) * 100 : 0;

  return (
    <div className="bg-[#084850]/70 rounded-2xl border border-[#087985]/50 overflow-hidden shadow-md">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#042c31]/50 hover:bg-[#042c31]/80 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <h4 className="text-base font-bold text-[#F4F3E9]">Financial Performance</h4>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#063F46] text-[#C5E86C] border border-[#C5E86C]/30">
            Fictional Statements
          </span>
        </div>
        <div className="text-[#D7ECE5]/60 hover:text-[#C5E86C]">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 sm:p-5 border-t border-[#087985]/30 space-y-5">
          {/* Controls: Quarterly vs Yearly Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 bg-[#063F46] p-1 rounded-xl border border-[#087985]/40 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPeriodType('quarterly')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  periodType === 'quarterly'
                    ? 'bg-[#087985] text-[#C5E86C] border border-[#C5E86C]/30'
                    : 'text-[#D7ECE5]/70 hover:text-[#F4F3E9]'
                }`}
              >
                Quarterly
              </button>
              <button
                type="button"
                onClick={() => setPeriodType('yearly')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  periodType === 'yearly'
                    ? 'bg-[#087985] text-[#C5E86C] border border-[#C5E86C]/30'
                    : 'text-[#D7ECE5]/70 hover:text-[#F4F3E9]'
                }`}
              >
                Yearly
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-[#D7ECE5]/60">Latest Rev ({latest.period}): </span>
                <span className="font-bold text-[#F4F3E9]">₹{latest.revenue} Cr</span>
              </div>
              <div>
                <span className="text-[#D7ECE5]/60">Profit: </span>
                <span className="font-bold text-[#C5E86C]">₹{latest.profit} Cr</span>
              </div>
              <div className="text-[#10B981] font-bold">
                {formatPercent(revenueGrowth)} YoY
              </div>
            </div>
          </div>

          {/* Revenue vs Profit Bar Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis
                  dataKey="period"
                  stroke="#D7ECE5"
                  opacity={0.6}
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#D7ECE5"
                  opacity={0.6}
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val} Cr`}
                />
                <RechartsTooltip
                  formatter={(val) => [`₹${val} Cr`, '']}
                  contentStyle={{
                    backgroundColor: '#063F46',
                    borderColor: '#087985',
                    borderRadius: '8px',
                    color: '#F4F3E9'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(value) => (
                    <span className="text-[#D7ECE5] text-xs font-semibold">{value}</span>
                  )}
                />
                <Bar dataKey="revenue" name="Revenue (₹ Cr)" fill="#087985" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit (₹ Cr)" fill="#C5E86C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
