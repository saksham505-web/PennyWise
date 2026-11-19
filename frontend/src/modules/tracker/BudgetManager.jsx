import React, { useState } from 'react';
import { Edit3, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatINR, formatPercent } from '../../utils/formatters';

export default function BudgetManager({
  budgetCategories,
  expensesByCategory,
  onUpdateBudget
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudgets, setEditedBudgets] = useState({});

  const startEdit = () => {
    const map = {};
    budgetCategories.forEach((cat) => {
      map[cat.id] = cat.budget;
    });
    setEditedBudgets(map);
    setIsEditing(true);
  };

  const handleSave = () => {
    Object.keys(editedBudgets).forEach((catId) => {
      const val = parseFloat(editedBudgets[catId]);
      if (!isNaN(val) && val >= 0) {
        onUpdateBudget(catId, val);
      }
    });
    setIsEditing(false);
  };

  const totalAllocated = budgetCategories.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalSpent = Object.values(expensesByCategory).reduce((acc, v) => acc + v, 0);

  return (
    <div className="bg-[#084850]/70 rounded-2xl p-6 border border-[#087985]/50 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#F4F3E9]">Monthly Budget Planner</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#063F46] text-[#C5E86C] border border-[#C5E86C]/30">
              Student Baseline
            </span>
          </div>
          <p className="text-xs text-[#D7ECE5]/70 mt-0.5">
            Set spending limits by category to keep cash flow balanced.
          </p>
        </div>

        <div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Limits</span>
            </button>
          ) : (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#063F46] hover:bg-[#087985] text-[#D7ECE5] text-xs font-semibold rounded-xl border border-[#087985] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Budgets</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-xl bg-[#063F46]/60 border border-[#087985]/30">
        <div>
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium block">Total Budget</span>
          <span className="text-sm sm:text-base font-extrabold text-[#F4F3E9]">
            {formatINR(totalAllocated)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium block">Spent</span>
          <span className="text-sm sm:text-base font-extrabold text-[#C5E86C]">
            {formatINR(totalSpent)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium block">Remaining</span>
          <span className={`text-sm sm:text-base font-extrabold ${totalAllocated - totalSpent < 0 ? 'text-[#F87171]' : 'text-[#D7ECE5]'}`}>
            {formatINR(totalAllocated - totalSpent)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium block">Used</span>
          <span className="text-sm sm:text-base font-extrabold text-[#B7D16A]">
            {totalAllocated > 0 ? formatPercent((totalSpent / totalAllocated) * 100, false) : '0%'}
          </span>
        </div>
      </div>

      {/* Categories Progress List */}
      <div className="space-y-4">
        {budgetCategories
          .filter((cat) => cat.budget > 0 || (expensesByCategory[cat.name] || 0) > 0 || isEditing)
          .map((cat) => {
            const spent = expensesByCategory[cat.name] || 0;
            const currentBudget = isEditing
              ? (editedBudgets[cat.id] !== undefined ? editedBudgets[cat.id] : cat.budget)
              : cat.budget;
            const percentUsed = currentBudget > 0 ? (spent / currentBudget) * 100 : 0;
            const remaining = currentBudget - spent;
            const isNearLimit = percentUsed >= 80 && percentUsed < 100;
            const isOverBudget = percentUsed >= 100;

            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-xl bg-[#063F46]/40 border border-[#087985]/30 hover:border-[#087985]/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-xs font-bold text-[#F4F3E9]">{cat.name}</span>
                    {isOverBudget && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#F87171] bg-[#F87171]/10 px-1.5 py-0.5 rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5" /> Over limit
                      </span>
                    )}
                    {isNearLimit && (
                      <span className="text-[10px] font-semibold text-[#FB923C] bg-[#FB923C]/10 px-1.5 py-0.5 rounded-full">
                        Nearing limit
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#D7ECE5]/60">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={editedBudgets[cat.id] ?? cat.budget}
                          onChange={(e) =>
                            setEditedBudgets({
                              ...editedBudgets,
                              [cat.id]: e.target.value
                            })
                          }
                          className="w-20 bg-[#063F46] border border-[#087985] rounded-lg px-2 py-0.5 text-xs text-[#F4F3E9] text-right focus:outline-none focus:border-[#C5E86C]"
                        />
                      </div>
                    ) : (
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#F4F3E9]">
                          {formatINR(spent)}
                        </span>
                        <span className="text-[11px] text-[#D7ECE5]/60">
                          {' '}/ {formatINR(cat.budget)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#042c31] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOverBudget
                        ? 'bg-[#F87171]'
                        : isNearLimit
                        ? 'bg-[#FB923C]'
                        : 'bg-[#C5E86C]'
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#D7ECE5]/60 mt-1.5">
                  <span>{percentUsed.toFixed(0)}% used</span>
                  <span>
                    {remaining >= 0 ? `${formatINR(remaining)} remaining` : `${formatINR(Math.abs(remaining))} over`}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
