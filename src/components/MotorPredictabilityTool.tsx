import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Compass, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Activity,
  CheckCircle2
} from "lucide-react";

import { playResonantChime, unlockMobileAudio } from "../utils/audioSystem";

interface MotorPredictabilityToolProps {
  onVibrate?: (ms: number | number[]) => void;
}

type PredictabilityPattern = "circular" | "wave" | "alternate" | "anticipation";

interface PadConfig {
  id: number;
  label: string;
  note: string;
  freq: number;
  colorName: string;
  dotClass: string;
}

const PADS: PadConfig[] = [
  {
    id: 0,
    label: "1",
    note: "Dó (261Hz)",
    freq: 261.63,
    colorName: "Menta",
    dotClass: "pad-accent-mint"
  },
  {
    id: 1,
    label: "2",
    note: "Mi (329Hz)",
    freq: 329.63,
    colorName: "Céu",
    dotClass: "pad-accent-sky"
  },
  {
    id: 2,
    label: "3",
    note: "Sol (392Hz)",
    freq: 392.00,
    colorName: "Lavanda",
    dotClass: "pad-accent-lavender"
  },
  {
    id: 3,
    label: "4",
    note: "Dó Alto (523Hz)",
    freq: 523.25,
    colorName: "Âmbar",
    dotClass: "pad-accent-amber"
  }
];

