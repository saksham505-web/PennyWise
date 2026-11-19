import React, { useState } from 'react';
import { X, TrendingDown, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function SellModal({
  isOpen,
  onClose,
  stock,
  ownedShares,
  onConfirmSell
}) {
  const [sharesToSell, setSharesToSell] = useState(1);
  const [error, setError] = useState('');

  if (!isOpen || !stock) return null;

  const totalPayout = sharesToSell * stock.price;
  const canSell = ownedShares > 0 && sharesToSell <= ownedShares;

  const handleSell = (e) => {
    e.preventDefault();
    setError('');

    const qty = parseInt(sharesToSell, 10);
    if (isNaN(qty) || qty <= 0) {
      setError('Please enter at least 1 share.');
      return;
    }
    if (qty > ownedShares) {
      setError(`You only own ${ownedShares} shares.`);
      return;
    }

    onConfirmSell(stock, qty, stock.price);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#063F46] border border-[#087985] rounded-3xl p-6 shadow-2xl relative text-[#F4F3E9]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#087985]/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#F87171]/20 text-[#F87171]">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#F4F3E9]">Sell {stock.name}</h3>
              <p className="text-[11px] text-[#D7ECE5]/60 font-mono">
                {stock.symbol} • Holdings: {ownedShares} shares
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

        <form onSubmit={handleSell} className="space-y-4">
          {/* Price & Holdings Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#084850]/50 rounded-xl border border-[#087985]/30 text-xs">
            <div>
              <span className="text-[#D7ECE5]/60 block">Current Price</span>
              <span className="font-extrabold text-[#F4F3E9] text-sm">
                {formatINR(stock.price)}
              </span>
            </div>
            <div>
              <span className="text-[#D7ECE5]/60 block">Owned in Portfolio</span>
              <span className="font-extrabold text-[#C5E86C] text-sm">
                {ownedShares} shares
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#D7ECE5]/80 mb-1.5">
              <label>Shares to Sell</label>
              <button
                type="button"
                onClick={() => setSharesToSell(ownedShares)}
                className="text-[11px] font-bold text-[#C5E86C] hover:underline"
              >
                Sell All ({ownedShares})
              </button>
            </div>
            <input
              type="number"
              min="1"
              max={ownedShares}
              step="1"
              required
              value={sharesToSell}
              onChange={(e) => setSharesToSell(Math.min(ownedShares, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-[#042c31] border border-[#087985] rounded-xl px-4 py-2.5 text-base font-extrabold text-[#F4F3E9] focus:outline-none focus:border-[#C5E86C]"
            />
          </div>

          {/* Estimated Payout */}
          <div className="p-4 rounded-xl bg-[#042c31] border border-[#087985]/40 flex items-center justify-between">
            <span className="text-xs text-[#D7ECE5]/70 font-medium">Estimated Virtual Payout</span>
            <span className="text-lg font-extrabold tracking-tight text-[#10B981]">
              +{formatINR(totalPayout)}
            </span>
          </div>

          {ownedShares === 0 && (
            <p className="text-[11px] text-[#F87171] text-center font-medium">
              You do not currently own any shares of {stock.name}.
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
              disabled={!canSell}
              className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                canSell
                  ? 'bg-[#F87171] hover:bg-[#EF4444] text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Confirm Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
