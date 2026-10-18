import React, { useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { SOCIAL_STORIES_BACKUP, SocialStory } from "./socialStoriesBackup";

interface SocialStoriesComponentProps {
  onVibrate?: (ms: number | number[]) => void;
}

export const SocialStoriesComponent: React.FC<SocialStoriesComponentProps> = ({ onVibrate }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showStorySelector, setShowStorySelector] = useState<boolean>(false);

  const triggerVibrate = (ms: number | number[]) => {
    if (onVibrate) onVibrate(ms);
    else if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch {}
    }
  };

  const story: SocialStory = SOCIAL_STORIES_BACKUP[currentStoryIndex];

  return (
    <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between min-h-[340px]">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-pink-300">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-bold text-base text-[#f4f4f5]">Histórias Sociais para Previsibilidade</h3>
        </div>
        <p className="text-xs text-[#a1a1aa] leading-relaxed">
          Prepare-se mentalmente para transições complexas e quebras de rotina passo a passo, sem pressa.
        </p>
      </div>

      {/* Seletor de Histórias por Botão e Lista */}
      <div className="relative my-2">
        <button
          onClick={() => {
            setShowStorySelector(!showStorySelector);
            triggerVibrate(30);
          }}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border border-[#3f3f46] rounded-lg text-xs md:text-sm text-[#f4f4f5] font-semibold hover:bg-slate-900 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>📖</span>
            <span>{story.title}</span>
          </span>
          <span className={`transition-transform duration-200 text-[#2dd4bf] ${showStorySelector ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {/* Lista Dropdown de Opções */}
        {showStorySelector && (
          <div className="absolute left-0 right-0 mt-1 bg-[#18181b] border border-[#3f3f46] rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto p-1.5 space-y-1">
            {SOCIAL_STORIES_BACKUP.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentStoryIndex(idx);
                  setCurrentStepIndex(0);
                  setShowStorySelector(false);
                  triggerVibrate(40);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-md text-xs md:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                  currentStoryIndex === idx
                    ? "bg-pink-500/10 border border-pink-500/20 text-pink-300"
                    : "hover:bg-zinc-800 text-[#a1a1aa] border border-transparent"
                }`}
              >
                <span>{s.title}</span>
                {currentStoryIndex === idx && (
                  <span className="text-pink-400 text-[10px] font-bold uppercase tracking-wider bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20">
                    Ativo
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Corpo do Slide Ativo */}
      <div className="bg-slate-950 p-4 rounded-lg border border-zinc-800 my-4 min-h-[110px] flex items-center gap-4 relative">
        <div className="text-3xl select-none" aria-hidden="true">
          {story.steps[currentStepIndex].emoji}
        </div>
        <div className="space-y-1 flex-1">
          <div className="text-[10px] text-zinc-500 tracking-wider uppercase font-mono">
            Passo {currentStepIndex + 1} de {story.steps.length}
          </div>
          <p className="text-xs md:text-sm text-[#d4d4d8] leading-relaxed font-medium">
            {story.steps[currentStepIndex].text}
          </p>
        </div>
      </div>

      {/* Controles de navegação manual do carrossel */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            if (currentStepIndex > 0) {
              setCurrentStepIndex(c => c - 1);
              triggerVibrate(30);
            }
          }}
          disabled={currentStepIndex === 0}
          className="p-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded border border-zinc-700 disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5 justify-center items-center">
          {story.steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStepIndex(idx);
                triggerVibrate(30);
              }}
              className={`w-8 h-5 flex items-center justify-center rounded-full text-[10px] font-bold transition-all border cursor-pointer shrink-0 ${
                idx === currentStepIndex
                  ? "bg-pink-400 border-pink-400 text-zinc-950"
                  : "bg-[#27272a] border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
              aria-label={`Ir para o passo ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            if (currentStepIndex < story.steps.length - 1) {
              setCurrentStepIndex(c => c + 1);
              triggerVibrate(30);
            }
          }}
          disabled={currentStepIndex === story.steps.length - 1}
          className="p-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 rounded border border-zinc-700 disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SocialStoriesComponent;
