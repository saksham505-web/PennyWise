import React from 'react';
import { Check, Lock, Play, Star, Sparkles, BookOpen } from 'lucide-react';

export default function CurvedPathway({
  unit,
  completedLessons,
  onSelectLesson
}) {
  const lessons = unit.lessons || [];

  // Determine lesson states
  // A lesson is unlocked if it's the first lesson in the unit OR if the previous lesson was completed.
  const lessonStates = lessons.map((lesson, idx) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const isFirst = idx === 0;
    const prevCompleted = idx > 0 && completedLessons.includes(lessons[idx - 1].id);
    const isUnlocked = isFirst || prevCompleted;
    const isCurrent = isUnlocked && !isCompleted;

    // Horizontal offset pattern to create natural curve: center -> left -> right -> center -> left -> ...
    const offsetPattern = [0, -70, 70, -50, 50, -60, 60, -40, 40];
    const offset = offsetPattern[idx % offsetPattern.length];

    return {
      ...lesson,
      index: idx,
      isCompleted,
      isUnlocked,
      isCurrent,
      offset
    };
  });

  return (
    <div className="relative py-12 px-4 max-w-lg mx-auto flex flex-col items-center">
      
      {/* Curved SVG track running behind all nodes */}
      <svg
        className="absolute top-16 bottom-16 left-0 right-0 w-full h-[calc(100%-8rem)] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#087985" />
            <stop offset="50%" stopColor="#C5E86C" />
            <stop offset="100%" stopColor="#B7D16A" />
          </linearGradient>
        </defs>
        {lessonStates.map((node, i) => {
          if (i === lessonStates.length - 1) return null;
          const next = lessonStates[i + 1];

          // Approximate vertical coordinates for connection
          const y1 = 40 + i * 110;
          const y2 = 40 + (i + 1) * 110;
          const x1 = `calc(50% + ${node.offset}px)`;
          const x2 = `calc(50% + ${next.offset}px)`;

          return (
            <line
              key={`line-${node.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={node.isCompleted ? '#FFD700' : '#087985'}
              strokeWidth={node.isCompleted ? '4' : '3'}
              strokeDasharray={node.isCompleted ? 'none' : '6 6'}
              opacity={node.isUnlocked ? 0.9 : 0.3}
            />
          );
        })}
      </svg>

      {/* Nodes Stack */}
      <div className="space-y-12 w-full flex flex-col items-center relative z-10">
        {lessonStates.map((node) => {
          return (
            <div
              key={node.id}
              className="flex flex-col items-center transition-transform"
              style={{
                transform: `translateX(${node.offset}px)`
              }}
            >
              {/* Interactive Node Button */}
              <div className="relative group">
                
                {/* Active Glow Ring */}
                {node.isCurrent && (
                  <div className="absolute -inset-2 rounded-full bg-[#C5E86C]/30 animate-ping pointer-events-none" />
                )}

                <button
                  type="button"
                  disabled={!node.isUnlocked}
                  onClick={() => onSelectLesson(node)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-extrabold shadow-xl border-4 transition-all duration-200 ${
                    node.isCompleted
                      ? 'bg-gradient-to-tr from-[#E6B800] via-[#FFD700] to-[#FFF099] border-[#B8860B] text-[#063F46] hover:scale-110 shadow-[#FFD700]/30'
                      : node.isCurrent
                      ? 'bg-[#C5E86C] hover:bg-[#B7D16A] border-[#087985] text-[#063F46] hover:scale-110 shadow-[#C5E86C]/40 animate-bounce'
                      : 'bg-[#042c31] border-[#087985]/40 text-[#D7ECE5]/30 cursor-not-allowed opacity-60'
                  }`}
                >
                  {node.isCompleted ? (
                    <Star className="w-7 h-7 fill-current text-[#7A5800]" />
                  ) : node.isCurrent ? (
                    <Play className="w-6 h-6 fill-current" />
                  ) : (
                    <Lock className="w-5 h-5 text-[#D7ECE5]/40" />
                  )}
                </button>

                {/* Node Status Badge */}
                {node.isCompleted && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-[#063F46] flex items-center justify-center text-[#063F46]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Node Title & Description */}
              <div className="mt-2 text-center max-w-[150px]">
                <span
                  className={`text-xs font-bold block leading-tight ${
                    node.isCompleted
                      ? 'text-[#FFD700]'
                      : node.isCurrent
                      ? 'text-[#C5E86C]'
                      : 'text-[#D7ECE5]/50'
                  }`}
                >
                  {node.title}
                </span>
                <span className="text-[10px] text-[#D7ECE5]/60 block mt-0.5">
                  {node.isCompleted ? 'Mastered (+20 XP)' : node.isCurrent ? 'Ready to Learn' : 'Locked'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
