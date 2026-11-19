import React, { useState, useMemo } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Layers,
  PiggyBank,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { formatINR, formatPercent } from '../../utils/formatters';
import EnlargedDonutChart from './EnlargedDonutChart';
import TransactionsDrawer from './TransactionsDrawer';
import BudgetManager from './BudgetManager';
import SavingsGoals from './SavingsGoals';
import MrLlamaMascot from '../../components/MrLlamaMascot';

export default function TrackerModule({
  trackerData,
  onUpdateTrackerData
}) {
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const selectedMonth = trackerData.selectedMonth || new Date().toISOString().slice(0, 7);

  // Filter transactions for the selected month
  const monthlyTransactions = useMemo(() => {
    return trackerData.transactions.filter((tx) => {
      return tx.date.startsWith(selectedMonth);
    });
  }, [trackerData.transactions, selectedMonth]);

  // Total Lifetime Balance calculation:
  // Total Balance = Opening Balance + Lifetime Income - Lifetime Expenses
  const { totalBalance, monthlyIncome, monthlyExpenses } = useMemo(() => {
    let lifetimeIncome = 0;
    let lifetimeExpenses = 0;
    let mIncome = 0;
    let mExpenses = 0;

    trackerData.transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        lifetimeIncome += amt;
        if (tx.date.startsWith(selectedMonth)) {
          mIncome += amt;
        }
      } else if (tx.type === 'expense') {
        lifetimeExpenses += amt;
        if (tx.date.startsWith(selectedMonth)) {
          mExpenses += amt;
        }
      }
    });

    const balance = (trackerData.openingBalance || 0) + lifetimeIncome - lifetimeExpenses;
    return {
      totalBalance: balance,
      monthlyIncome: mIncome,
      monthlyExpenses: mExpenses
    };
  }, [trackerData.transactions, trackerData.openingBalance, selectedMonth]);

  // Total explicitly allocated savings
  const totalAllocatedSavings = useMemo(() => {
    return (trackerData.savingsGoals || []).reduce(
      (acc, g) => acc + (Number(g.savedAmount) || 0),
      0
    );
  }, [trackerData.savingsGoals]);

  // Available-to-spend = Total Balance - Explicitly Allocated Savings
  const availableToSpend = Math.max(0, totalBalance - totalAllocatedSavings);

  // Monthly Net Cash Flow
  const monthlyNetCashFlow = monthlyIncome - monthlyExpenses;

  // Monthly expenses grouped by category
  const expensesByCategory = useMemo(() => {
    const map = {};
    monthlyTransactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + (Number(tx.amount) || 0);
      });
    return map;
  }, [monthlyTransactions]);

  // Category array with colors for donut chart
  const categoryExpensesForChart = useMemo(() => {
    const categoryColors = {};
    (trackerData.budgetCategories || []).forEach((c) => {
      categoryColors[c.name] = c.color;
    });

    return Object.keys(expensesByCategory).map((catName) => ({
      name: catName,
      spent: expensesByCategory[catName],
      color: categoryColors[catName] || '#087985'
    }));
  }, [expensesByCategory, trackerData.budgetCategories]);

  // Transaction handlers
  const handleAddTransaction = (tx) => {
    const newTx = {
      ...tx,
      id: `tx-${Date.now()}`
    };
    onUpdateTrackerData({
      ...trackerData,
      transactions: [newTx, ...trackerData.transactions]
    });
  };

  const handleEditTransaction = (id, updated) => {
    const newTransactions = trackerData.transactions.map((tx) => {
      if (tx.id === id) {
        return { ...tx, ...updated };
      }
      return tx;
    });
    onUpdateTrackerData({
      ...trackerData,
      transactions: newTransactions
    });
  };

  const handleDeleteTransaction = (id) => {
    const newTransactions = trackerData.transactions.filter((tx) => tx.id !== id);
    onUpdateTrackerData({
      ...trackerData,
      transactions: newTransactions
    });
  };

  const handleUpdateBudget = (catId, newBudget) => {
    const newCategories = trackerData.budgetCategories.map((cat) => {
      if (cat.id === catId) {
        return { ...cat, budget: newBudget };
      }
      return cat;
    });
    onUpdateTrackerData({
      ...trackerData,
      budgetCategories: newCategories
    });
  };

  const handleAddGoal = (newGoal) => {
    onUpdateTrackerData({
      ...trackerData,
      savingsGoals: [...(trackerData.savingsGoals || []), newGoal]
    });
  };

  const handleAllocateSavings = (goalId, amount) => {
    const newGoals = (trackerData.savingsGoals || []).map((goal) => {
      if (goal.id === goalId) {
        return { ...goal, savedAmount: (goal.savedAmount || 0) + amount };
      }
      return goal;
    });
    onUpdateTrackerData({
      ...trackerData,
      savingsGoals: newGoals
    });
  };

  // Determine mascot expression
  let mascotExpression = 'relaxed';
  let mascotSpeech = 'Welcome back! Let\'s balance our cash flow today.';
  if (totalBalance < 1000) {
    mascotExpression = 'encouraging';
    mascotSpeech = 'Balance is running lean. Let\'s review variable expenses.';
  } else if (monthlyNetCashFlow > 2000) {
    mascotExpression = 'happy';
    mascotSpeech = 'Great work! You have positive cash flow this month.';
  } else if (monthlyExpenses > monthlyIncome && monthlyIncome > 0) {
    mascotExpression = 'thinking';
    mascotSpeech = 'Expenses exceed income this month. Check where money went!';
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Financial Anchor Banner: Total Available Balance & High-level Metrics */}
      <div className="bg-gradient-to-r from-[#063F46] via-[#084850] to-[#042c31] rounded-3xl p-6 sm:p-8 border border-[#087985]/60 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5E86C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Financial Anchor: Total Balance */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5E86C] animate-pulse" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#D7ECE5]/70">
                Total Available Balance
              </span>
            </div>

            <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F3E9]">
              {formatINR(totalBalance)}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs sm:text-sm">
              <div className="bg-[#063F46]/80 px-3.5 py-1.5 rounded-xl border border-[#087985]/40 flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-[#B7D16A]" />
                <span className="text-[#D7ECE5]/80">Available-to-Spend:</span>
                <span className="font-bold text-[#F4F3E9]">{formatINR(availableToSpend)}</span>
              </div>
              <div className="text-[#D7ECE5]/60 text-xs">
                (Earmarked for goals: {formatINR(totalAllocatedSavings)})
              </div>
            </div>
          </div>

          {/* Right Column: Mascot Greeting & Transactions Action Button */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
            
            <div className="flex items-center gap-3 bg-[#063F46]/60 p-3 rounded-2xl border border-[#087985]/30 max-w-sm">
              <MrLlamaMascot expression={mascotExpression} size="sm" />
              <p className="text-xs text-[#D7ECE5] leading-snug">
                {mascotSpeech}
              </p>
            </div>

            {/* Prominent Button-Triggered Transactions Interface */}
            <button
              onClick={() => setIsTransactionsOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-sm rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Receipt className="w-4 h-4" />
              <span>View & Manage Transactions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Monthly Summary Bar: Income vs Expenses vs Net Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#087985]/40">
          
          <div className="bg-[#063F46]/50 rounded-2xl p-4 border border-[#087985]/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#D7ECE5]/70">Monthly Income</span>
              <span className="p-1 rounded-lg bg-[#10B981]/20 text-[#10B981]">
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#10B981] mt-1">
              +{formatINR(monthlyIncome)}
            </div>
            <div className="text-[11px] text-[#D7ECE5]/50 mt-0.5">Current billing cycle</div>
          </div>

          <div className="bg-[#063F46]/50 rounded-2xl p-4 border border-[#087985]/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#D7ECE5]/70">Monthly Expenses</span>
              <span className="p-1 rounded-lg bg-[#F87171]/20 text-[#F87171]">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[#F87171] mt-1">
              -{formatINR(monthlyExpenses)}
            </div>
            <div className="text-[11px] text-[#D7ECE5]/50 mt-0.5">Recorded outflows</div>
          </div>

          <div className="bg-[#063F46]/50 rounded-2xl p-4 border border-[#087985]/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#D7ECE5]/70">Net Monthly Flow</span>
              <span className="p-1 rounded-lg bg-[#087985]/40 text-[#C5E86C]">
                <TrendingUp className="w-3.5 h-3.5" />
              </span>
            </div>
            <div
              className={`text-xl sm:text-2xl font-extrabold mt-1 ${
                monthlyNetCashFlow >= 0 ? 'text-[#C5E86C]' : 'text-[#F87171]'
              }`}
            >
              {monthlyNetCashFlow >= 0 ? `+${formatINR(monthlyNetCashFlow)}` : formatINR(monthlyNetCashFlow)}
            </div>
            <div className="text-[11px] text-[#D7ECE5]/50 mt-0.5">
              {monthlyNetCashFlow >= 0 ? 'Surplus added to reserve' : 'Deficit drawn from balance'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tracker Grid: Donut Chart on one side, Budget & Goals on the other */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Enlarged Donut Chart */}
        <div className="lg:col-span-7 space-y-8">
          <EnlargedDonutChart
            categoryExpenses={categoryExpensesForChart}
            totalExpenses={monthlyExpenses}
          />

          <SavingsGoals
            goals={trackerData.savingsGoals || []}
            onAddGoal={handleAddGoal}
            onAllocateSavings={handleAllocateSavings}
          />
        </div>

        {/* Right Column: Monthly Budget Planner */}
        <div className="lg:col-span-5 space-y-8">
          <BudgetManager
            budgetCategories={trackerData.budgetCategories || []}
            expensesByCategory={expensesByCategory}
            onUpdateBudget={handleUpdateBudget}
          />
        </div>
      </div>

      {/* Button-Triggered Transactions Drawer */}
      <TransactionsDrawer
        isOpen={isTransactionsOpen}
        onClose={() => setIsTransactionsOpen(false)}
        transactions={trackerData.transactions}
        onAddTransaction={handleAddTransaction}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
    </div>
  );
}
