import React from 'react';
import {
  Smile,
  Brain,
  HelpCircle,
  AlertCircle,
  HeartHandshake,
  Coffee,
  Sparkles
} from 'lucide-react';

const EXPRESSION_CONFIGS = {
  happy: {
    label: 'Feeling Great',
    badge: Smile,
    borderColor: 'border-[#B7D16A]',
    bgColor: 'bg-[#B7D16A]/20',
    iconColor: 'text-[#B7D16A]'
  },
  thinking: {
    label: 'Deep in Thought',
    badge: Brain,
    borderColor: 'border-[#38BDF8]',
    bgColor: 'bg-[#38BDF8]/20',
    iconColor: 'text-[#38BDF8]'
  },
  curious: {
    label: 'Ready to Explore',
    badge: HelpCircle,
    borderColor: 'border-[#C5E86C]',
    bgColor: 'bg-[#C5E86C]/20',
    iconColor: 'text-[#C5E86C]'
  },
  confused: {
    label: 'Puzzling Concept',
    badge: AlertCircle,
    borderColor: 'border-[#FB923C]',
    bgColor: 'bg-[#FB923C]/20',
    iconColor: 'text-[#FB923C]'
  },
  encouraging: {
    label: 'You Got This!',
    badge: HeartHandshake,
    borderColor: 'border-[#34D399]',
    bgColor: 'bg-[#34D399]/20',
    iconColor: 'text-[#34D399]'
  },
  relaxed: {
    label: 'Steady & Calm',
    badge: Coffee,
    borderColor: 'border-[#D7ECE5]',
    bgColor: 'bg-[#D7ECE5]/20',
    iconColor: 'text-[#D7ECE5]'
  },
  celebrating: {
    label: 'Milestone Unlocked!',
    badge: Sparkles,
    borderColor: 'border-[#FFD700]',
    bgColor: 'bg-[#FFD700]/20',
    iconColor: 'text-[#FFD700]'
  }
};

export default function MrLlamaMascot({
  expression = 'relaxed',
  size = 'md',
  speechBubble = null,
  showLabel = false,
  className = ''
}) {
  const config = EXPRESSION_CONFIGS[expression] || EXPRESSION_CONFIGS.relaxed;
  const BadgeIcon = config.badge;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  }[size] || 'w-14 h-14';

  const badgeSizes = {
    sm: 'w-4 h-4 p-0.5 -bottom-1 -right-1',
    md: 'w-5 h-5 p-1 -bottom-1 -right-1',
    lg: 'w-7 h-7 p-1.5 -bottom-1.5 -right-1.5',
    xl: 'w-9 h-9 p-2 -bottom-2 -right-2'
  }[size] || 'w-5 h-5 p-1 -bottom-1 -right-1';

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {speechBubble && (
        <div className="relative mb-2 px-3 py-1.5 bg-[#087985] text-[#F4F3E9] text-xs font-semibold rounded-xl shadow-lg border border-[#B7D16A]/30 max-w-[220px] text-center animate-fade-in">
          {speechBubble}
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#087985]" />
        </div>
      )}

      <div className={`relative ${sizeClasses} rounded-full p-1 bg-[#063F46] border-2 ${config.borderColor} shadow-md overflow-visible`}>
        <img
          src="/static/llama.png"
          alt="Mr. LLAMA"
          className="w-full h-full object-contain rounded-full bg-[#084850]"
        />
        <div className={`absolute ${badgeSizes} rounded-full ${config.bgColor} backdrop-blur-sm border border-[#063F46] flex items-center justify-center shadow`}>
          <BadgeIcon className={`w-full h-full ${config.iconColor}`} />
        </div>
      </div>

      {showLabel && (
        <span className="mt-1 text-[11px] font-medium tracking-wide text-[#D7ECE5]/80">
          {config.label}
        </span>
      )}
    </div>
  );
}
