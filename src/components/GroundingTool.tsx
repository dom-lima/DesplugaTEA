import React, { useState, useEffect } from "react";
import { 
  Anchor, 
  Eye, 
  Hand, 
  Ear, 
  Sparkles, 
  Check, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Layers, 
  Smile,
  Heart
} from "lucide-react";

interface GroundingStepData {
  stepNumber: number;
  count: number;
  sense: string;
  emoji: string;
  title: string;
  actionText: string;
  examples: string[];
  tip: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    accent: string;
    activeRing: string;
  };
}

const GROUNDING_STEPS: GroundingStepData[] = [
  {
    stepNumber: 1,
    count: 5,
    sense: "VER",
    emoji: "👁️",
    title: "5 Coisas para VER",
    actionText: "Olhe ao seu redor e identifique cinco objetos no ambiente.",
    examples: [
      "Uma cadeira ou móvel próximo",
      "Uma caneta ou objeto de trabalho",
      "Um quadro ou detalhe na parede",
      "Uma lâmpada ou ponto de luz suave",
      "Uma planta, janela ou detalhe no chão"
    ],
    tip: "Perceba as cores, as formas e como a luz reflete neles. Não precisa ter pressa.",
    colorScheme: {
      bg: "bg-sky-950/20",
      border: "border-sky-500/30",
      text: "text-sky-300",
      badge: "bg-sky-500/20 text-sky-200 border-sky-400/30",
      accent: "bg-sky-500",
      activeRing: "ring-sky-400"
    }
  },
  {
    stepNumber: 2,
    count: 4,
    sense: "TOCAR",
    emoji: "🖐️",
    title: "4 Coisas para TOCAR",
    actionText: "Sinta a textura e temperatura de quatro coisas diferentes ao seu alcance.",
    examples: [
      "O tecido macio da sua roupa",
      "A superfície lisa, firme ou fria da mesa",
      "A sola firme dos seus pés apoiada no chão",
      "A brisa suave ou a temperatura do ar na pele"
    ],
    tip: "Foque na sensação táctil física: é quente, frio, áspero, macio ou firme?",
    colorScheme: {
      bg: "bg-emerald-950/20",
      border: "border-emerald-500/30",
      text: "text-emerald-300",
      badge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
      accent: "bg-emerald-500",
      activeRing: "ring-emerald-400"
    }
  },
  {
    stepNumber: 3,
    count: 3,
    sense: "OUVIR",
    emoji: "👂",
    title: "3 Coisas para OUVIR",
    actionText: "Feche os olhos ou repouse o olhar e identifique três sons ou ruídos no ambiente.",
    examples: [
      "O som sutil do trânsito distante",
      "O sussurro do ar-condicionado ou vento lá fora",
      "O ritmo natural da sua própria respiração"
    ],
    tip: "Perceba os sons que costumam passar despercebidos. Deixe os sons virem até você.",
    colorScheme: {
      bg: "bg-amber-950/20",
      border: "border-amber-500/30",
      text: "text-amber-300",
      badge: "bg-amber-500/20 text-amber-200 border-amber-400/30",
      accent: "bg-amber-500",
      activeRing: "ring-amber-400"
    }
  },
  {
    stepNumber: 4,
    count: 2,
    sense: "CHEIRAR",
    emoji: "👃",
    title: "2 Coisas para CHEIRAR",
    actionText: "Tente notar dois odores ou fragrâncias diferentes no ar.",
    examples: [
      "O aroma de um perfume, hidratante ou sabonete",
      "O aroma aconchegante de café, chá, uma folha ou do ar fresco"
    ],
    tip: "Se não sentir cheiros evidentes, cheire o dorso da mão limpa ou sinta o frescor do ar ao inalar.",
    colorScheme: {
      bg: "bg-purple-950/20",
      border: "border-purple-500/30",
      text: "text-purple-300",
      badge: "bg-purple-500/20 text-purple-200 border-purple-400/30",
      accent: "bg-purple-500",
      activeRing: "ring-purple-400"
    }
  },
  {
    stepNumber: 5,
    count: 1,
    sense: "SABOREAR",
    emoji: "👅",
    title: "1 Coisa para SABOREAR",
    actionText: "Foque no seu paladar e identifique um sabor presente na sua boca.",
    examples: [
      "O sabor fresco de um gole d'água",
      "O gosto de uma bala, menta ou o sabor residual natural da boca"
    ],
    tip: "Passe a ponta da língua suavemente nos dentes ou no céu da boca para notar as sensações.",
    colorScheme: {
      bg: "bg-pink-950/20",
      border: "border-pink-500/30",
      text: "text-pink-300",
      badge: "bg-pink-500/20 text-pink-200 border-pink-400/30",
      accent: "bg-pink-500",
      activeRing: "ring-pink-400"
    }
  }
];

