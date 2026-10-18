import React, { useState, useRef, useEffect, useCallback } from "react";
import { 
  Gamepad2, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Flame, 
  CheckCheck, 
  Layers, 
  Maximize2
} from "lucide-react";
import { unlockMobileAudio, getSharedAudioContext } from "../utils/audioSystem";

interface BurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
  color: string;
}

interface BubblePopperProps {
  onVibrate?: (pattern: number | number[]) => void;
}

// Padrão Único de Rompimento "Linha Partida" (Fratura Diagonal da Esquerda para a Direita)
// Sem orifícios circulares, sem anéis concêntricos ou teias radiais
const BrokenLinePattern: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg viewBox="0 0 40 40" className={`w-full h-full ${className}`} fill="none">
      {/* Linha mestra partida em zigue-zague que corta a bolha da esquerda para a direita */}
      <path
        d="M7 11 L14 16 L17 14 L23 23 L27 20 L34 27"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3.5 1.5"
        className="opacity-95"
      />
      {/* Ramificações finas de fissura transversal */}
      <path
        d="M14 16 L11 23 M23 23 L28 28 M17 14 L22 9 M27 20 L31 16"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="2 1.5"
        className="opacity-80"
      />
      {/* Fissura sutil em cunha (aba de membrana partida) */}
      <polygon
        points="17,14 23,23 16,20"
        fill="currentColor"
        className="opacity-35"
      />
    </svg>
  );
};

