import React, { useState } from 'react';
import { X, ShoppingCart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function BuyModal({
  isOpen,
  onClose,
  stock,
  virtualCash,
  onConfirmBuy
}) {
  const [shares, setShares] = useState(1);
  const [error, setError] = useState('');

  if (!isOpen || !stock) return null;

  const totalCost = shares * stock.price;
  const canAfford = totalCost <= virtualCash;

  const handleBuy = (e) => {
    e.preventDefault();
    setError('');

    const qty = parseInt(shares, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter at least 1 share.');
      return;
    }
    if (qty * stock.price > virtualCash) {
      setError('Insufficient virtual cash to complete this purchase.');
      return;
    }

    onConfirmBuy(stock, qty, stock.price);
    onClose();
  };

  const handleMax = () => {
    const maxQty = Math.floor(virtualCash / stock.price);
    setShares(Math.max(1, maxQty));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#063F46] border border-[#087985] rounded-3xl p-6 shadow-2xl relative text-[#F4F3E9]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#087985]/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#C5E86C]/20 text-[#C5E86C]">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#F4F3E9]">Buy {stock.name}</h3>
              <p className="text-[11px] text-[#D7ECE5]/60 font-mono">
                {stock.symbol} • Virtual Order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#D7ECE5]/60 hover:text-[#C5E86C] hover:bg-[#084850]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-[#F87171]/20 border border-[#F87171]/40 rounded-xl text-xs text-[#F87171] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleBuy} className="space-y-4">
          {/* Price & Balance Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#084850]/50 rounded-xl border border-[#087985]/30 text-xs">
            <div>
              <span className="text-[#D7ECE5]/60 block">Simulated Price</span>
              <span className="font-extrabold text-[#F4F3E9] text-sm">
                {formatINR(stock.price)}
              </span>
            </div>
            <div>
              <span className="text-[#D7ECE5]/60 block">Available Virtual Cash</span>
              <span className="font-extrabold text-[#C5E86C] text-sm">
                {formatINR(virtualCash)}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#D7ECE5]/80 mb-1.5">
              <label>Number of Shares</label>
              <button
                type="button"
                onClick={handleMax}
                className="text-[11px] font-bold text-[#C5E86C] hover:underline"
              >
                Max Affordable
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                required
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-[#042c31] border border-[#087985] rounded-xl px-4 py-2.5 text-base font-extrabold text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
              />
            </div>
          </div>

          {/* Total Cost Calculation */}
          <div className="p-4 rounded-xl bg-[#042c31] border border-[#087985]/40 flex items-center justify-between">
            <span className="text-xs text-[#D7ECE5]/70 font-medium">Total Virtual Cost</span>
            <span
              className={`text-lg font-extrabold tracking-tight ${
                canAfford ? 'text-[#C5E86C]' : 'text-[#F87171]'
              }`}
            >
              {formatINR(totalCost)}
            </span>
          </div>

          {!canAfford && (
            <p className="text-[11px] text-[#F87171] text-center font-medium">
              Order exceeds available cash by {formatINR(totalCost - virtualCash)}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#D7ECE5]/70 hover:bg-[#084850]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canAfford}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                canAfford
                  ? 'bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46]'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