interface GroundingToolProps {
  onNavigateToTool?: (toolId: string) => void;
  triggerVibrate?: (ms: number | number[]) => void;
}

export default function GroundingTool({ onNavigateToTool, triggerVibrate }: GroundingToolProps) {
  // Current active step index (0 = 5 Ver, 1 = 4 Tocar, 2 = 3 Ouvir, 3 = 2 Cheirar, 4 = 1 Saborear, 5 = Finished)
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Track checked items for each step: record stepIndex -> set of checked item indexes
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean[]>>({
    0: Array(5).fill(false),
    1: Array(4).fill(false),
    2: Array(3).fill(false),
    3: Array(2).fill(false),
    4: Array(1).fill(false)
  });

  // View mode: 'step' (Passo a passo focado) or 'all' (Visão panorâmica)
  const [viewMode, setViewMode] = useState<"step" | "all">("step");

  // Optional Voice narration (Web Speech API)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Vibration helper
  const vibrate = (ms: number | number[]) => {
    if (triggerVibrate) {
      triggerVibrate(ms);
    } else if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  };

  // Toggle voice narration for current step
  const speakCurrentStep = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.85; // Calming, slightly slower pace
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Stop speech when step changes or component unmounts
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentStep, viewMode]);

  // Handle checking/unchecking an item
  const toggleItem = (stepIdx: number, itemIdx: number) => {
    vibrate(40);
    setCheckedItems(prev => {
      const stepState = [...(prev[stepIdx] || [])];
      stepState[itemIdx] = !stepState[itemIdx];
      return {
        ...prev,
        [stepIdx]: stepState
      };
    });
  };

  // Check all items for a specific step
  const checkAllForStep = (stepIdx: number) => {
    const total = GROUNDING_STEPS[stepIdx]?.count || 0;
    vibrate([60, 60]);
    setCheckedItems(prev => ({
      ...prev,
      [stepIdx]: Array(total).fill(true)
    }));
  };

  // Reset all steps
  const resetAll = () => {
    vibrate(100);
    setCurrentStep(0);
    setCheckedItems({
      0: Array(5).fill(false),
      1: Array(4).fill(false),
      2: Array(3).fill(false),
      3: Array(2).fill(false),
      4: Array(1).fill(false)
    });
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Check if current step is fully completed
  const currentStepData = GROUNDING_STEPS[currentStep];
  const currentStepChecked = checkedItems[currentStep] || [];
  const currentStepDone = currentStepData && currentStepChecked.length > 0 && currentStepChecked.every(Boolean);

  // Total items checked across all steps
  const totalChecked: number = Object.values(checkedItems).reduce<number>(
    (acc: number, arr: boolean[]) => acc + (Array.isArray(arr) ? arr.filter(Boolean).length : 0),
    0
  );
  const totalPossible = 15;
  const progressPercent = Math.round((totalChecked / totalPossible) * 100);

  const isCompletedAll = currentStep === 5 || totalChecked === 15;

  return (
    <section 
      id="grounding-tool" 
      className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-5 md:p-8 scroll-mt-8 transition-all duration-500 relative overflow-hidden shadow-xl"
      aria-labelledby="grounding-title"
    >
      {/* Decoração sutil de fundo */}
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none select-none" aria-hidden="true">
        <Anchor className="w-48 h-48 text-[#2dd4bf]" />
      </div>

      {/* CABEÇALHO DA TÉCNICA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#3f3f46] relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-[#2dd4bf]/20 border border-[#2dd4bf]/40 flex items-center justify-center text-[#2dd4bf]">
              <Anchor className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 id="grounding-title" className="text-xl md:text-2xl font-bold text-[#f4f4f5] tracking-tight">
              Técnica de Ancoragem 5-4-3-2-1 (Grounding)
            </h2>
            <span className="bg-teal-500/10 border border-teal-400/25 text-teal-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Sentidos do Corpo
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#a1a1aa] leading-relaxed max-w-3xl">
            Tire o foco dos pensamentos acelerados ou da sobrecarga do ambiente e traga sua mente de volta para o momento presente através dos cinco sentidos corporais. Excelente para crises de ansiedade, pânico e sobrecarga sensorial no TEA.
          </p>
        </div>

        {/* CONTROLES RÁPIDOS DE MODO */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setViewMode(viewMode === "step" ? "all" : "step");
              vibrate(30);
            }}
            className="px-3 py-1.5 rounded-md border border-[var(--border-card,#aec3b4)] bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--bg-card,#d9e4dc)] text-xs font-semibold text-[var(--text-primary,#1e3327)] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Alternar entre modo focado passo a passo ou visão completa"
          >
            <Layers className="w-3.5 h-3.5 text-[var(--accent-readable,#174d34)]" />
            <span>{viewMode === "step" ? "Ver Todos os 5" : "Modo Focado"}</span>
          </button>

          <button
            onClick={resetAll}
            className="p-1.5 rounded-md border border-[var(--border-card,#aec3b4)] bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--bg-card,#d9e4dc)] text-[var(--text-muted,#3f5c4c)] hover:text-[var(--text-primary,#1e3327)] transition-colors cursor-pointer"
            title="Reiniciar Ancoragem"
            aria-label="Reiniciar ancoragem"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BARRA DE PROGRESSO GERAL DOS 5 SENTIDOS */}
      <div className="py-4 relative z-10">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted,#3f5c4c)] mb-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-readable,#174d34)]" />
            <span>Ancoragem no Presente: <strong>{totalChecked} de {totalPossible} itens</strong> identificados</span>
          </span>
          <span className="font-mono text-[var(--accent-readable,#174d34)] font-bold">{progressPercent}%</span>
        </div>
        
        {/* Track bar */}
        <div className="w-full h-2.5 bg-[var(--bg-inner,#cddcd1)] rounded-full border border-[var(--border-card,#aec3b4)] overflow-hidden p-0.5 flex">
          <div 
            className="h-full bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* NAVEGADOR DE ABAS / PASSOS DOS SENTIDOS */}
        <div className="grid grid-cols-5 gap-1.5 md:gap-3 mt-4">
          {GROUNDING_STEPS.map((step, idx) => {
            const stepChecked = checkedItems[idx] || [];
            const isDone = stepChecked.length > 0 && stepChecked.every(Boolean);
            const isCurrent = currentStep === idx;

            return (
              <button
                key={step.stepNumber}
                onClick={() => {
                  setCurrentStep(idx);
                  if (viewMode === "all") setViewMode("step");
                  vibrate(40);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center cursor-pointer select-none ${
                  isCurrent
                    ? `${step.colorScheme.bg} ${step.colorScheme.border} ring-2 ${step.colorScheme.activeRing} shadow-md`
                    : isDone
                      ? "bg-emerald-500/15 border-emerald-600/30 text-[var(--accent-readable,#174d34)]"
                      : "bg-[var(--bg-inner,#cddcd1)] border-[var(--border-card,#aec3b4)] hover:border-[var(--accent-readable,#174d34)] text-[var(--text-muted,#3f5c4c)]"
                }`}
                title={`Ir para o sentido ${step.sense}: ${step.count} coisas`}
              >
                <div className="flex items-center gap-1 text-sm md:text-base mb-0.5">
                  <span>{step.emoji}</span>
                  <span className="font-mono font-bold text-xs md:text-sm">{step.count}</span>
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:inline">
                  {step.sense}
                </span>
                
                {/* Indicador de progresso desse sentido */}
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: step.count }).map((_, dotIdx) => (
                    <div 
                      key={dotIdx}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        stepChecked[dotIdx] 
                          ? "bg-[var(--accent-readable,#174d34)]" 
                          : "border border-[var(--border-card,#aec3b4)] bg-transparent opacity-60"
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MODO 1: PASSO A PASSO GUIADO (FOCADO)
          ========================================================================= */}
      {viewMode === "step" && (
        <div className="mt-4 relative z-10">
          
          {/* SE JÁ COMPLETOU TODOS OS PASSOS */}
          {isCompletedAll ? (
            <div className="bg-gradient-to-b from-teal-950/40 to-emerald-950/20 border border-teal-500/40 rounded-xl p-6 md:p-10 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 border border-teal-400/40 mx-auto flex items-center justify-center text-[#2dd4bf] shadow-lg shadow-teal-950/50">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5] animate-bounce" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                  Ancoragem Concluída com Sucesso
                </span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#f4f4f5]">
                  Você está seguro no aqui e agora.
                </h3>
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                  Você conectou seus 5 sentidos ao ambiente presente (5 visões, 4 toques, 3 sons, 2 aromas e 1 sabor). Seu cérebro está mais equilibrado e protegido contra pensamentos acelerados.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={resetAll}
                  className="px-5 py-2.5 bg-[#2dd4bf] hover:bg-teal-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Praticar Novamente
                </button>

                {onNavigateToTool && (
                  <>
                    <button
                      onClick={() => onNavigateToTool("breathing-tool")}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 font-semibold text-xs rounded-lg transition-all cursor-pointer"
                    >
                      🎈 Ir para Respiração 4-4-4
                    </button>
                    <button
                      onClick={() => onNavigateToTool("sound-tool")}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 font-semibold text-xs rounded-lg transition-all cursor-pointer"
                    >
                      🌧️ Ouvir Som de Chuva
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* PASSO ATUAL ATIVO */
            currentStepData && (
              <div className={`${currentStepData.colorScheme.bg} border ${currentStepData.colorScheme.border} rounded-xl p-5 md:p-8 space-y-6 transition-all duration-300`}>
                
                {/* Header do Passo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl select-none" aria-hidden="true">{currentStepData.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${currentStepData.colorScheme.badge}`}>
                          Passo {currentStep + 1} de 5 • Sentido {currentStepData.sense}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-[#f4f4f5] mt-1">
                        {currentStepData.title}
                      </h3>
                    </div>
                  </div>

                  {/* Leitura por Voz Opcional para Acessibilidade */}
                  {"speechSynthesis" in (typeof window !== "undefined" ? window : {}) && (
                    <button
                      onClick={() => {
                        const narration = `${currentStepData.title}. ${currentStepData.actionText}. Exemplos: ${currentStepData.examples.join(", ")}. Dica: ${currentStepData.tip}`;
                        speakCurrentStep(narration);
                      }}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto ${
                        isSpeaking 
                          ? "bg-rose-500/20 border-rose-400 text-rose-700 animate-pulse" 
                          : "bg-[var(--bg-inner,#cddcd1)] border-[var(--border-card,#aec3b4)] text-[var(--text-primary,#1e3327)] hover:bg-[var(--bg-card,#d9e4dc)]"
                      }`}
                      title="Ouvir instrução por áudio suave"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-600" />
                          <span>Pausar Leitura</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-[var(--accent-readable,#174d34)]" />
                          <span>Ouvir Instrução em Voz</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Texto de Ação */}
                <div className="bg-[var(--bg-inner,#cddcd1)] rounded-lg p-4 border border-[var(--border-card,#aec3b4)] space-y-2">
                  <p className="text-sm md:text-base text-[var(--text-primary,#1e3327)] font-medium leading-relaxed">
                    👉 <strong>Ação:</strong> {currentStepData.actionText}
                  </p>
                  <p className="text-xs text-[var(--text-muted,#3f5c4c)] italic">
                    💡 <em>{currentStepData.tip}</em>
                  </p>
                </div>

                {/* Itens Interativos com Exemplos Selecionáveis */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-secondary,#2a4234)] uppercase tracking-wider">
                      Toque em cada um conforme você for identificando no ambiente:
                    </span>
                    <button
                      onClick={() => checkAllForStep(currentStep)}
                      className="text-[11px] text-[var(--accent-readable,#174d34)] hover:underline font-semibold cursor-pointer"
                    >
                      Marcar todos os {currentStepData.count}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Array.from({ length: currentStepData.count }).map((_, itemIdx) => {
                      const isChecked = checkedItems[currentStep]?.[itemIdx] || false;
                      const exampleText = currentStepData.examples[itemIdx] || `Item ${itemIdx + 1}`;

                      return (
                        <button
                          key={itemIdx}
                          onClick={() => toggleItem(currentStep, itemIdx)}
                          className={`flex items-center gap-3 p-3.5 rounded-lg border text-left transition-all cursor-pointer select-none group ${
                            isChecked
                              ? "bg-[var(--bg-card,#d9e4dc)] border-[var(--accent-readable,#174d34)] text-[var(--text-primary,#1e3327)] shadow-sm"
                              : "bg-[var(--bg-app,#e8eee9)] border-[var(--border-card,#aec3b4)] hover:border-[var(--accent-readable,#174d34)] text-[var(--text-primary,#1e3327)]"
                          }`}
                        >
                          <div 
                            className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? "bg-[var(--accent-readable,#174d34)] border-[var(--accent-readable,#174d34)] text-white font-bold"
                                : "border-[var(--border-card,#aec3b4)] bg-[var(--bg-inner,#cddcd1)]"
                            }`}
                          >
                            {isChecked ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs font-mono text-[var(--text-muted,#3f5c4c)]">{itemIdx + 1}</span>}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold leading-snug">
                              {exampleText}
                            </div>
                            <span className="text-[10px] text-[var(--text-muted,#3f5c4c)]">
                              {isChecked ? "✓ Identificado no ambiente" : "Toque ao encontrar"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BOTÕES DE NAVEGAÇÃO ENTRE OS PASSOS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border-card,#aec3b4)]">
                  <button
                    onClick={() => {
                      if (currentStep > 0) {
                        setCurrentStep(c => c - 1);
                        vibrate(30);
                      }
                    }}
                    disabled={currentStep === 0}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[var(--border-card,#aec3b4)] bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--bg-card,#d9e4dc)] text-xs font-bold text-[var(--text-primary,#1e3327)] disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sentido Anterior
                  </button>

                  <div className="text-xs text-[var(--text-muted,#3f5c4c)] font-mono text-center">
                    {currentStepChecked.filter(Boolean).length} de {currentStepData.count} concluídos
                  </div>

                  <button
                    onClick={() => {
                      if (currentStep < 4) {
                        setCurrentStep(c => c + 1);
                        vibrate(50);
                      } else {
                        setCurrentStep(5); // Completion
                        vibrate([150, 100, 150]);
                      }
                    }}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      currentStepDone
                        ? "bg-[var(--accent-readable,#174d34)] hover:opacity-90 text-white shadow-lg"
                        : "bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--bg-card,#d9e4dc)] text-[var(--text-primary,#1e3327)] border border-[var(--border-card,#aec3b4)]"
                    }`}
                  >
                    <span>{currentStep === 4 ? "Concluir Ancoragem" : "Próximo Sentido"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* =========================================================================
          MODO 2: VISÃO PANORÂMICA / TODOS OS 5 SENTIDOS JUNTOS
          ========================================================================= */}
      {viewMode === "all" && (
        <div className="mt-6 space-y-4 relative z-10">
          <div className="flex items-center justify-between bg-[var(--bg-inner,#cddcd1)] p-3 rounded-lg border border-[var(--border-card,#aec3b4)] text-xs text-[var(--text-secondary,#2a4234)]">
            <span>Visão completa dos 5 sentidos do Grounding. Você pode interagir com qualquer passo:</span>
            <button
              onClick={() => {
                setViewMode("step");
                vibrate(30);
              }}
              className="text-[var(--accent-readable,#174d34)] font-bold hover:underline cursor-pointer"
            >
              Voltar ao Modo Focado
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GROUNDING_STEPS.map((step, stepIdx) => {
              const stepChecked = checkedItems[stepIdx] || [];
              const isDone = stepChecked.length > 0 && stepChecked.every(Boolean);

              return (
                <div
                  key={step.stepNumber}
                  className={`${step.colorScheme.bg} border ${
                    isDone ? "border-teal-400/80 shadow-md shadow-teal-950/20" : step.colorScheme.border
                  } rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl select-none">{step.emoji}</span>
                        <h4 className="font-bold text-base text-[#f4f4f5]">{step.title}</h4>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${step.colorScheme.badge}`}>
                        {stepChecked.filter(Boolean).length}/{step.count}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                      {step.actionText}
                    </p>
                  </div>

                  {/* Lista de itens interativos compactos */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                    {Array.from({ length: step.count }).map((_, itemIdx) => {
                      const isChecked = stepChecked[itemIdx] || false;
                      const exampleText = step.examples[itemIdx] || `Item ${itemIdx + 1}`;

                      return (
                        <button
                          key={itemIdx}
                          onClick={() => toggleItem(stepIdx, itemIdx)}
                          className={`w-full flex items-center gap-2 p-2 rounded text-left text-xs transition-all cursor-pointer ${
                            isChecked
                              ? "bg-[var(--bg-card,#d9e4dc)] text-[var(--text-primary,#1e3327)] border border-[var(--accent-readable,#174d34)]"
                              : "bg-[var(--bg-app,#e8eee9)] hover:bg-[var(--bg-inner,#cddcd1)] text-[var(--text-primary,#1e3327)] border border-[var(--border-card,#aec3b4)]"
                          }`}
                        >
                          <div 
                            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] ${
                              isChecked
                                ? "bg-[var(--accent-readable,#174d34)] border-[var(--accent-readable,#174d34)] text-white font-bold"
                                : "border-[var(--border-card,#aec3b4)] bg-[var(--bg-inner,#cddcd1)]"
                            }`}
                          >
                            {isChecked ? <Check className="w-3 h-3 stroke-[3]" /> : itemIdx + 1}
                          </div>
                          <span className="truncate">{exampleText}</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentStep(stepIdx);
                      setViewMode("step");
                      vibrate(40);
                    }}
                    className="w-full py-2 bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--bg-card,#d9e4dc)] text-[var(--text-primary,#1e3327)] border border-[var(--border-card,#aec3b4)] rounded-md font-semibold text-xs transition-colors cursor-pointer text-center"
                  >
                    Focar Neste Sentido
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RODA-PÉ EDUCATIVO E INCLUSIVO */}
      <div className="mt-6 pt-4 border-t border-[#3f3f46] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#a1a1aa]">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Neurodivergente amigável: Sem tempo limite, sem pressão por acertos. Faça no seu próprio ritmo.</span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">5-4-3-2-1 GROUNDING TEA/ANSIEDADE</span>
      </div>

    </section>
  );
}
