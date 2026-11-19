import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { formatINR, formatPercent } from '../../utils/formatters';

const DEFAULT_COLORS = [
  '#C5E86C', // Electric chartreuse
  '#087985', // Deep teal
  '#B7D16A', // Muted olive
  '#D7ECE5', // Pale mint
  '#10B981', // Green
  '#F87171', // Coral/Red
  '#38BDF8', // Sky
  '#FB923C', // Orange
  '#94A3B8'  // Slate
];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function EnlargedDonutChart({ categoryExpenses, totalExpenses }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // If no expenses, show placeholder
  const chartData = useMemo(() => {
    if (!categoryExpenses || categoryExpenses.length === 0) {
      return [{ name: 'No Expenses', value: 1, color: '#084850', percent: 0 }];
    }
    return categoryExpenses.map((cat, idx) => ({
      name: cat.name,
      value: cat.spent,
      color: cat.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      percent: totalExpenses > 0 ? (cat.spent / totalExpenses) * 100 : 0
    }));
  }, [categoryExpenses, totalExpenses]);

  const activeCategory = chartData[activeIndex] || chartData[0];

  return (
    <div className="bg-[#084850]/70 rounded-2xl p-6 border border-[#087985]/50 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#F4F3E9]">Expense Breakdown</h3>
          <p className="text-xs text-[#D7ECE5]/70">Interactive category analysis</p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs text-[#D7ECE5]/60 font-medium">Total Spent This Month</div>
          <div className="text-xl font-extrabold text-[#C5E86C] tracking-tight">
            {formatINR(totalExpenses)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Enlarged Donut Chart with Center Data */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[300px]">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={125}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onClick={(_, index) => setActiveIndex(index)}
                  cursor="pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#063F46"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Center Callout: Selected Category Name, Amount & Proportions */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#D7ECE5]/70">
              {activeCategory?.name}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F4F3E9] mt-0.5 tracking-tight">
              {activeCategory?.name === 'No Expenses' ? '₹0' : formatINR(activeCategory?.value)}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 bg-[#063F46] text-[#C5E86C] border border-[#C5E86C]/30">
              {activeCategory?.percent ? formatPercent(activeCategory.percent, false) : '0%'} of total
            </span>
          </div>
        </div>

        {/* Category Legend with Interactive Selection */}
        <div className="lg:col-span-5 flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
          {chartData.map((cat, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                  isSelected
                    ? 'bg-[#087985] text-[#F4F3E9] border border-[#C5E86C]/40 shadow-sm'
                    : 'bg-[#063F46]/50 hover:bg-[#063F46] text-[#D7ECE5]/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-semibold truncate">{cat.name}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="text-xs font-bold text-[#F4F3E9] block">
                    {formatINR(cat.value)}
                  </span>
                  <span className="text-[10px] text-[#D7ECE5]/60">
                    {formatPercent(cat.percent, false)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
