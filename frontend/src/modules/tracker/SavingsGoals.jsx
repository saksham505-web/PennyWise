import React, { useState } from 'react';
import { Target, Plus, Check, Calendar, TrendingUp } from 'lucide-react';
import { formatINR, formatPercent, formatDate } from '../../utils/formatters';

export default function SavingsGoals({
  goals,
  onAddGoal,
  onAllocateSavings
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [allocatingGoalId, setAllocatingGoalId] = useState(null);
  const [allocatingAmount, setAllocatingAmount] = useState('');

  // New goal state
  const [newGoalName, setNewGoalName] = useState('');
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [newInitialSaved, setNewInitialSaved] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newTargetAmount) return;

    onAddGoal({
      id: `goal-${Date.now()}`,
      name: newGoalName.trim(),
      targetAmount: parseFloat(newTargetAmount) || 1000,
      savedAmount: parseFloat(newInitialSaved) || 0,
      targetDate: newTargetDate || ''
    });

    setNewGoalName('');
    setNewTargetAmount('');
    setNewInitialSaved('');
    setNewTargetDate('');
    setIsAdding(false);
  };

  const handleAllocateSubmit = (goalId) => {
    const val = parseFloat(allocatingAmount);
    if (!isNaN(val) && val > 0) {
      onAllocateSavings(goalId, val);
    }
    setAllocatingGoalId(null);
    setAllocatingAmount('');
  };

  const totalTarget = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((acc, g) => acc + (g.savedAmount || 0), 0);

  return (
    <div className="bg-[#084850]/70 rounded-2xl p-6 border border-[#087985]/50 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C5E86C]" />
            <h3 className="text-lg font-bold text-[#F4F3E9]">Savings Goals & Targets</h3>
          </div>
          <p className="text-xs text-[#D7ECE5]/70 mt-0.5">
            Earmark funds for goals without treating them as ordinary expenses.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#063F46] hover:bg-[#087985] text-[#C5E86C] text-xs font-bold rounded-xl border border-[#087985] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Summary Row */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#063F46]/60 border border-[#087985]/30 mb-6">
        <div>
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium">Total Earmarked</span>
          <div className="text-base font-extrabold text-[#C5E86C]">
            {formatINR(totalSaved)}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#D7ECE5]/70 font-medium">Target Accumulation</span>
          <div className="text-base font-extrabold text-[#F4F3E9]">
            {formatINR(totalTarget)}
          </div>
        </div>
      </div>

      {/* Add Goal Modal / Inline Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateGoal}
          className="bg-[#063F46] border border-[#087985] rounded-xl p-4 mb-5 space-y-3 animate-fade-in"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5E86C]">
            Create a New Savings Goal
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#D7ECE5]/80 mb-1">
                Goal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Study Laptop Fund"
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className="w-full bg-[#042c31] border border-[#087985] rounded-lg px-3 py-1.5 text-xs text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#D7ECE5]/80 mb-1">
                Target Amount (₹) *
              </label>
              <input
                type="number"
                min="100"
                required
                placeholder="e.g. 25000"
                value={newTargetAmount}
                onChange={(e) => setNewTargetAmount(e.target.value)}
                className="w-full bg-[#042c31] border border-[#087985] rounded-lg px-3 py-1.5 text-xs text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#D7ECE5]/80 mb-1">
                Initial Saved Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={newInitialSaved}
                onChange={(e) => setNewInitialSaved(e.target.value)}
                className="w-full bg-[#042c31] border border-[#087985] rounded-lg px-3 py-1.5 text-xs text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#D7ECE5]/80 mb-1">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="w-full bg-[#042c31] border border-[#087985] rounded-lg px-3 py-1.5 text-xs text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 rounded-lg text-xs text-[#D7ECE5]/70 hover:bg-[#084850]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#C5E86C] text-[#063F46] font-bold text-xs rounded-lg hover:bg-[#B7D16A]"
            >
              Add Goal
            </button>
          </div>
        </form>
      )}

      {/* Goal Cards List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const percent = goal.targetAmount > 0
            ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100)
            : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
          const isComplete = goal.savedAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="p-4 rounded-xl bg-[#063F46]/40 border border-[#087985]/30 hover:border-[#087985]/60 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F4F3E9]">{goal.name}</span>
                    {isComplete && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Achieved!
                      </span>
                    )}
                  </div>
                  {goal.targetDate && (
                    <div className="flex items-center gap-1 text-[10px] text-[#D7ECE5]/60 mt-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#C5E86C]">
                    {formatINR(goal.savedAmount)}
                  </span>
                  <span className="text-[11px] text-[#D7ECE5]/60">
                    {' '}/ {formatINR(goal.targetAmount)}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#042c31] h-2 rounded-full overflow-hidden my-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-[#10B981]' : 'bg-[#B7D16A]'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#D7ECE5]/70 pt-1">
                <span>{percent.toFixed(0)}% saved</span>
                
                {/* Allocate Action */}
                {allocatingGoalId === goal.id ? (
                  <div className="flex items-center gap-1.5 animate-fade-in">
                    <input
                      type="number"
                      min="1"
                      placeholder="Add ₹"
                      value={allocatingAmount}
                      onChange={(e) => setAllocatingAmount(e.target.value)}
                      className="w-20 bg-[#042c31] border border-[#087985] rounded px-1.5 py-0.5 text-xs text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
                    />
                    <button
                      onClick={() => handleAllocateSubmit(goal.id)}
                      className="px-2 py-0.5 bg-[#C5E86C] text-[#063F46] font-bold text-xs rounded hover:bg-[#B7D16A]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setAllocatingGoalId(null)}
                      className="text-xs text-[#D7ECE5]/50 hover:text-[#D7ECE5]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAllocatingGoalId(goal.id);
                      setAllocatingAmount('500');
                    }}
                    className="text-xs font-semibold text-[#C5E86C] hover:underline"
                  >
                    + Allocate Funds
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
