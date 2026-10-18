/**
 * Sistema Unificado de Áudio Web com Desbloqueio Especial para iOS e Volume Ampliado para Android
 * 
 * Resolve os seguintes problemas do ecossistema mobile:
 * 1. iOS Safari/WebKit: Bloqueio estrito de áudio ("suspended") e silenciamento pelo botão físico de mudo.
 *    - Desbloqueia o canal de áudio via elemento HTML5 de áudio silencioso (ativa AVAudioSession de mídia).
 *    - Inicializa o AudioContext síncrono e retoma o contexto com callback de reprodução garantida.
 * 2. Android: Alto-falantes de celular possuem baixa sensibilidade a graves e frequências puras.
 *    - Aplica compressor dinâmico de estúdio e síntese multi-harmônica rica, aumentando significativamente
 *      o volume e a presença acústica sem distorção.
 */

// Singleton global de AudioContext
let sharedAudioCtx: AudioContext | null = null;
let isAudioUnlocked = false;
let isMediaSessionUnlocked = false;

// Buffer de silêncio WAV em base64 para acordar o hardware de som do iOS
const SILENT_WAV_BASE64 = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

export const getSharedAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;

  try {
    if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }

    if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume().catch(() => {});
    }

    return sharedAudioCtx;
  } catch (e) {
    console.warn("[DesplugaTEA Audio] Erro ao instanciar AudioContext:", e);
    return null;
  }
};

/**
 * Desbloqueio explícito do WebKit/iOS Audio Pipeline.
 * 1. Toca elemento HTML5 de áudio silencioso para contornar a chave de mudo do iPhone.
 * 2. Retoma o AudioContext e executa buffer silencioso para ativar o CoreAudio.
 */
export const unlockMobileAudio = () => {
  if (typeof window === "undefined") return;

  // 1. Desbloqueia sessão de mídia do iOS (contorna botão silencioso do iPhone)
  if (!isMediaSessionUnlocked) {
    try {
      const audioEl = new Audio(SILENT_WAV_BASE64);
      audioEl.volume = 0.01;
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMediaSessionUnlocked = true;
        }).catch(() => {
          // Ignora se o navegador adiar
        });
      }
    } catch {}
  }

  // 2. Garante o AudioContext ativo
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  if (!isAudioUnlocked) {
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      isAudioUnlocked = true;
    } catch {}
  }
};

// Instala listeners globais na primeira interação para desbloquear iOS silenciosamente
if (typeof window !== "undefined") {
  const unlockEvents = ["pointerdown", "touchstart", "touchend", "click", "keydown"];
  const handleInitialUserGesture = () => {
    unlockMobileAudio();
  };

  unlockEvents.forEach(evt => {
    window.addEventListener(evt, handleInitialUserGesture, { passive: true, capture: true });
  });
}

/**
 * Toca um tom harmônico de sino/marimba musical rico, nítido e com volume ampliado.
 * Perfeito para o Sequenciador Motor no Android e iOS:
 * - 3 camadas harmônicas (Fundamental + Oitava + Quinta)
 * - Compressor dinâmico para máxima audibilidade em micro-alto-falantes de celulares
 */
export const playResonantChime = (frequency: number, masterVolume = 1.3) => {
  if (typeof window === "undefined") return;

  unlockMobileAudio();
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  const executePlay = () => {
    try {
      const now = ctx.currentTime;

      // Compressor dinâmico: eleva o volume perceptível no Android sem estourar o áudio
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, now);
      compressor.knee.setValueAtTime(16, now);
      compressor.ratio.setValueAtTime(4, now);
      compressor.attack.setValueAtTime(0.003, now);
      compressor.release.setValueAtTime(0.25, now);
      compressor.connect(ctx.destination);

      // 1. Oscilador Fundamental (Corpo grave-médio do som, onda senoidal pura)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(frequency, now);

      const fundamentalVol = Math.min(1.0, masterVolume * 1.15);
      gain1.gain.setValueAtTime(fundamentalVol, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);

      osc1.connect(gain1);
      gain1.connect(compressor);
      osc1.start(now);
      osc1.stop(now + 0.53);

      // 2. Oscilador Harmônico Superior (Oitava em triângulo: essencial para clareza no alto-falante Android)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(frequency * 2, now);

      const harmonicVol = Math.min(0.85, masterVolume * 0.60);
      gain2.gain.setValueAtTime(harmonicVol, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

      osc2.connect(gain2);
      gain2.connect(compressor);
      osc2.start(now);
      osc2.stop(now + 0.38);

      // 3. Brilho Acústico de Sino (Quinta justa / harmônico superior suave)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(frequency * 3, now);

      const chimeVol = Math.min(0.45, masterVolume * 0.28);
      gain3.gain.setValueAtTime(chimeVol, now);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      osc3.connect(gain3);
      gain3.connect(compressor);
      osc3.start(now);
      osc3.stop(now + 0.25);
    } catch (err) {
      console.warn("[DesplugaTEA Audio] Erro ao reproduzir tom:", err);
    }
  };

  // No iOS Safari, se o contexto estiver suspenso, retoma antes de agendar os nós
  if (ctx.state === "suspended") {
    ctx.resume().then(executePlay).catch(executePlay);
  } else {
    executePlay();
  }
};
