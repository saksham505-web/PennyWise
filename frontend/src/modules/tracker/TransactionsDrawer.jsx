import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Bills',
  'Other'
];

const INCOME_SOURCES = [
  'Allowance / Stipend',
  'Salary / Job',
  'Freelance / Gig',
  'Scholarship',
  'Gift / Family',
  'Investment Return',
  'Other'
];

export default function TransactionsDrawer({
  isOpen,
  onClose,
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction
}) {
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [txType, setTxType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const startAdd = (type = 'expense') => {
    setEditingId(null);
    setTxType(type);
    setAmount('');
    setCategory(type === 'income' ? 'Allowance / Stipend' : 'Food');
    setDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    setFormError('');
    setIsAdding(true);
  };

  const startEdit = (tx) => {
    setEditingId(tx.id);
    setTxType(tx.type);
    setAmount(tx.amount.toString());
    setCategory(tx.category);
    setDate(tx.date);
    setDescription(tx.description || '');
    setFormError('');
    setIsAdding(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Please enter a valid amount greater than 0.');
      return;
    }
    if (!category.trim()) {
      setFormError('Please select a category or source.');
      return;
    }

    const payload = {
      type: txType,
      amount: numericAmount,
      category: category.trim(),
      date: date || new Date().toISOString().slice(0, 10),
      description: description.trim()
    };

    if (editingId) {
      onEditTransaction(editingId, payload);
    } else {
      onAddTransaction(payload);
    }

    setIsAdding(false);
    setEditingId(null);
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      if (filter === 'all') return true;
      return tx.type === filter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-[#063F46] text-[#F4F3E9] h-full flex flex-col shadow-2xl border-l border-[#087985] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#087985]/50 flex items-center justify-between bg-[#042c31]">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#F4F3E9]">Transactions Ledger</h2>
            <p className="text-xs text-[#D7ECE5]/70">Track, add, edit, or remove financial records</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#D7ECE5]/70 hover:text-[#C5E86C] hover:bg-[#084850] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Filters */}
        <div className="p-4 border-b border-[#087985]/30 bg-[#084850]/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#063F46] p-1 rounded-xl border border-[#087985]/40 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-[#087985] text-[#C5E86C]' : 'text-[#D7ECE5]/70'
              }`}
            >
              All ({transactions.length})
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'income' ? 'bg-[#087985] text-[#10B981]' : 'text-[#D7ECE5]/70'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'expense' ? 'bg-[#087985] text-[#F87171]' : 'text-[#D7ECE5]/70'
              }`}
            >
              Expenses
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startAdd('income')}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#10B981]/20 hover:bg-[#10B981]/30 text-[#10B981] border border-[#10B981]/40 rounded-xl text-xs font-bold transition-colors"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>+ Income</span>
            </button>
            <button
              onClick={() => startAdd('expense')}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Expense</span>
            </button>
          </div>
        </div>

        {/* Content Area: Form or Transaction List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Add / Edit Form Modal inside drawer */}
          {isAdding && (
            <div className="bg-[#084850] border border-[#087985] rounded-2xl p-5 mb-6 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#F4F3E9] flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${txType === 'income' ? 'bg-[#10B981]' : 'bg-[#C5E86C]'}`} />
                  {editingId ? 'Edit Transaction' : `Record New ${txType === 'income' ? 'Income' : 'Expense'}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-[#D7ECE5]/60 hover:text-[#F4F3E9]"
                >
                  Cancel
                </button>
              </div>

              {formError && (
                <div className="p-2.5 mb-3 bg-[#F87171]/20 border border-[#F87171]/40 text-[#F87171] text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Type Selector (if adding) */}
                {!editingId && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTxType('expense');
                        setCategory('Food');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        txType === 'expense'
                          ? 'bg-[#063F46] text-[#C5E86C] border-[#C5E86C]'
                          : 'bg-[#042c31]/40 text-[#D7ECE5]/60 border-transparent hover:text-[#D7ECE5]'
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTxType('income');
                        setCategory('Allowance / Stipend');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        txType === 'income'
                          ? 'bg-[#063F46] text-[#10B981] border-[#10B981]'
                          : 'bg-[#042c31]/40 text-[#D7ECE5]/60 border-transparent hover:text-[#D7ECE5]'
                      }`}
                    >
                      Income
                    </button>
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#063F46] border border-[#087985] rounded-xl px-3.5 py-2 text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                  />
                </div>

                {/* Category / Source */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                    {txType === 'income' ? 'Income Source *' : 'Expense Category *'}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#063F46] border border-[#087985] rounded-xl px-3.5 py-2 text-sm text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
                  >
                    {(txType === 'income' ? INCOME_SOURCES : EXPENSE_CATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#063F46] border border-[#087985] rounded-xl px-3.5 py-2 text-sm text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-[#D7ECE5]/80 mb-1">
                    Note / Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Short note (e.g. Metro pass recharge)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#063F46] border border-[#087985] rounded-xl px-3.5 py-2 text-sm text-[#F4F3E9] placeholder-[#D7ECE5]/30 focus:outline-none focus:border-[#C5E86C]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#D7ECE5]/70 hover:bg-[#063F46]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    {editingId ? 'Update Record' : 'Save Transaction'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-[#087985]/40 rounded-2xl bg-[#084850]/20">
              <p className="text-sm font-semibold text-[#D7ECE5]/70">No transactions recorded yet</p>
              <p className="text-xs text-[#D7ECE5]/50 mt-1">
                Click "+ Expense" or "+ Income" above to add your first record.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="bg-[#084850]/50 hover:bg-[#084850] border border-[#087985]/40 rounded-2xl p-4 flex items-center justify-between gap-3 transition-colors shadow-sm group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isIncome
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                            : 'bg-[#C5E86C]/20 text-[#C5E86C] border border-[#C5E86C]/30'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#F4F3E9] truncate">
                            {tx.category}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#063F46] text-[#D7ECE5]/60 border border-[#087985]/40">
                            {formatDate(tx.date)}
                          </span>
                        </div>
                        {tx.description && (
                          <p className="text-xs text-[#D7ECE5]/70 truncate mt-0.5">
                            {tx.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span
                          className={`text-sm font-extrabold tracking-tight ${
                            isIncome ? 'text-[#10B981]' : 'text-[#F4F3E9]'
                          }`}
                        >
                          {isIncome ? `+${formatINR(tx.amount)}` : `-${formatINR(tx.amount)}`}
                        </span>
                      </div>

                      {/* Edit / Delete actions */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(tx)}
                          title="Edit transaction"
                          className="p-1.5 rounded-lg text-[#D7ECE5]/60 hover:text-[#C5E86C] hover:bg-[#063F46]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(tx.id)}
                          title="Delete transaction"
                          className="p-1.5 rounded-lg text-[#D7ECE5]/60 hover:text-[#F87171] hover:bg-[#063F46]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
