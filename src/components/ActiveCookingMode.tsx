import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Flame, 
  ChefHat, 
  Volume2, 
  VolumeX,
  Lightbulb
} from 'lucide-react';
import { Recipe } from '../types';
import { playTimerFinishBeep, playPillClickSound } from '../utils/audio';

interface ActiveCookingModeProps {
  recipe: Recipe;
  servings: number;
  onExit: () => void;
  onCompleteDish: (rescuedIngredientNames: string[]) => void;
}

export const ActiveCookingMode: React.FC<ActiveCookingModeProps> = ({
  recipe,
  servings,
  onExit,
  onCompleteDish,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const step = recipe.steps[currentStepIndex];
  const totalSteps = recipe.steps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Initialize timer whenever step changes
  useEffect(() => {
    if (step.timerMinutes) {
      setTimerSecondsLeft(step.timerMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimerSecondsLeft(0);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, step]);

  // Countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (soundEnabled) {
              playTimerFinishBeep();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecondsLeft, soundEnabled]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleNext = () => {
    playPillClickSound();
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
      if (soundEnabled) playTimerFinishBeep();
    }
  };

  const handlePrev = () => {
    playPillClickSound();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleResetTimer = () => {
    if (step.timerMinutes) {
      setTimerSecondsLeft(step.timerMinutes * 60);
      setIsTimerRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FBF9F5] flex flex-col justify-between animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <header className="px-4 py-3 sm:px-6 bg-white border-b border-[#EAE8E4] flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="w-10 h-10 rounded-full border border-[#EAE8E4] hover:bg-[#F5F3EF] flex items-center justify-center text-[#414943] transition-colors cursor-pointer"
            title="Exit cooking mode"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[11px] font-bold text-[#E05A36] uppercase tracking-wider flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Active Kitchen Flow</span>
            </div>
            <h2 className="font-editorial text-sm sm:text-base font-bold text-[#1B1C1A] truncate max-w-xs sm:max-w-md">
              {recipe.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 rounded-full border border-[#EAE8E4] flex items-center justify-center text-[#717973] hover:text-[#1B1C1A] cursor-pointer"
            title={soundEnabled ? "Mute timers" : "Unmute timers"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#2E5A44]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Servings badge */}
          <span className="text-xs font-semibold bg-[#F5F3EF] px-2.5 py-1 rounded-full text-[#414943]">
            {servings} servings
          </span>
        </div>
      </header>

      {/* Progress Line */}
      <div className="w-full bg-[#EAE8E4] h-1.5">
        <div 
          className="bg-[#2E5A44] h-1.5 transition-all duration-300 rounded-r-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Center Cooking Workspace */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 overflow-y-auto flex flex-col justify-center space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2E5A44] bg-[#E7F4EB] px-3 py-1 rounded-full">
            Step {step.stepNumber} of {totalSteps}
          </span>
          <span className="text-xs font-semibold text-[#717973]">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Big Editorial Step Title */}
        <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B1C1A] leading-tight">
          {step.title}
        </h1>

        {/* High-legibility instruction text */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE8E4] shadow-xs space-y-4">
          <p className="text-base sm:text-lg text-[#1B1C1A] leading-relaxed font-normal">
            {step.instruction}
          </p>

          {/* Chef Tip if available */}
          {step.tip && (
            <div className="bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-2xl p-3.5 flex items-start gap-2.5">
              <Lightbulb className="w-5 h-5 text-[#C36800] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#78350F] leading-snug">
                <span className="font-bold">Chef's Note: </span>
                {step.tip}
              </div>
            </div>
          )}
        </div>

        {/* Live Step Timer Card (if this step has a timer) */}
        {step.timerMinutes && (
          <div className="bg-[#FAF9F6] border border-[#EAE8E4] rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                timerSecondsLeft === 0 
                  ? 'bg-[#E7F4EB] text-[#2D7A4F]' 
                  : isTimerRunning 
                    ? 'bg-[#FD6F49] text-white animate-pulse' 
                    : 'bg-white text-[#2E5A44] border border-[#EAE8E4]'
              }`}>
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#717973] uppercase tracking-wider">
                  Cooking Countdown
                </div>
                <div className="font-editorial text-3xl font-bold text-[#1B1C1A] tracking-tight">
                  {formatTime(timerSecondsLeft)}
                </div>
              </div>
            </div>

            {/* Timer Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                  isTimerRunning
                    ? 'bg-[#FEF3C7] text-[#C36800] border border-[#FDE68A]'
                    : 'bg-[#2E5A44] hover:bg-[#15422E] text-white'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{timerSecondsLeft === 0 ? 'Restart' : 'Start Timer'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-xl border border-[#C1C9C1] hover:bg-white text-[#717973] transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Floating Step Navigation Buttons */}
      <footer className="p-4 sm:p-6 bg-white border-t border-[#EAE8E4]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex-1 py-3.5 px-4 rounded-2xl border border-[#C1C9C1] text-xs sm:text-sm font-semibold text-[#414943] hover:bg-[#F5F3EF] disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#E05A36] hover:bg-[#AB3513] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Finish Dish' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* Dish Completed Celebration Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 border border-[#EAE8E4] shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="w-20 h-20 rounded-full bg-[#E7F4EB] text-[#2D7A4F] flex items-center justify-center mx-auto ring-8 ring-[#BDEED0]/40">
              <Sparkles className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#E05A36] uppercase tracking-wider">
                Bon Appétit!
              </span>
              <h3 className="font-editorial text-2xl font-bold text-[#1B1C1A]">
                You Created {recipe.title}
              </h3>
              <p className="text-xs text-[#717973] max-w-xs mx-auto">
                Delicious food prepared, zero ingredients wasted. Your conscious cooking made an impact!
              </p>
            </div>

            {/* Rescued Stats */}
            <div className="bg-[#FBF9F5] rounded-2xl p-4 border border-[#EAE8E4] space-y-2 text-left">
              <div className="text-xs font-bold text-[#1B1C1A] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2D7A4F]" />
                <span>Ingredients Rescued from Waste:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recipe.expiringIngredientsUsed.length > 0 ? (
                  recipe.expiringIngredientsUsed.map(name => (
                    <span key={name} className="text-[11px] font-semibold bg-[#E7F4EB] text-[#15422E] px-2.5 py-0.5 rounded-full">
                      ✓ {name}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-[#717973]">
                    Whole meal cooked with fresh pantry staples!
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                onCompleteDish(recipe.expiringIngredientsUsed);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-[#2E5A44] hover:bg-[#15422E] text-white text-sm font-bold transition-all shadow-md cursor-pointer"
            >
              Update Pantry & Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
