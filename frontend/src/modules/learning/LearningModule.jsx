import React, { useState } from 'react';
import {
  Flame,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Star
} from 'lucide-react';
import { CURRICULUM_UNITS } from '../../data/initialData';
import CurvedPathway from './CurvedPathway';
import LessonModal from './LessonModal';
import MrLlamaMascot from '../../components/MrLlamaMascot';

export default function LearningModule({
  userStats,
  onUpdateUserStats
}) {
  const [selectedUnitId, setSelectedUnitId] = useState('unit-1');
  const [activeLesson, setActiveLesson] = useState(null);

  const completedLessons = userStats.completedLessons || [];

  const activeUnit =
    CURRICULUM_UNITS.find((u) => u.id === selectedUnitId) || CURRICULUM_UNITS[0];

  const handleCompleteLesson = (lessonId) => {
    // Check if newly completed
    const isNew = !completedLessons.includes(lessonId);
    let newCompleted = completedLessons;
    let newXP = userStats.xp || 0;

    if (isNew) {
      newCompleted = [...completedLessons, lessonId];
      newXP += 20; // +20 XP rule per spec
    }

    // Check if active unit is now fully mastered
    const allUnitLessons = activeUnit.lessons.map((l) => l.id);
    const isUnitMastered = allUnitLessons.every((id) => newCompleted.includes(id));
    let newMasteredUnits = userStats.masteredUnits || [];
    if (isUnitMastered && !newMasteredUnits.includes(activeUnit.id)) {
      newMasteredUnits = [...newMasteredUnits, activeUnit.id];
    }

    onUpdateUserStats({
      ...userStats,
      completedLessons: newCompleted,
      xp: newXP,
      masteredUnits: newMasteredUnits
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Learning Gamification Stats Banner */}
      <div className="bg-[#084850]/70 rounded-3xl p-6 sm:p-8 border border-[#087985]/50 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD700] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D7ECE5]/70">
              Interactive Financial Curriculum
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F3E9] tracking-tight">
            Learning Pathway
          </h2>
          <p className="text-xs text-[#D7ECE5]/70 mt-1 max-w-xl">
            Short, gamified lessons with real-world scenarios, case studies, and mini calculations.
            Earn XP and unlock Golden Mastery nodes.
          </p>
        </div>

        {/* User Badges: XP, Streak, Mastered Units */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#063F46] border border-[#FFD700]/40 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#FFD700]" />
            <div>
              <span className="text-[10px] text-[#D7ECE5]/60 font-semibold block uppercase tracking-wider">
                Experience
              </span>
              <span className="text-base font-extrabold text-[#FFD700]">
                {userStats.xp || 0} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#063F46] border border-[#FB923C]/40 shadow-sm">
            <Flame className="w-5 h-5 text-[#FB923C]" />
            <div>
              <span className="text-[10px] text-[#D7ECE5]/60 font-semibold block uppercase tracking-wider">
                Daily Streak
              </span>
              <span className="text-base font-extrabold text-[#FB923C]">
                {userStats.streak || 1} Days
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#063F46] border border-[#C5E86C]/40 shadow-sm">
            <Award className="w-5 h-5 text-[#C5E86C]" />
            <div>
              <span className="text-[10px] text-[#D7ECE5]/60 font-semibold block uppercase tracking-wider">
                Units Mastered
              </span>
              <span className="text-base font-extrabold text-[#C5E86C]">
                {(userStats.masteredUnits || []).length} / 2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Selector Cards (Exactly 2 Units as specified) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CURRICULUM_UNITS.map((unit) => {
          const totalLessons = unit.lessons.length;
          const completedCount = unit.lessons.filter((l) =>
            completedLessons.includes(l.id)
          ).length;
          const pct = Math.round((completedCount / totalLessons) * 100);
          const isSelected = unit.id === selectedUnitId;
          const isMastered = completedCount === totalLessons;

          return (
            <div
              key={unit.id}
              onClick={() => setSelectedUnitId(unit.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#084850] border-[#C5E86C] shadow-xl ring-1 ring-[#C5E86C]/40'
                  : 'bg-[#084850]/40 hover:bg-[#084850]/70 border-[#087985]/40 text-[#D7ECE5]/80'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-[#C5E86C]">
                      {unit.id === 'unit-1' ? 'Unit 1' : 'Unit 2'}
                    </span>
                    {isMastered && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> Mastered
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#F4F3E9] mt-0.5">
                    {unit.title.split(': ')[1] || unit.title}
                  </h3>
                  <p className="text-xs text-[#D7ECE5]/70 mt-1 max-w-sm line-clamp-2">
                    {unit.description}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-extrabold text-[#F4F3E9]">
                    {completedCount} / {totalLessons}
                  </span>
                  <span className="text-[10px] text-[#D7ECE5]/60 block">Lessons</span>
                </div>
              </div>

              {/* Unit Progress Bar */}
              <div className="w-full bg-[#063F46] h-2 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isMastered ? 'bg-[#FFD700]' : 'bg-[#C5E86C]'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#D7ECE5]/60 mt-2">
                <span>{pct}% Completed</span>
                <span className="text-[#C5E86C] font-semibold flex items-center gap-1">
                  {isSelected ? 'Currently Viewing' : 'Switch to Unit →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vertical Curved Learning Pathway Container */}
      <div className="bg-[#084850]/50 rounded-3xl border border-[#087985]/40 p-6 sm:p-8 shadow-inner relative">
        <div className="text-center max-w-md mx-auto mb-6">
          <h3 className="text-lg font-extrabold text-[#F4F3E9]">
            {activeUnit.title}
          </h3>
          <p className="text-xs text-[#D7ECE5]/70 mt-1">
            Tap an active node to launch your interactive lesson.
          </p>
        </div>

        <CurvedPathway
          unit={activeUnit}
          completedLessons={completedLessons}
          onSelectLesson={(lesson) => setActiveLesson(lesson)}
        />
      </div>

      {/* Lesson Interactive Modal */}
      {activeLesson && (
        <LessonModal
          isOpen={Boolean(activeLesson)}
          onClose={() => setActiveLesson(null)}
          lesson={activeLesson}
          unitTitle={activeUnit.title}
          isAlreadyCompleted={completedLessons.includes(activeLesson.id)}
          onCompleteLesson={handleCompleteLesson}
        />
      )}
    </div>
  );
}
