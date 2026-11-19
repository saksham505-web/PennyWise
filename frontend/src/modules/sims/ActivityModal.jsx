import React from 'react';
import { X, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatINR, formatDate } from '../../utils/formatters';

export default function ActivityModal({
  isOpen,
  onClose,
  activities
}) {
  if (!isOpen) return null;

  const list = activities || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-[#063F46] border border-[#087985] rounded-3xl shadow-2xl p-6 relative text-[#F4F3E9] max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#087985]/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#087985] text-[#B7D16A]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#F4F3E9]">Simulation Activity Log</h3>
              <p className="text-xs text-[#D7ECE5]/60">Chronological history of virtual executions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#D7ECE5]/60 hover:text-[#C5E86C] hover:bg-[#084850]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {list.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-[#087985]/40 rounded-2xl">
              <p className="text-xs text-[#D7ECE5]/70">No simulated transactions yet.</p>
              <p className="text-[11px] text-[#D7ECE5]/50 mt-1">
                Completed orders and SIP installments will appear here chronologically.
              </p>
            </div>
          ) : (
            list.map((act) => {
              const isBuy = act.type === 'BUY';
              return (
                <div
                  key={act.id}
                  className="p-3.5 rounded-xl bg-[#084850]/40 border border-[#087985]/30 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isBuy
                          ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-[#F87171]/20 text-[#F87171]'
                      }`}
                    >
                      {isBuy ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#F4F3E9]">{act.name}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            isBuy ? 'text-[#10B981] bg-[#10B981]/10' : 'text-[#F87171] bg-[#F87171]/10'
                          }`}
                        >
                          {act.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#D7ECE5]/60 mt-0.5">
                        {act.shares} shares @ {formatINR(act.price)} • {formatDate(act.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#F4F3E9] block">
                      {formatINR(act.totalValue)}
                    </span>
                    <span className="text-[10px] text-[#D7ECE5]/50">Virtual Total</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
