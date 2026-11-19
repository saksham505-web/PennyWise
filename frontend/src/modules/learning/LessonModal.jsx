import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Sliders,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import MrLlamaMascot from '../../components/MrLlamaMascot';

export default function LessonModal({
  isOpen,
  onClose,
  lesson,
  unitTitle,
  isAlreadyCompleted,
  onCompleteLesson
}) {
  const [step, setStep] = useState('learn'); // 'learn' | 'activity' | 'feedback' | 'success'
  const [selectedOption, setSelectedOption] = useState(null);
  const [sliderValue, setSliderValue] = useState(30); // for slider activity
  const [feedbackCorrect, setFeedbackCorrect] = useState(null);

  if (!isOpen || !lesson) return null;

  const handleSelectOption = (idx) => {
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    let isCorrect = false;
    if (lesson.activityType === 'slider') {
      // 50/30/20 slider: wants is 30%
      isCorrect = selectedOption === lesson.correctIndex;
    } else {
      isCorrect = selectedOption === lesson.correctIndex;
    }

    setFeedbackCorrect(isCorrect);
    setStep('feedback');

    if (isCorrect) {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  const handleFinish = () => {
    onCompleteLesson(lesson.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-[#063F46] border border-[#087985] rounded-3xl shadow-2xl overflow-hidden relative text-[#F4F3E9] max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="p-5 border-b border-[#087985]/40 flex items-center justify-between bg-[#042c31]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5E86C]">
              {unitTitle}
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-[#F4F3E9] mt-0.5">
              {lesson.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#D7ECE5]/60 hover:text-[#C5E86C] hover:bg-[#084850]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* STEP 1: LEARN (Dialogue & Concept Explanation) */}
          {step === 'learn' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Dialogue Bubbles */}
              {lesson.dialogue && lesson.dialogue.length > 0 && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#084850]/40 border border-[#087985]/30">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#D7ECE5]/60 flex items-center gap-1.5 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#C5E86C]" />
                    <span>Everyday Conversation</span>
                  </div>
                  {lesson.dialogue.map((item, idx) => {
                    const isMascot = item.speaker === 'Mr. LLAMA';
                    return (
                      <div
                        key={idx}
                        className={`flex gap-3 items-start ${
                          isMascot ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {isMascot ? (
                          <MrLlamaMascot expression="thinking" size="sm" className="flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#087985] text-[#C5E86C] font-bold text-xs flex items-center justify-center flex-shrink-0">
                            {item.speaker[0]}
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                            isMascot
                              ? 'bg-[#087985] text-[#F4F3E9] border border-[#C5E86C]/30'
                              : 'bg-[#063F46] text-[#D7ECE5] border border-[#087985]/40'
                          }`}
                        >
                          <span className="block font-bold text-[10px] text-[#C5E86C] mb-0.5">
                            {item.speaker}
                          </span>
                          {item.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Core Concept */}
              <div className="p-4 rounded-2xl bg-[#084850]/60 border border-[#087985]/40 space-y-2">
                <div className="text-xs font-bold text-[#C5E86C] uppercase tracking-wider">
                  The Core Concept
                </div>
                <p className="text-xs sm:text-sm text-[#F4F3E9] leading-relaxed">
                  {lesson.concept}
                </p>
              </div>

              {/* Practical Everyday Example */}
              {lesson.example && (
                <div className="p-4 rounded-2xl bg-[#063F46] border border-[#B7D16A]/30 space-y-1.5">
                  <span className="text-[11px] font-bold text-[#B7D16A] uppercase tracking-wider block">
                    Practical Rupee Example
                  </span>
                  <p className="text-xs text-[#D7ECE5] leading-relaxed">
                    {lesson.example}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: ACTIVITY / QUESTION */}
          {step === 'activity' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-[#084850]/50 border border-[#087985]/30">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5E86C] block mb-1">
                  Check Your Understanding
                </span>
                <p className="text-sm font-bold text-[#F4F3E9] leading-relaxed">
                  {lesson.question}
                </p>
              </div>

              {/* MCQ Options */}
              <div className="space-y-2.5">
                {lesson.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#087985] text-[#F4F3E9] border-[#C5E86C] shadow-md ring-1 ring-[#C5E86C]'
                          : 'bg-[#084850]/40 hover:bg-[#084850] text-[#D7ECE5] border-[#087985]/30'
                      }`}
                    >
                      <span className="leading-snug">{opt}</span>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                          isSelected
                            ? 'border-[#C5E86C] bg-[#C5E86C] text-[#063F46]'
                            : 'border-[#087985] text-[#D7ECE5]/60'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FEEDBACK */}
          {step === 'feedback' && (
            <div className="space-y-5 animate-fade-in text-center py-4">
              <MrLlamaMascot
                expression={feedbackCorrect ? 'celebrating' : 'encouraging'}
                size="lg"
                className="mx-auto"
              />

              <div
                className={`p-4 rounded-2xl border ${
                  feedbackCorrect
                    ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                    : 'bg-[#FB923C]/15 border-[#FB923C]/40 text-[#FB923C]'
                }`}
              >
                <div className="flex items-center justify-center gap-2 font-extrabold text-base mb-1">
                  {feedbackCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Brilliant! That's Correct!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      <span>Not quite, but good effort!</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-[#D7ECE5] mt-2 leading-relaxed">
                  {lesson.explanation}
                </p>
              </div>

              {feedbackCorrect && !isAlreadyCompleted && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#084850] border border-[#C5E86C]/40 text-xs font-bold text-[#C5E86C]">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span>+20 XP Awarded! Golden Node Unlocked!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#087985]/40 bg-[#042c31] flex items-center justify-between">
          <div className="text-xs text-[#D7ECE5]/60">
            {step === 'learn' && 'Step 1 of 2: Concept'}
            {step === 'activity' && 'Step 2 of 2: Practice'}
            {step === 'feedback' && 'Evaluation'}
          </div>

          <div className="flex items-center gap-2">
            {step === 'learn' && (
              <button
                onClick={() => setStep('activity')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
              >
                <span>Try Activity</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'activity' && (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md ${
                  selectedOption !== null
                    ? 'bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46]'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Check Answer</span>
              </button>
            )}

            {step === 'feedback' && (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#C5E86C] hover:bg-[#B7D16A] text-[#063F46] font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-transform hover:-translate-y-0.5"
              >
                <Award className="w-4 h-4" />
                <span>Complete Lesson</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