export const BubblePopper: React.FC<BubblePopperProps> = ({ onVibrate }) => {
  // Configurações do Fidget
  const [gridSize, setGridSize] = useState<number>(16); // 16 (4x4) ou 25 (5x5)
  const [bubbles, setBubbles] = useState<boolean[]>(() => Array(16).fill(false));
  const [soundMode, setSoundMode] = useState<"realistic" | "gentle" | "mute">("realistic");
  const [burstCount, setBurstCount] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastPoppedIndex, setLastPoppedIndex] = useState<number | null>(null);

  // Micro-partículas ativas de estouro
  const [particles, setParticles] = useState<BurstParticle[]>([]);
  const nextParticleId = useRef<number>(0);

  // Gatilho de vibração seguro
  const triggerVibrate = useCallback((pattern: number | number[]) => {
    if (onVibrate) {
      onVibrate(pattern);
      return;
    }
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignorar se bloqueado pelo browser
      }
    }
  }, [onVibrate]);

  // Síntese de Áudio Realista de "POP!" com suporte especial a iOS e Android
  const playPopSound = useCallback((index: number) => {
    if (soundMode === "mute") return;

    try {
      unlockMobileAudio();
      const ctx = getSharedAudioContext();
      if (!ctx) return;

      const executePop = () => {
        try {
          const now = ctx.currentTime;

          // Variação orgânica de afinação para cada bolha
          const pitchSeed = (index % 7) * 35;
          const baseFreq = soundMode === "realistic" ? 520 + pitchSeed : 380 + (index % 5) * 20;

          // 1. Oscilador principal (o "Punch" sonoro com varredura de frequência)
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(baseFreq, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

          // Volume ampliado para celular Android e iOS
          const maxGain = soundMode === "realistic" ? 0.75 : 0.45;
          oscGain.gain.setValueAtTime(maxGain, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.connect(oscGain);
          oscGain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.065);

          // 2. Ruído Branco em Banda Estreita (O "Snap" crocante de estouro)
          if (soundMode === "realistic") {
            const noiseBufferSize = Math.floor(ctx.sampleRate * 0.035);
            const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < noiseBufferSize; i++) {
              output[i] = (Math.random() * 2 - 1) * (1 - i / noiseBufferSize);
            }

            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = "bandpass";
            noiseFilter.frequency.setValueAtTime(1800 + pitchSeed * 2, now);
            noiseFilter.Q.setValueAtTime(2.5, now);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.40, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            noise.start(now);
          }
        } catch {}
      };

      if (ctx.state === "suspended") {
        ctx.resume().then(executePop).catch(executePop);
      } else {
        executePop();
      }
    } catch {
      // Ignora silenciosamente em navegadores que bloqueiam áudio
    }
  }, [soundMode]);

  // Efeito de animação das partículas
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setTimeout(() => {
      setParticles([]);
    }, 450);
    return () => clearTimeout(interval);
  }, [particles]);

  // Redimensionar grade de bolhas
  const handleChangeGrid = (size: number) => {
    setGridSize(size);
    setBubbles(Array(size).fill(false));
    triggerVibrate(60);
  };

  // Gerar partículas de explosão de "Linha Partida"
  const spawnBurstParticles = (clientX: number, clientY: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const y = clientY - containerRect.top;
    const count = 7;
    const newParticles: BurstParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const speed = 25 + Math.random() * 30;
      newParticles.push({
        id: nextParticleId.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2.5,
        angle: Math.random() * 360,
        color: "currentColor"
      });
    }

    setParticles(newParticles);
  };

  // Ação principal de estourar uma bolha
  const popBubble = (idx: number, e?: React.MouseEvent | React.TouchEvent) => {
    const wasPopped = bubbles[idx];

    // Se já estava estourada no modo bolha, apenas vibra levemente
    if (wasPopped) {
      triggerVibrate(20);
      return;
    }

    // Marca como estourada
    setBubbles(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });

    setBurstCount(c => c + 1);
    setLastPoppedIndex(idx);

    // Feedback sonoro e tátil
    playPopSound(idx);
    triggerVibrate([30, 25]);

    // Animação de partículas no ponto de toque se houver coordenadas
    if (e) {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      if (clientX && clientY) {
        const target = e.currentTarget as HTMLElement;
        const container = target.closest(".bubble-tray-container");
        if (container) {
          spawnBurstParticles(clientX, clientY, container.getBoundingClientRect());
        }
      }
    }
  };

  // Suporte a arrasto contínuo para estourar várias bolhas de uma vez (Swipe to Pop)
  const handlePointerDown = (idx: number, e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    popBubble(idx, e);
  };

  const handlePointerEnter = (idx: number, e: React.MouseEvent) => {
    if (isDragging && !bubbles[idx]) {
      popBubble(idx, e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const bubbleBtn = element?.closest("[data-bubble-idx]") as HTMLElement | null;
    if (bubbleBtn) {
      const idx = parseInt(bubbleBtn.dataset.bubbleIdx || "-1", 10);
      if (idx >= 0 && idx < bubbles.length && !bubbles[idx]) {
        popBubble(idx, e);
      }
    }
  };

  // Efeito de estourar tudo em cascata relaxante
  const popAllInCascade = () => {
    let delay = 0;
    bubbles.forEach((popped, idx) => {
      if (!popped) {
        setTimeout(() => {
          popBubble(idx);
        }, delay);
        delay += 60;
      }
    });
  };

  // Restaurar folha nova de bolhas (reset)
  const resetAllBubbles = () => {
    setBubbles(Array(gridSize).fill(false));
    triggerVibrate([80, 50, 100]);
  };

  // Inverter tabuleiro / Pop-it Reversível (efeito 3D)
  const flipBoard = () => {
    setIsFlipped(prev => !prev);
    // Vira as bolhas de volta para o estado inverso, igual a um Pop-it físico
    setBubbles(prev => prev.map(p => !p));
    triggerVibrate([50, 60, 50]);
  };

  const poppedTotal = bubbles.filter(Boolean).length;
  const isAllPopped = poppedTotal === gridSize;

  return (
    <div 
      id="popit-tool" 
      className="bg-[var(--bg-card,#d9e4dc)] border border-[var(--border-card,#aec3b4)] rounded-xl p-5 flex flex-col justify-between min-h-[380px] transition-all duration-300 shadow-sm"
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Cabeçalho do Estoura Bolhas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[var(--accent-readable,#1e3327)]">
            <Gamepad2 className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-base text-[var(--text-primary,#18261e)]">
              Estoura Bolhas e Pop-it Sensorial
            </h3>
          </div>

          {/* Contador de Satisfação */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-inner,#cddcd1)] rounded-full border border-[var(--border-card,#aec3b4)] text-xs font-semibold text-[var(--text-secondary,#2a4234)]">
            <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{burstCount} estouradas</span>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary,#2a4234)] leading-relaxed">
          Pressione ou arraste o dedo para estourar com o visual de <strong className="font-semibold text-[var(--text-primary,#18261e)]">linha partida e rasgo realista</strong>. Ideal para descompressão motora e alívio de sobrecarga.
        </p>
      </div>

      {/* Controles de Customização e Sensibilidade */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-[var(--border-card,#aec3b4)] text-xs">
        {/* Tamanho da Grade */}
        <div className="flex items-center gap-1">
          <span className="text-[var(--text-muted,#466352)] font-medium text-[11px] mr-1">Grade:</span>
          <button
            onClick={() => handleChangeGrid(16)}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
              gridSize === 16
                ? "bg-[var(--accent-readable,#1e3327)] text-white border-[var(--accent-readable,#1e3327)]"
                : "bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border-[var(--border-card,#aec3b4)] hover:bg-[var(--bg-inner-strong,#b8cdbf)]"
            }`}
          >
            4×4
          </button>
          <button
            onClick={() => handleChangeGrid(25)}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
              gridSize === 25
                ? "bg-[var(--accent-readable,#1e3327)] text-white border-[var(--accent-readable,#1e3327)]"
                : "bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border-[var(--border-card,#aec3b4)] hover:bg-[var(--bg-inner-strong,#b8cdbf)]"
            }`}
          >
            5×5
          </button>
        </div>

        {/* Modo de Som */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const nextMode = soundMode === "realistic" ? "gentle" : soundMode === "gentle" ? "mute" : "realistic";
              setSoundMode(nextMode);
              triggerVibrate(30);
            }}
            title="Alternar intensidade do som de estalo"
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-[var(--bg-inner,#cddcd1)] text-[var(--text-secondary,#2a4234)] border border-[var(--border-card,#aec3b4)] hover:bg-[var(--bg-inner-strong,#b8cdbf)] transition-all cursor-pointer"
          >
            {soundMode === "mute" ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                <span>Mudo</span>
              </>
            ) : soundMode === "gentle" ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Suave</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Estalo Real</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BANDEJA DAS BOLHAS (COM PERSPECTIVA 3D E SUPORTE A SWIPE) */}
      <div className="relative my-4 flex justify-center items-center select-none">
        <div 
          onTouchMove={handleTouchMove}
          className={`bubble-tray-container relative p-3 sm:p-4 rounded-2xl bg-[var(--bg-inner,#cddcd1)] border-2 border-[var(--border-card,#aec3b4)] shadow-inner transition-transform duration-500 ${
            isFlipped ? "rotate-180" : ""
          }`}
          style={{
            maxWidth: gridSize === 25 ? "260px" : "220px",
            width: "100%",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)"
          }}
        >
          {/* Grade de Bolhas */}
          <div 
            className={`grid gap-2 sm:gap-2.5 ${
              gridSize === 25 ? "grid-cols-5" : "grid-cols-4"
            }`}
          >
            {bubbles.map((popped, idx) => {
              return (
                <button
                  key={idx}
                  data-bubble-idx={idx}
                  onMouseDown={(e) => handlePointerDown(idx, e)}
                  onMouseEnter={(e) => handlePointerEnter(idx, e)}
                  onTouchStart={(e) => handlePointerDown(idx, e)}
                  aria-pressed={popped}
                  aria-label={`Bolha ${idx + 1} ${popped ? "estourada com linha partida" : "intacta"}`}
                  className={`relative group aspect-square rounded-full transition-all duration-200 outline-none cursor-pointer flex items-center justify-center ${
                    popped
                      ? "scale-[0.92] shadow-inner"
                      : "hover:scale-[1.05] active:scale-[0.96] shadow-md"
                  }`}
                  style={{
                    touchAction: "none"
                  }}
                >
                  {/* ESTADO 1: INTACTA (Cúpula 3D brilhante e translúcida) */}
                  {!popped && (
                    <div 
                      className="bubble-intact-dome w-full h-full rounded-full border border-[var(--border-card,#aec3b4)] flex items-center justify-center relative overflow-hidden transition-all"
                      style={{
                        background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 28%, var(--bg-card,#d9e4dc) 65%, var(--border-card,#aec3b4) 100%)",
                        boxShadow: "0 3px 6px rgba(0,0,0,0.14), inset 0 -2px 4px rgba(0,0,0,0.08), inset 0 2px 3px rgba(255,255,255,0.7)"
                      }}
                    >
                      {/* Reflexo de luz na cúpula de ar */}
                      <span 
                        className="absolute top-1.5 left-2 w-2.5 h-1.5 rounded-full bg-white/90 blur-[0.3px] -rotate-45 pointer-events-none" 
                      />
                      {/* Brilho suave secundário */}
                      <span 
                        className="absolute bottom-1.5 right-2 w-1.5 h-1 rounded-full bg-white/40 pointer-events-none" 
                      />
                    </div>
                  )}

                  {/* ESTADO 2: ESTOURADA ("LINHA PARTIDA" E CRATERA DESINFLADA REALISTA) */}
                  {popped && (
                    <div 
                      className="bubble-popped-crater w-full h-full rounded-full border-2 border-[var(--border-card,#aec3b4)]/80 flex items-center justify-center relative overflow-hidden transition-all bg-[var(--bg-inner-strong,#b8cdbf)] text-[var(--accent-readable,#1e3327)]"
                      style={{
                        boxShadow: "inset 0 3px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(0,0,0,0.3)"
                      }}
                    >
                      {/* SVG DE LINHA PARTIDA: Rasgo de ruptura linear da esquerda para a direita com fissuras */}
                      <div className="bubble-fissure-line w-[88%] h-[88%] flex items-center justify-center pointer-events-none">
                        <BrokenLinePattern />
                      </div>
                    </div>
                  )}

                  {/* Indicador de último estourado */}
                  {lastPoppedIndex === idx && popped && (
                    <span className="bubble-ping-indicator absolute inset-0 rounded-full border-2 border-emerald-500/40 animate-ping pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Micro-partículas voando no estouro */}
          {particles.map(p => (
            <span
              key={p.id}
              className="bubble-burst-particle absolute pointer-events-none rounded-full bg-[var(--accent-readable,#1e3327)] transition-all duration-300"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                transform: `translate(${p.vx}px, ${p.vy}px) scale(0)`,
                opacity: 0.8
              }}
            />
          ))}
        </div>
      </div>

      {/* Barra de Progresso e Ações */}
      <div className="space-y-3 pt-2">
        {/* Status de preenchimento */}
        <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary,#2a4234)] font-medium">
          <span>{poppedTotal} de {gridSize} estouradas</span>
          <span className="text-[var(--text-muted,#466352)]">
            {isAllPopped ? "🎉 Folha concluída!" : "Deslize ou clique livremente"}
          </span>
        </div>

        {/* Barra de preenchimento */}
        <div className="w-full h-1.5 bg-[var(--bg-inner,#cddcd1)] rounded-full overflow-hidden border border-[var(--border-card,#aec3b4)]">
          <div 
            className="h-full bg-[var(--accent-readable,#1e3327)] transition-all duration-300 rounded-full"
            style={{ width: `${(poppedTotal / gridSize) * 100}%` }}
          />
        </div>

        {/* Botões de Ação Interativa */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Virar Pop-it (Inversão 3D) */}
          <button
            onClick={flipBoard}
            className="py-2 px-2 bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--bg-inner-strong,#b8cdbf)] text-[var(--text-primary,#18261e)] border border-[var(--border-card,#aec3b4)] rounded-md font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
            title="Vira o tabuleiro de cabeça para baixo como um pop-it real"
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Virar</span>
          </button>

          {/* Estourar Todas */}
          <button
            onClick={popAllInCascade}
            disabled={isAllPopped}
            className={`py-2 px-2 border rounded-md font-bold text-[11px] flex items-center justify-center gap-1 transition-all active:scale-95 ${
              isAllPopped
                ? "opacity-50 cursor-not-allowed bg-[var(--bg-inner,#cddcd1)] text-[var(--text-muted,#466352)] border-[var(--border-card,#aec3b4)]"
                : "bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--bg-inner-strong,#b8cdbf)] text-[var(--text-primary,#18261e)] border-[var(--border-card,#aec3b4)] cursor-pointer"
            }`}
            title="Estoura todas as bolhas restantes em cascata rápida"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span className="truncate">Estourar Tudo</span>
          </button>

          {/* Restaurar Nova Folha */}
          <button
            onClick={resetAllBubbles}
            className="py-2 px-2 bg-[var(--accent-readable,#1e3327)] hover:opacity-90 text-white rounded-md font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
            title="Restaura todas as bolhas como uma folha nova"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Nova Folha</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BubblePopper;