export const MotorPredictabilityTool: React.FC<MotorPredictabilityToolProps> = ({ onVibrate }) => {
  // Modos do Jogo: "sequencer" (Sequenciador Motor Rítmico) ou "track" (Trilha Motora de Rastreamento)
  const [activeTab, setActiveTab] = useState<"sequencer" | "track">("sequencer");

  // Estados do Sequenciador Motor
  const [patternType, setPatternType] = useState<PredictabilityPattern>("circular");
  const [tempo, setTempo] = useState<number>(650); // ms por passo (ritmo calmo e previsível)
  const [activePadIndex, setActivePadIndex] = useState<number | null>(null);
  const [expectedStepIndex, setExpectedStepIndex] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [isAutoDemonstrating, setIsAutoDemonstrating] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Estados da Trilha de Rastreamento
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [traceProgress, setTraceProgress] = useState<number>(0); // 0 a 100%
  const [lapsCompleted, setLapsCompleted] = useState<number>(0);
  const [trackSpeed, setTrackSpeed] = useState<number>(1); // 1x calmo, 0.7x sereno, 1.3x moderado
  const [guideBallPosition, setGuideBallPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Haptic feedback seguro
  const triggerVibrate = useCallback((ms: number | number[]) => {
    if (onVibrate) {
      onVibrate(ms);
      return;
    }
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {}
    }
  }, [onVibrate]);

  // Síntese Web Audio de Tons Harmônicos com volume aumentado para Android e compatibilidade total com iOS
  const playHarmonicTone = useCallback((freq: number) => {
    if (!soundEnabled) return;
    playResonantChime(freq, 1.35);
  }, [soundEnabled]);

  // Lista previsível de passos para o padrão selecionado
  const getPatternSequence = useCallback((): number[] => {
    switch (patternType) {
      case "circular":
        return [0, 1, 2, 3]; // 1 -> 2 -> 3 -> 4
      case "wave":
        return [0, 1, 2, 3, 2, 1]; // Onda suave de ida e volta
      case "alternate":
        return [0, 2, 1, 3]; // Alternado cruzado previsível
      case "anticipation":
        return [0, 1, 0, 2, 0, 3]; // Retorno à base previsível
    }
  }, [patternType]);

  const sequence = getPatternSequence();
  const currentExpectedPadId = sequence[expectedStepIndex] ?? sequence[0];

  // Ação de toque motor em uma das almofadas (Pad)
  const handlePadPress = (padId: number) => {
    unlockMobileAudio();
    setActivePadIndex(padId);
    playHarmonicTone(PADS[padId].freq);
    triggerVibrate(35);

    // Feedback visual breve
    setTimeout(() => {
      setActivePadIndex(null);
    }, 180);

    // Avança no padrão de previsibilidade (sem erro ou game over: sempre acolhe o movimento)
    if (padId === currentExpectedPadId) {
      const nextIndex = (expectedStepIndex + 1) % sequence.length;
      setExpectedStepIndex(nextIndex);
      if (nextIndex === 0) {
        setCompletedCycles(c => c + 1);
        triggerVibrate([40, 30, 60]);
      }
    } else {
      // Se tocou fora de ordem, o sistema apenas realinha suavemente a previsibilidade sem punição
      setExpectedStepIndex((sequence.indexOf(padId) + 1) % sequence.length);
    }
  };

  // Demonstração Guiada Automática de Ritmo e Previsibilidade
  useEffect(() => {
    if (!isAutoDemonstrating) return;

    let step = 0;
    const interval = setInterval(() => {
      const padId = sequence[step % sequence.length];
      setActivePadIndex(padId);
      playHarmonicTone(PADS[padId].freq);
      triggerVibrate(25);

      setTimeout(() => {
        setActivePadIndex(null);
      }, Math.min(220, tempo * 0.4));

      step++;
    }, tempo);

    return () => clearInterval(interval);
  }, [isAutoDemonstrating, sequence, tempo, playHarmonicTone, triggerVibrate]);

  // Animação da Trilha do Infinito (Traçado Motor Previsível)
  useEffect(() => {
    if (activeTab !== "track") return;

    let animId: number;
    let t = 0;

    const animateLoop = () => {
      t += 0.008 * trackSpeed;
      if (t >= Math.PI * 2) {
        t = 0;
        setLapsCompleted(l => l + 1);
        triggerVibrate(50);
        playHarmonicTone(392);
      }

      // Curva de Lemniscata (Símbolo do Infinito ♾️ com movimento 100% contínuo e previsível)
      // Escala para caber no SVG 100x60
      const a = 36;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = 50 + (a * Math.cos(t)) / denom;
      const y = 30 + (a * Math.sin(t) * Math.cos(t)) / denom;

      setGuideBallPosition({ x, y });
      setTraceProgress(Math.round((t / (Math.PI * 2)) * 100));

      animId = requestAnimationFrame(animateLoop);
    };

    animId = requestAnimationFrame(animateLoop);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, trackSpeed, triggerVibrate, playHarmonicTone]);

  // Interação manual de arrasto na trilha do infinito
  const handleTrackPointerDown = () => {
    setIsTracing(true);
    triggerVibrate(30);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isTracing || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 60;

    // Distância até a bolinha guia
    const dist = Math.hypot(x - guideBallPosition.x, y - guideBallPosition.y);
    if (dist < 12) {
      triggerVibrate(15);
    }
  };

  const handleTrackPointerUp = () => {
    setIsTracing(false);
  };

  return (
    <div 
      id="motor-predictability-tool"
      className="bg-[var(--bg-card,#d9e4dc)] border border-[var(--border-card,#aec3b4)] rounded-xl p-5 sm:p-6 flex flex-col justify-between min-h-[360px] transition-all duration-300 shadow-sm"
    >
      {/* Cabeçalho do Módulo Motor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-[var(--accent-readable,#174d34)]">
            <Compass className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-base text-[var(--text-primary,#1e3327)]">
              Previsibilidade Motora e Ritmo
            </h3>
          </div>

          {/* Abas de Navegação entre Modos Motores */}
          <div className="flex items-center gap-1 p-0.5 bg-[var(--bg-inner,#cddcd1)] rounded-lg border border-[var(--border-card,#aec3b4)] text-xs">
            <button
              onClick={() => {
                setActiveTab("sequencer");
                setIsAutoDemonstrating(false);
                triggerVibrate(25);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer text-[11px] ${
                activeTab === "sequencer"
                  ? "bg-[var(--accent-readable,#174d34)] text-white shadow-sm"
                  : "text-[var(--text-secondary,#2a4234)] hover:bg-[var(--bg-inner-strong,#c2d6c7)]"
              }`}
            >
              Sequenciador Rítmico
            </button>
            <button
              onClick={() => {
                setActiveTab("track");
                setIsAutoDemonstrating(false);
                triggerVibrate(25);
              }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer text-[11px] ${
                activeTab === "track"
                  ? "bg-[var(--accent-readable,#174d34)] text-white shadow-sm"
                  : "text-[var(--text-secondary,#2a4234)] hover:bg-[var(--bg-inner-strong,#c2d6c7)]"
              }`}
            >
              Trilha Contínua ♾️
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary,#2a4234)] leading-relaxed">
          {activeTab === "sequencer"
            ? "Antecipação motora de passos e ritmo constante. O cérebro prevê o próximo toque com tranquilidade, sem tempo limite e sem punição."
            : "Rastreie com o dedo a trajetória previsível do Infinito em ritmo estável. Promove regulação bilateral e desaceleração do sistema nervoso."}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: SEQUENCIADOR MOTOR RÍTMICO (ANTECIPAÇÃO PREVISÍVEL)                */}
      {/* ========================================================================= */}
      {activeTab === "sequencer" && (
        <div className="my-3 space-y-3">
          {/* Barra de Antecipação Visual: Mostra claramente o próximo passo esperado com contraste ameno */}
          <div className="flex items-center justify-between p-2.5 bg-[var(--bg-inner,#cddcd1)] rounded-lg border border-[var(--border-card,#aec3b4)] text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted,#3f5c4c)] font-medium text-[11px]">Próximo passo previsto:</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-medium text-xs bg-[var(--bg-inner-strong,#c2d6c7)] text-[var(--text-secondary,#2a4234)] border border-[var(--border-subtle,#bdd1c3)]">
                <span className="opacity-75">Passo {expectedStepIndex + 1}:</span>
                <span>Almofada {PADS[currentExpectedPadId].label} • {PADS[currentExpectedPadId].colorName}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[var(--text-secondary,#2a4234)] font-medium text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--text-secondary,#2a4234)]" />
              <span>{completedCycles} ciclos</span>
            </div>
          </div>

          {/* Grid dos 4 Blocos Motores (Pads de Toque com Contraste Suave e Leveza Visual em Relação ao Fundo) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PADS.map((pad) => {
              const isExpected = pad.id === currentExpectedPadId;
              const isActive = pad.id === activePadIndex;

              return (
                <button
                  key={pad.id}
                  onClick={() => handlePadPress(pad.id)}
                  onPointerDown={() => unlockMobileAudio()}
                  aria-label={`Almofada motora ${pad.label} - ${pad.colorName}. ${isExpected ? "Próxima da sequência" : ""}`}
                  className={`motor-pad-box relative aspect-square sm:aspect-[4/3] rounded-xl p-3 border transition-all duration-150 flex flex-col justify-between cursor-pointer select-none outline-none ${
                    isActive
                      ? "pad-active"
                      : isExpected
                      ? "pad-expected"
                      : ""
                  }`}
                  style={{ touchAction: "manipulation" }}
                >
                  {/* Marcador Superior: Número com contraste suave e ponto indicador sutil */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base sm:text-lg font-semibold leading-none text-[var(--text-secondary,#2a4234)]">
                      {pad.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isExpected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border border-[var(--border-subtle,#bdd1c3)] opacity-90">
                          Previsto
                        </span>
                      )}
                      <span className={`w-2.5 h-2.5 rounded-full ${pad.dotClass} shrink-0`} />
                    </div>
                  </div>

                  {/* Nome da cor e nota musical com tipografia confortável e baixo contraste */}
                  <div className="text-left leading-tight">
                    <span className="block font-medium text-xs sm:text-sm text-[var(--text-secondary,#2a4234)]">
                      {pad.colorName}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted,#3f5c4c)] font-mono opacity-80">
                      {pad.note}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mini Trilha Visual dos Passos da Sequência Atual */}
          <div className="flex items-center justify-center gap-1.5 py-1">
            {sequence.map((padId, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-medium border transition-all ${
                  idx === expectedStepIndex
                    ? "bg-[var(--bg-inner-strong,#c2d6c7)] text-[var(--text-secondary,#2a4234)] border-[var(--border-card,#aec3b4)] scale-105"
                    : "bg-[var(--bg-inner,#cddcd1)] text-[var(--text-muted,#3f5c4c)] border-[var(--border-subtle,#bdd1c3)] opacity-85"
                }`}
                title={`Passo ${idx + 1}: Almofada ${PADS[padId].label}`}
              >
                {PADS[padId].label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: TRILHA CONTÍNUA DE RASTREAMENTO (LOOP INFINITO MOTOR ♾️)            */}
      {/* ========================================================================= */}
      {activeTab === "track" && (
        <div className="my-3 space-y-3">
          {/* Barra de Progresso e Voltas */}
          <div className="flex items-center justify-between p-2.5 bg-[var(--bg-inner,#cddcd1)] rounded-lg border border-[var(--border-card,#aec3b4)] text-xs">
            <span className="text-[var(--text-secondary,#2a4234)] font-medium text-[11px]">
              Acompanhe a esfera guia com o toque ou observe o fluxo previsível
            </span>
            <div className="flex items-center gap-1 font-bold text-xs text-[var(--accent-readable,#174d34)]">
              <Activity className="w-3.5 h-3.5" />
              <span>{lapsCompleted} voltas completas</span>
            </div>
          </div>

          {/* Pista do Infinito Interativa em SVG */}
          <div className="relative p-2 bg-[var(--bg-inner,#cddcd1)] rounded-xl border border-[var(--border-card,#aec3b4)] flex items-center justify-center overflow-hidden select-none">
            <svg
              ref={svgRef}
              viewBox="0 0 100 60"
              onPointerDown={handleTrackPointerDown}
              onPointerMove={handleTrackPointerMove}
              onPointerUp={handleTrackPointerUp}
              className="w-full max-w-[340px] h-[130px] cursor-grab active:cursor-grabbing"
              style={{ touchAction: "none" }}
            >
              {/* Trilho base escuro/pastel */}
              <path
                d="M 50,30 C 65,10 85,10 85,30 C 85,50 65,50 50,30 C 35,10 15,10 15,30 C 15,50 35,50 50,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[var(--bg-inner-strong,#c2d6c7)] opacity-60"
              />

              {/* Linha guia central da trilha */}
              <path
                d="M 50,30 C 65,10 85,10 85,30 C 85,50 65,50 50,30 C 35,10 15,10 15,30 C 15,50 35,50 50,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className="text-[var(--border-card,#aec3b4)] opacity-80"
              />

              {/* Ponto Central de Equilíbrio */}
              <circle
                cx="50"
                cy="30"
                r="3.5"
                fill="currentColor"
                className="text-[var(--accent-readable,#174d34)] opacity-50"
              />

              {/* Esfera Guia em Movimento Suave e Previsível */}
              <circle
                cx={guideBallPosition.x}
                cy={guideBallPosition.y}
                r="5.5"
                fill="currentColor"
                className="text-[var(--accent-readable,#174d34)] transition-transform"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
                }}
              />
              <circle
                cx={guideBallPosition.x}
                cy={guideBallPosition.y}
                r="2.5"
                fill="#ffffff"
                className="opacity-90 pointer-events-none"
              />
            </svg>
          </div>

          {/* Barra de Progresso da Volta Atual */}
          <div className="w-full h-1.5 bg-[var(--bg-inner,#cddcd1)] rounded-full overflow-hidden border border-[var(--border-card,#aec3b4)]">
            <div 
              className="h-full bg-[var(--accent-readable,#174d34)] transition-all duration-100 rounded-full"
              style={{ width: `${traceProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTROLES INFERIORES: PADRÕES, RITMO E ÁUDIO                              */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-card,#aec3b4)] text-xs">
        {activeTab === "sequencer" ? (
          <>
            {/* Seletor de Padrão Motor Previsível */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted,#3f5c4c)] font-medium text-[11px]">Padrão:</span>
              <select
                value={patternType}
                onChange={(e) => {
                  setPatternType(e.target.value as PredictabilityPattern);
                  setExpectedStepIndex(0);
                  setIsAutoDemonstrating(false);
                  triggerVibrate(20);
                }}
                className="px-2 py-1 bg-[var(--bg-inner,#cddcd1)] text-[var(--text-primary,#1e3327)] border border-[var(--border-card,#aec3b4)] rounded-md font-semibold text-[11px] outline-none cursor-pointer"
              >
                <option value="circular">🔄 Circular (1-2-3-4)</option>
                <option value="wave">🌊 Onda (1-2-3-4-3-2)</option>
                <option value="alternate">⚡ Alternado (1-3-2-4)</option>
                <option value="anticipation">🎯 Base e Retorno (1-2-1-3-1-4)</option>
              </select>
            </div>

            {/* Ações do Sequenciador */}
            <div className="flex items-center gap-1.5">
              {/* Botão de Demonstração com Ritmo Previsível */}
              <button
                onClick={() => {
                  setIsAutoDemonstrating(!isAutoDemonstrating);
                  triggerVibrate(30);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                  isAutoDemonstrating
                    ? "bg-[var(--accent-readable,#174d34)] text-white border-[var(--accent-readable,#174d34)]"
                    : "bg-[var(--bg-inner,#cddcd1)] text-[var(--text-primary,#1e3327)] border-[var(--border-card,#aec3b4)] hover:bg-[var(--bg-inner-strong,#c2d6c7)]"
                }`}
                title="Tocar o ritmo em cadência automática"
              >
                <Play className={`w-3.5 h-3.5 ${isAutoDemonstrating ? "fill-white" : ""}`} />
                <span>{isAutoDemonstrating ? "Pausar" : "Ouvir Ritmo"}</span>
              </button>

              {/* Botão de Som */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  triggerVibrate(20);
                }}
                className="p-1.5 bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border border-[var(--border-card,#aec3b4)] rounded-md hover:bg-[var(--bg-inner-strong,#c2d6c7)] transition-all cursor-pointer"
                title={soundEnabled ? "Desativar sons" : "Ativar sons de sino harmônico"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-500" />}
              </button>

              {/* Reset de Ciclos */}
              <button
                onClick={() => {
                  setCompletedCycles(0);
                  setExpectedStepIndex(0);
                  setIsAutoDemonstrating(false);
                  triggerVibrate([40, 40]);
                }}
                className="p-1.5 bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border border-[var(--border-card,#aec3b4)] rounded-md hover:bg-[var(--bg-inner-strong,#c2d6c7)] transition-all cursor-pointer"
                title="Reiniciar contador de ciclos"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Controles da Trilha Contínua */}
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted,#3f5c4c)] font-medium text-[11px]">Velocidade:</span>
              <div className="flex items-center gap-1">
                {[
                  { label: "Serena", val: 0.7 },
                  { label: "Calma", val: 1 },
                  { label: "Moderada", val: 1.4 }
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      setTrackSpeed(s.val);
                      triggerVibrate(20);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                      trackSpeed === s.val
                        ? "bg-[var(--accent-readable,#174d34)] text-white border-[var(--accent-readable,#174d34)]"
                        : "bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border-[var(--border-card,#aec3b4)]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Botão de Som */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  triggerVibrate(20);
                }}
                className="p-1.5 bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border border-[var(--border-card,#aec3b4)] rounded-md hover:bg-[var(--bg-inner-strong,#c2d6c7)] transition-all cursor-pointer"
                title={soundEnabled ? "Desativar som de volta" : "Ativar som de volta"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-500" />}
              </button>

              {/* Reset de Voltas */}
              <button
                onClick={() => {
                  setLapsCompleted(0);
                  triggerVibrate(30);
                }}
                className="p-1.5 bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border border-[var(--border-card,#aec3b4)] rounded-md hover:bg-[var(--bg-inner-strong,#c2d6c7)] transition-all cursor-pointer"
                title="Reiniciar voltas da trilha"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MotorPredictabilityTool;
