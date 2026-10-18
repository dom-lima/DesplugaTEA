/**
 * Sistema Unificado de Áudio Web com Desbloqueio Especial para iOS e Volume Ampliado para Android
 * 
 * Resolve os seguintes problemas do ecossistema mobile:
 * 1. iOS Safari/WebKit: Bloqueio estrito de áudio ("suspended") e silenciamento pelo botão físico de mudo.
 *    - Desbloqueia o canal de áudio via elemento HTML5 de áudio silencioso (ativa AVAudioSession de mídia).
 *    - Inicializa o AudioContext síncrono e retoma o contexto com callback de reprodução garantida.
 * 2. Android: Alto-falantes de celular possuem baixa sensibilidade a graves e frequências puras.
 *    - Aplica compressor dinâmico de estúdio, estágio de makeup gain e síntese multi-harmônica rica,
 *      aumentando expressivamente o volume e a presença acústica sem distorção.
 */

// Singleton global de AudioContext
let sharedAudioCtx: AudioContext | null = null;
let isAudioUnlocked = false;
let isMediaSessionUnlocked = false;
let silentAudioEl: HTMLAudioElement | null = null;

// Buffer de silêncio WAV em base64 válido para acordar o hardware de som do iOS
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
  try {
    if (!silentAudioEl) {
      silentAudioEl = document.createElement("audio");
      silentAudioEl.setAttribute("playsinline", "true");
      silentAudioEl.setAttribute("webkit-playsinline", "true");
      silentAudioEl.src = SILENT_WAV_BASE64;
      silentAudioEl.volume = 0.05;
    }
    const playPromise = silentAudioEl.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isMediaSessionUnlocked = true;
      }).catch(() => {
        // Ignora se o navegador adiar
      });
    }
  } catch {}

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
 * Perfeito para a Previsibilidade Motora e Ritmo no Android e iOS:
 * - 3 camadas harmônicas (Fundamental + Oitava + Quinta)
 * - Compressor dinâmico + Make-up Gain de saída para alto volume em micro-alto-falantes de celulares
 */
export const playResonantChime = (frequency: number, masterVolume = 1.6) => {
  if (typeof window === "undefined") return;

  unlockMobileAudio();
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  const executePlay = () => {
    try {
      const now = ctx.currentTime;

      // Make-up Gain de saída para elevar o volume sem clipping
      const masterOutput = ctx.createGain();
      masterOutput.gain.setValueAtTime(1.65, now);
      masterOutput.connect(ctx.destination);

      // Compressor dinâmico: eleva o volume perceptível no Android
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-16, now);
      compressor.knee.setValueAtTime(12, now);
      compressor.ratio.setValueAtTime(3.5, now);
      compressor.attack.setValueAtTime(0.002, now);
      compressor.release.setValueAtTime(0.25, now);
      compressor.connect(masterOutput);

      // 1. Oscilador Fundamental (Corpo grave-médio do som, onda senoidal pura)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(frequency, now);

      const fundamentalVol = Math.min(1.0, masterVolume * 1.1);
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

      const harmonicVol = Math.min(0.9, masterVolume * 0.75);
      gain2.gain.setValueAtTime(harmonicVol, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc2.connect(gain2);
      gain2.connect(compressor);
      osc2.start(now);
      osc2.stop(now + 0.40);

      // 3. Brilho Acústico de Sino (Quinta justa / harmônico superior suave)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(frequency * 3, now);

      const chimeVol = Math.min(0.55, masterVolume * 0.4);
      gain3.gain.setValueAtTime(chimeVol, now);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

      osc3.connect(gain3);
      gain3.connect(compressor);
      osc3.start(now);
      osc3.stop(now + 0.28);
    } catch (err) {
      console.warn("[DesplugaTEA Audio] Erro ao reproduzir tom:", err);
    }
  };

  // No iOS Safari, garante que o contexto é retomado e toca síncrono
  if (ctx.state === "suspended") {
    ctx.resume().then(executePlay).catch(executePlay);
  } else {
    executePlay();
  }
};

/**
 * Som de Acerto (Sucesso) para o Organizador de Formas Monótono.
 * Toca um arpejo melódico acolhedor de 2 notas com volume ampliado para Android e iOS
 * transmitindo reforço positivo imediato e sensação de satisfação.
 */
export const playShapeSuccessSound = (volume = 1.35) => {
  if (typeof window === "undefined") return;

  unlockMobileAudio();
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  const executePlay = () => {
    try {
      const now = ctx.currentTime;

      // Ganho de saída ampliado
      const masterOutput = ctx.createGain();
      masterOutput.gain.setValueAtTime(1.4, now);
      masterOutput.connect(ctx.destination);

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-16, now);
      compressor.knee.setValueAtTime(14, now);
      compressor.ratio.setValueAtTime(3.5, now);
      compressor.attack.setValueAtTime(0.003, now);
      compressor.release.setValueAtTime(0.20, now);
      compressor.connect(masterOutput);

      // Nota 1 (Dó 523Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(volume * 0.9, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.30);
      osc1.connect(gain1);
      gain1.connect(compressor);
      osc1.start(now);
      osc1.stop(now + 0.31);

      // Nota 2 (Sol 784Hz - arpejo alegre e acolhedor)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(783.99, now + 0.08);
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.setValueAtTime(volume * 1.0, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(compressor);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.46);
    } catch {}
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(executePlay).catch(executePlay);
  } else {
    executePlay();
  }
};

/**
 * Som de Erro (Desajuste) Não-Punitivo para o Organizador de Formas Monótono.
 * Som quente, grave e suave de madeira/toque neutro (sem buzinas ou ruídos estridentes).
 * Apenas sinaliza com gentileza que a forma pertence ao outro depósito.
 */
export const playShapeMismatchSound = (volume = 1.15) => {
  if (typeof window === "undefined") return;

  unlockMobileAudio();
  const ctx = getSharedAudioContext();
  if (!ctx) return;

  const executePlay = () => {
    try {
      const now = ctx.currentTime;

      const masterOutput = ctx.createGain();
      masterOutput.gain.setValueAtTime(1.3, now);
      masterOutput.connect(ctx.destination);

      const compressor = ctx.createDynamicsCompressor();
      compressor.connect(masterOutput);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "triangle";
      // Deslize suave de 240Hz para 180Hz (toque acústico macio de madeira)
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(700, now);

      gain.gain.setValueAtTime(volume * 0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(compressor);

      osc.start(now);
      osc.stop(now + 0.21);
    } catch {}
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(executePlay).catch(executePlay);
  } else {
    executePlay();
  }
};
