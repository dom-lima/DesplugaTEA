import React, { useState, useEffect, useRef } from "react";
import { 
  Volume2, 
  VolumeX, 
  Wind, 
  Brain, 
  Sun, 
  RefreshCw, 
  Heart,
  Sparkles,
  AlertOctagon,
  EyeOff,
  Battery,
  Calendar,
  Layers,
  Sparkle,
  Smile,
  Gamepad2,
  Clock,
  Palette
} from "lucide-react";
import GroundingTool from "./components/GroundingTool";
import PastelPaletteModal, { ThemeId } from "./components/PastelPaletteModal";
import BubblePopper from "./components/BubblePopper";
import MotorPredictabilityTool from "./components/MotorPredictabilityTool";
import { safeStorage } from "./utils/storage";
import { unlockMobileAudio, playShapeSuccessSound, playShapeMismatchSound } from "./utils/audioSystem";

// ============================================================================
// BANCO DE DADOS DE DICAS LOCAIS DE DESCOMPRESSÃO (10 por categoria)
// Todas incluem tom acolhedor e sugestão de acompanhamento profissional.
// ============================================================================
const ADVICE_DATABASE: Record<string, string[]> = {
  som_alto: [
    "Eita! O mundo lá fora parece que quebrou o botão de volume! Coloque seus fones mais confortáveis agora. Não se esqueça: alinhar estratégias com seu psicólogo e psiquiatra ajuda demais a blindar seus ouvidos!",
    "Ruído demais na área! Que tal usar nosso Som de Chuva abaixo para fazer um escudo acústico? Lembre-se de sempre conversar com seu psicólogo e psiquiatra para ajustar suas ferramentas de proteção sonora!",
    "Seus sensores de som estão fazendo hora extra! Vá para um lugar mais reservado agora mesmo. Estar em dia com as consultas de psicologia e psiquiatria é super importante para manter sua bateria regulada!",
    "Parece um show de rock barulhento, mas sem a música boa! Use nosso ruído marrom para desacelerar o cérebro. Siga firme no acompanhamento com seu psiquiatra e psicólogo para modular essa hipersensibilidade!",
    "O som alto cansa o cérebro num piscar de olhos. Que tal respirar fundo com nosso balão de ar? Ah, e lembre-se de sempre levar esses episódios para discutir com seu psicólogo e seu psiquiatra de confiança!",
    "Muito blá-blá-blá ao redor? Desplugue seus ouvidos desse estresse. Mantenha seus heróis da saúde mental (psicólogo e médico psiquiatra) sempre por perto para criar planos de ação infalíveis!",
    "Seus ouvidos estão pedindo um botão de 'mute'! Coloque um abafador de ruídos agora. Consultar frequentemente seu psiquiatra e seu psicólogo ajuda a entender seus limites com muito carinho!",
    "Muitas conversas cruzadas travam nosso processamento mental. Ligue nosso som calmante offline para filtrar o caos. Não deixe de contar com o apoio especializado do seu psicólogo e médico psiquiatra!",
    "A vibração do som alto pode irritar o corpo inteiro. Dê um descanso para si em um cantinho quieto. Lembre-se: sua dupla de saúde, psicólogo e psiquiatra, tem as melhores dicas personalizadas para você!",
    "Sons irritantes detectados! Vamos isolar a mente por 5 minutos? Respire fundo e relaxe. Mantenha seu plano de voo em dia com seu terapeuta psicólogo e seu psiquiatra para mais conforto no dia a dia!"
  ],
  luz_forte: [
    "Uau, quem ligou o sol no máximo dentro de uma sala? Cubra os olhos com as mãos por alguns segundos e diminua o brilho das telas. Siga firme no tratamento com seu psiquiatra e psicólogo!",
    "Essa luz parece um holofote de cinema! Procure um ambiente com luz amarelada ou indireta. Não esqueça de comentar com seu psicólogo e médico psiquiatra sobre como as luzes te afetam!",
    "Luz fluorescente piscando é o inimigo número um da nossa calma! Feche os olhos agora por um instante. Ter o apoio contínuo do seu psiquiatra e psicólogo faz toda a diferença para o seu bem-estar!",
    "Seus olhos merecem férias de 3 minutos! Use óculos escuros mesmo em locais fechados se ajudar. Lembre-se de sempre manter contato próximo com seu psicólogo e psiquiatra!",
    "Claridade demais cansa até a alma! Desvie o olhar para uma superfície escura e respire bem devagar. Leve essa sensibilidade visual para conversar com seu psiquiatra e terapeuta!",
    "Vamos ativar o modo escuro no seu cérebro? Use nossa ferramenta de Pânico Sensorial abaixo para descansar a vista. Lembre-se de seguir as orientações do seu psicólogo e psiquiatra!",
    "O brilho excessivo está consumindo sua energia preciosa. Dê um reset nos olhos agora. Ter o suporte do seu psicólogo e psiquiatra ajuda a desenhar um dia a dia muito mais confortável!",
    "Luz forte deixa o corpo em estado de alerta sem necessidade. Feche os olhos e use nossa respiração guiada. Continue sempre em contato com seu psiquiatra e psicólogo para se cuidar!",
    "Ofuscamento visual detectado! Que tal uma soneca rápida de olhos fechados na mesa? Não abra mão de conversar sobre isso nas suas sessões de psicologia e consultas psiquiátricas!",
    "O mundo está brilhante demais para nós hoje. Vamos desplugar esse flash? Relaxe e respire. Seu psicólogo e psiquiatra de confiança são essenciais para te dar essa segurança!"
  ],
  excesso_info: [
    "Sua mente está parecendo um computador com 50 abas abertas e travando! Que tal usar nossa Técnica de Ancoragem 5-4-3-2-1 para ancorar seus sentidos no agora? Consulte sempre seu psicólogo e psiquiatra para desacelerar!",
    "Muitas pessoas cobrando e mil tarefas na lista? Esqueça tudo por 5 minutos e ancore seu corpo no presente com os 5 sentidos (ver, tocar, ouvir, cheirar e saborear). Ter o apoio do psiquiatra e psicólogo traz muita paz!",
    "Alerta de overclock mental! Seu processador precisa de um descanso. Faça nosso exercício de respiração háptica ou ancoragem sensorial. Mantenha suas consultas com psicólogo e psiquiatra sempre ativas!",
    "Saturação de dados detectada! Vamos dar um shutdown temporário nas preocupações? Respire fundo e ancore seus 5 sentidos. Conte sempre com a parceria do seu psicólogo e psiquiatra para organizar seus pensamentos!",
    "Muitas notificações ao mesmo tempo geram pane no sistema. Silencie o celular por uns minutos. Lembre-se de que o acompanhamento médico com psiquiatra e o suporte do psicólogo evitam crises!",
    "Seu cérebro não precisa processar o mundo inteiro agora! Foque apenas em mexer seus dedos calmamente ou encontrar 5 objetos ao redor. Mantenha em dia as visitas ao seu psicólogo e ao seu psiquiatra parceiro!",
    "Excesso de cobranças? Diga um 'agora não' bem carinhoso para as tarefas. Use nosso brinquedo Pop-it offline! Siga sempre as orientações valiosas do seu psiquiatra e psicólogo!",
    "O fluxo de pensamentos está rápido demais. Vamos puxar o freio de mão? Use nossa Ancoragem 5-4-3-2-1 para acalmar a mente através dos sentidos. Lembre-se: seu psicólogo e psiquiatra estão do seu lado!",
    "Mente cheia, peito apertado. Vamos focar no ritmo do seu coração e no chão sob seus pés? Você está seguro aqui. Não esqueça de sempre planejar suas rotinas junto com seu psicólogo e psiquiatra!",
    "O cérebro deu tela azul de tanta informação! Tudo bem reiniciar devagar com nossa técnica de ancoragem corporal. Siga firme no seu acompanhamento terapêutico com psicólogo e psiquiatra para viver de forma mais leve!"
  ],
  mudanca_rotina: [
    "Os planos mudaram de repente e o roteiro do dia quebrou? Respire fundo! É normal sentir esse desconforto. Lembre-se: seu psicólogo e psiquiatra te ajudam a recalibrar os trilhos da vida!",
    "Mudanças inesperadas exigem muito do nosso motor interno. Não se cobre tanto agora! Que tal se ancorar com a Técnica 5-4-3-2-1? Mantenha sempre contato com seu psicólogo e seu psiquiatra de confiança!",
    "O trilho mudou de rumo sem avisar? Vamos parar na estação por 5 minutos para respirar. Conte sempre com seu terapeuta psicólogo e médico psiquiatra para criar estratégias de flexibilidade!",
    "Um imprevisto aconteceu e a ansiedade subiu? Tudo bem, seu corpo está se reajustando. Use nossa Ancoragem Sensorial para focar no presente. Continue firme com seu psiquiatra e psicólogo!",
    "Quebra de padrão pode parecer assustadora, mas você continua seguro. Respire no tempo do balão. Não deixe de discutir essas transições desafiadoras com seu psicólogo e psiquiatra!",
    "O roteiro do dia deu bug? Vamos dar um reset manual e respirar fundo. Seu psiquiatra e psicólogo de confiança são perfeitos para te ajudar a lidar com imprevistos de forma leve!",
    "Planos desfeitos são como cabos desconectados. Vamos reconectar com calma, um por um. Siga sempre o acompanhamento especializado do seu psicólogo e do seu psiquiatra!",
    "A novidade repentina causou curto-circuito? Vá para o seu porto seguro e descanse. Lembre-se de que contar com o apoio de psicologia e psiquiatria clareia muito esses momentos!",
    "Imprevistos acontecem, mas nós podemos nos acolher. Use nosso Pop-it digital para canalizar a tensão. Mantenha suas consultas com psicólogo e psiquiatra sempre na agenda!",
    "A vida mudou de faixa sem dar seta? Tudo bem se sentir um pouco perdido agora. Respire fundo e confie. Seu psicólogo e seu psiquiatra estão com você para ajudar a ajustar o rumo!"
  ]
};

// NOTA: As Histórias Sociais foram integralmente preservadas e salvas em
// src/backup/socialStoriesBackup.ts e src/backup/SocialStoriesComponent.tsx
// para arquivo de segurança e futura reinstalação se desejado.

// Função utilitária para mapear dinamicamente as ferramentas recomendadas baseadas no texto da dica
const getRecommendationsForAdvice = (text: string, triggerId: string): string[] => {
  const list: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Técnica de Ancoragem 5-4-3-2-1 (Grounding)
  if (
    lowerText.includes("ancoragem") ||
    lowerText.includes("grounding") ||
    lowerText.includes("5-4-3-2-1") ||
    lowerText.includes("sentidos") ||
    lowerText.includes("presente") ||
    lowerText.includes("corpo") ||
    triggerId === "excesso_info"
  ) {
    list.push("grounding");
  }

  // Mascarador de Som
  if (
    lowerText.includes("chuva") || 
    lowerText.includes("marrom") || 
    lowerText.includes("som") || 
    lowerText.includes("ruído") || 
    lowerText.includes("fones") || 
    lowerText.includes("abafador") || 
    lowerText.includes("volume") || 
    lowerText.includes("ouvido") ||
    triggerId === "som_alto"
  ) {
    list.push("sound");
  }
  
  // Respiração Guiada
  if (
    lowerText.includes("respirar") || 
    lowerText.includes("respire") || 
    lowerText.includes("respiração") || 
    lowerText.includes("balão") || 
    lowerText.includes("círculo") || 
    lowerText.includes("coração") ||
    triggerId === "luz_forte"
  ) {
    list.push("breath");
  }
  
  // Pop-it
  if (
    lowerText.includes("pop-it") || 
    lowerText.includes("popit") || 
    lowerText.includes("dedos") || 
    lowerText.includes("brinquedo") ||
    lowerText.includes("tensão")
  ) {
    list.push("popit");
  }
  
  // Organizador de Formas
  if (
    lowerText.includes("formas") || 
    lowerText.includes("cores") || 
    lowerText.includes("organizar") || 
    lowerText.includes("organização")
  ) {
    list.push("shapes");
  }

  // Previsibilidade Motora e Ritmo
  if (
    lowerText.includes("previsibilidade") || 
    lowerText.includes("ritmo") || 
    lowerText.includes("mudança") || 
    lowerText.includes("rotina") || 
    lowerText.includes("trilha") ||
    lowerText.includes("sequência") ||
    lowerText.includes("padrão") ||
    lowerText.includes("imprevisto") ||
    triggerId === "mudanca_rotina"
  ) {
    list.push("predictability");
  }

  // Fallback se nada for detectado
  if (list.length === 0) {
    if (triggerId === "som_alto") list.push("sound");
    else if (triggerId === "luz_forte") list.push("breath");
    else if (triggerId === "excesso_info") {
      list.push("grounding");
      list.push("breath");
    } else if (triggerId === "mudanca_rotina") {
      list.push("predictability");
      list.push("breath");
    } else {
      list.push("grounding");
      list.push("breath");
      list.push("sound");
    }
  }
  
  return Array.from(new Set(list));
};

export default function App() {
  // ==========================================
  // ESTADOS PRINCIPAIS
  // ==========================================
  const [selectedTriggerId, setSelectedTriggerId] = useState<string | null>(null);
  const [adviceText, setAdviceText] = useState<string | null>(null);
  const [recommendedTools, setRecommendedTools] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Módulo 1.1: Botão de Pânico Sensorial
  const [panicMode, setPanicMode] = useState<boolean>(false);

  // Módulo 1.2: Respiração Guiada (4-4-4: Inspire, Segure, Expire)
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathingCounter, setBreathingCounter] = useState<number>(0); // 0 a 11 (12 segundos totais)

  // Módulo 1.4: Cartão de Emergência
  const [showEmergencyCard, setShowEmergencyCard] = useState<boolean>(false);

  // Módulo 1.5 e 2.8: Geradores de Áudio (Brown Noise e Chuva via Web Audio API)
  const [soundPlaying, setSoundPlaying] = useState<boolean>(false);
  const [activeSoundType, setActiveSoundType] = useState<"brown" | "rain" | null>(null);

  // Módulo 2.6: Temporizador Visual Baseado em Preenchimento (5 minutos padrão = 300 segundos)
  const [timerDuration, setTimerDuration] = useState<number>(300); // tempo inicial
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(300);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Módulo 2.7: Bateria Corporal
  const [batteryLevel, setBatteryLevel] = useState<number>(() => {
    const saved = safeStorage.getItem("desplugatea_battery");
    return saved ? parseInt(saved, 10) : 50;
  });

  // Módulo 2.10: Jogo Monótono de Formas e Cores
  const [gameShapes, setGameShapes] = useState<{ id: number; type: "circle" | "square"; color: string }[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<number | null>(null);
  const [sortedCount, setSortedCount] = useState<number>(0);
  const [shapesSoundEnabled, setShapesSoundEnabled] = useState<boolean>(() => {
    const saved = safeStorage.getItem("desplugatea_shapes_sound");
    return saved !== null ? saved === "true" : true;
  });

  const toggleShapesSound = () => {
    unlockMobileAudio();
    setShapesSoundEnabled(prev => {
      const next = !prev;
      safeStorage.setItem("desplugatea_shapes_sound", String(next));
      triggerVibrate(20);
      return next;
    });
  };

  // Refs de Áudio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Tema Visual Neurodivergente (Paletas Pastéis de Alta Legibilidade por Padrão)
  // Tema padrão fixo ao abrir o aplicativo: sempre Sálvia e Menta ("sage")
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("sage");
  const [showPaletteModal, setShowPaletteModal] = useState<boolean>(false);

  // Sincronizar data-theme no elemento raiz do documento
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", currentTheme);
      // Remove resíduos antigos em localStorage para garantir abertura sempre em Sálvia e Menta
      safeStorage.removeItem("desplugatea_theme");
    }
  }, [currentTheme]);

  // ==========================================
  // EFEITOS E COMPORTAMENTOS
  // ==========================================

  // Inicializar jogo de formas
  useEffect(() => {
    generateNewShapes();
  }, []);

  // Vibrador utilitário amigável para mobile
  const triggerVibrate = (ms: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Ignorar erros se o navegador bloquear ou não suportar haptic feedback ativo
      }
    }
  };

  // Navegação suave com destaque visual para ferramentas
  const handleNavigateToTool = (toolId: string) => {
    const el = document.getElementById(toolId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-[#2dd4bf]", "scale-[1.01]");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-[#2dd4bf]", "scale-[1.01]");
      }, 1500);
    }
    triggerVibrate(50);
  };

  // Ciclo da Respiração Guiada 4-4-4 (Inalar por 4s, Segurar por 4s, Exalar por 4s)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (breathingActive) {
      setBreathingCounter(0);
      timer = setInterval(() => {
        setBreathingCounter((prev) => {
          const next = (prev + 1) % 12;
          
          // Feedback tátil com vibrações curtas para guiar sem olhar
          if (next === 0) {
            // Início da inalação
            triggerVibrate(150);
          } else if (next === 4) {
            // Início do segurar
            triggerVibrate(80);
          } else if (next === 8) {
            // Início da exalação
            triggerVibrate([80, 80]);
          }
          
          return next;
        });
      }, 1000);
    } else {
      setBreathingCounter(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [breathingActive]);

  // Ciclo do Temporizador Visual
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (timerActive) {
      timer = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            triggerVibrate([300, 100, 300]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive]);

  // Salvar bateria corporal localmente
  const handleBatteryChange = (val: number) => {
    setBatteryLevel(val);
    safeStorage.setItem("desplugatea_battery", val.toString());
  };

  // Limpeza de áudio ao desmontar e desbloqueio preventivo de áudio para dispositivos móveis (iOS/Safari)
  useEffect(() => {
    const handleGestureUnlock = () => {
      try {
        // Inicializa e resume preventivamente o AudioContext
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx) {
          if (ctx.state === "suspended") {
            ctx.resume().catch(() => {});
          }
          // Toca um buffer silencioso para registrar a intenção de áudio
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
        }

        // Toca um áudio HTML5 base64 silencioso para contornar o botão físico de silenciar (silent switch) do iOS
        const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
        silentAudio.play().catch(() => {});

        console.log("AudioContext e canal de mídia desbloqueados preventivamente via gesto.");
        
        // Remove os ouvintes de evento após o primeiro gesto
        window.removeEventListener("click", handleGestureUnlock);
        window.removeEventListener("touchstart", handleGestureUnlock);
        window.removeEventListener("touchend", handleGestureUnlock);
      } catch (e) {
        console.warn("Erro ao desbloquear áudio preventivo:", e);
      }
    };

    window.addEventListener("click", handleGestureUnlock, { passive: true });
    window.addEventListener("touchstart", handleGestureUnlock, { passive: true });
    window.addEventListener("touchend", handleGestureUnlock, { passive: true });

    return () => {
      stopSynthesizedSound();
      window.removeEventListener("click", handleGestureUnlock);
      window.removeEventListener("touchstart", handleGestureUnlock);
      window.removeEventListener("touchend", handleGestureUnlock);
    };
  }, []);

  // ==========================================
  // FUNÇÕES DE ÁUDIO WEB AUDIO API (Sintetizador Offline)
  // ==========================================
  const stopSynthesizedSound = () => {
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.stop();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
    setSoundPlaying(false);
    setActiveSoundType(null);
  };

  const unlockAudio = () => {
    try {
      unlockMobileAudio();
      // 1. Instancia e inicializa o AudioContext
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx) {
        if (ctx.state === "suspended") {
          const promise = ctx.resume();
          if (promise && typeof promise.catch === "function") {
            promise.catch(() => {});
          }
        }

        // 2. Toca um buffer silencioso rápido via Web Audio API para destravar
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      }

      // 3. Toca um áudio HTML5 base64 silencioso de 1 sample para forçar o iOS a usar o canal "Media"
      // Isso permite tocar o som mesmo se o interruptor físico lateral do iPhone/iPad (Silent Switch) estiver ativado.
      const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
      silentAudio.play().catch(() => {});
      
      console.log("Áudio destravado no iOS (Web Audio + Silent Switch bypass via botão).");
    } catch (e) {
      console.error("Erro ao destravar áudio no iOS:", e);
    }
  };

  const playSynthesizedSound = (type: "brown" | "rain") => {
    unlockMobileAudio();
    if (soundPlaying && activeSoundType === type) {
      stopSynthesizedSound();
      return;
    }

    if (soundPlaying) {
      stopSynthesizedSound();
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        const promise = ctx.resume();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => {});
        }
      }

      // Buffer otimizado de 2 segundos: loops perfeitos, geração 5x mais rápida e baixíssimo consumo de memória no celular
      const bufferSize = Math.floor(2 * ctx.sampleRate);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      if (type === "brown") {
        // Ruído Marrom: acumulador integrado para atenuar agudos
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        }
      } else {
        // Som de Chuva: Ruído rosa de base com pequenas perturbações simulando gotas batendo
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
          
          // Gotas esporádicas
          const drop = Math.random() > 0.9985 ? (Math.random() * 0.4) : 0;
          output[i] = (pink * 0.12) + drop;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      // Chuva tem um filtro levemente mais brilhante que o marrom profundo
      filter.frequency.value = type === "brown" ? 450 : 800;

      // Adiciona nó de Ganho explícito para controle ideal de volume e inicialização garantida
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.75, ctx.currentTime);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(0);
      noiseNodeRef.current = source;
      filterNodeRef.current = filter;
      setSoundPlaying(true);
      setActiveSoundType(type);
      triggerVibrate(100);
    } catch (err) {
      console.error("Erro ao tocar áudio sintetizado:", err);
    }
  };

  // ==========================================
  // COMPORTAMENTO DOS GATILHOS (Aleatoriedade Pura)
  // ==========================================
  const handleTriggerClick = (triggerId: string) => {
    setSelectedTriggerId(triggerId);
    setLoading(true);
    setAdviceText(null);

    // Tempo amigável de animação para transição e previsibilidade visual
    setTimeout(() => {
      const advices = ADVICE_DATABASE[triggerId];
      if (advices && advices.length > 0) {
        // Sorteia uma dica prática de forma puramente aleatória das 10 opções
        const randomIndex = Math.floor(Math.random() * advices.length);
        const advice = advices[randomIndex];
        setAdviceText(advice);

        // Define as recomendações automáticas de ferramentas com base no texto sorteado e tipo de gatilho
        setRecommendedTools(getRecommendationsForAdvice(advice, triggerId));
      }
      // Finaliza o carregamento da dica sorteada sem mover a tela
      setLoading(false);
    }, 450);
  };

  // ==========================================
  // JOGO MONÓTONO DE FORMAS (Repetitivo, sem pontuação, sem erros)
  // ==========================================
  const generateNewShapes = () => {
    const colors = ["bg-emerald-400", "bg-sky-400", "bg-teal-400", "bg-pink-400", "bg-amber-400", "bg-rose-400"];
    const types: ("circle" | "square")[] = ["circle", "square"];
    const newList = Array.from({ length: 6 }).map((_, idx) => ({
      id: Date.now() + idx,
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setGameShapes(newList);
  };

  const selectShape = (id: number) => {
    unlockMobileAudio();
    setSelectedShapeId(id);
    triggerVibrate(30);
  };

  const dropShapeInBin = (binType: "circle" | "square") => {
    unlockMobileAudio();
    if (selectedShapeId === null) return;
    const targetShape = gameShapes.find(s => s.id === selectedShapeId);
    if (!targetShape) return;

    if (targetShape.type === binType) {
      // ACERTOU! Toca som recompensador harmonioso se o som estiver ativo
      if (shapesSoundEnabled) {
        playShapeSuccessSound();
      }
      // Remove a forma correta
      setGameShapes(prev => prev.filter(s => s.id !== selectedShapeId));
      setSortedCount(c => c + 1);
      triggerVibrate(60);
      setSelectedShapeId(null);

      // Se limpar todas as formas, gera uma nova leva silenciosamente
      if (gameShapes.filter(s => s.id !== selectedShapeId).length === 0) {
        setTimeout(() => generateNewShapes(), 350);
      }
    } else {
      // ERROU! Toca som acústico suave e acolhedor (não punitivo)
      if (shapesSoundEnabled) {
        playShapeMismatchSound();
      }
      triggerVibrate([35, 45]);
    }
  };

  // Modo Pânico Sensorial
  const handleEnterPanicMode = () => {
    stopSynthesizedSound();
    setBreathingActive(false);
    setPanicMode(true);
    triggerVibrate([400, 200, 400]);

    // Tentar colocar em tela cheia se possível de forma limpa
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } catch (e) {}
  };

  const handleExitPanicMode = () => {
    setPanicMode(false);
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } catch (e) {}
  };

  return (
    <div 
      data-theme={currentTheme}
      className="min-h-screen bg-[#18181b] text-[#d4d4d8] app-theme-bg selection:bg-[#2dd4bf]/20 selection:text-[#2dd4bf] font-sans antialiased overflow-x-hidden transition-colors duration-300" 
      style={{ letterSpacing: "0.015em", lineHeight: "1.6" }}
    >
      
      {/* ============================================================================
          TELA DO MÓDULO 1.1: BOTÃO DE PÂNICO SENSORIAL ATIVO
          ============================================================================ */}
      {panicMode && (
        <div 
          onClick={handleExitPanicMode}
          className="fixed inset-0 bg-[#0c0c0e] z-[9999] flex flex-col items-center justify-center p-8 text-center cursor-pointer select-none"
        >
          <div className="space-y-8 max-w-lg">
            <p className="text-[#52525b] text-sm tracking-widest uppercase animate-pulse">MODO SILÊNCIO TOTAL ATIVO</p>
            <h2 className="text-3xl md:text-5xl font-light text-[#a1a1aa] tracking-widest transition-opacity duration-1000">
              Você está seguro.<br/>Respire.
            </h2>
            <div className="w-16 h-16 rounded-full border border-[#27272a] mx-auto flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#27272a] animate-ping"></div>
            </div>
            <p className="text-xs text-[#3f3f46]">Dê um toque em qualquer lugar para sair deste modo</p>
          </div>
        </div>
      )}

      {/* ============================================================================
          TELA DO MÓDULO 1.4: CARTÃO DE EMERGÊNCIA WEB (MODAL FULLSCREEN ALTO CONTRASTE)
          ============================================================================ */}
      {showEmergencyCard && (
        <div 
          className="fixed inset-0 bg-white text-black z-[9998] flex flex-col p-4 md:p-8 font-sans select-none overflow-hidden"
          onClick={() => setShowEmergencyCard(false)}
        >
          <div className="w-full flex justify-between items-center border-b-2 md:border-b-4 border-black pb-3 shrink-0">
            <span className="font-extrabold text-xl md:text-2xl tracking-tight text-black">CARTÃO DE AJUDA</span>
            <button className="bg-black text-white px-4 py-1.5 md:px-6 md:py-2 rounded-md font-bold text-sm md:text-base hover:bg-zinc-800 transition-colors">FECHAR</button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center py-4 max-w-4xl mx-auto space-y-4 md:space-y-6 overflow-hidden">
            <AlertOctagon className="w-12 h-12 md:w-20 md:h-20 text-black stroke-[2.5] shrink-0 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-black">
              Estou tendo uma crise de sobrecarga sensorial (TEA).
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-normal md:leading-relaxed text-zinc-950">
              Por favor, não me toque, não grite comigo e me dê alguns minutos em silêncio. Se puder, me guie até um lugar mais calmo.
            </p>
          </div>

          <div className="w-full text-center border-t-2 md:border-t-4 border-black pt-3 font-bold text-xs md:text-base shrink-0 text-zinc-700">
            Toque em qualquer área para voltar ao aplicativo • DesplugaTEA
          </div>
        </div>
      )}

      {/* BOTÕES FLUTUANTES DE EMERGÊNCIA (CARTÃO DE AJUDA E PÂNICO SENSORIAL) 
          Posicionados elevados (bottom-24) para evitar sobreposição com o cartão nativo do Netlify */}
      <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col gap-2.5">
        <button
          onClick={() => setShowEmergencyCard(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-2.5 rounded-lg shadow-2xl border border-rose-400/30 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-wider"
          title="Abrir cartão de ajuda rápida para as pessoas ao redor"
        >
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>Cartão de Ajuda</span>
        </button>
        <button
          onClick={handleEnterPanicMode}
          className="bg-zinc-950 hover:bg-black text-zinc-200 font-bold px-3.5 py-2.5 rounded-lg shadow-2xl border border-[#3f3f46] flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs uppercase tracking-wider"
          title="Isolar tudo instantaneamente na tela"
        >
          <EyeOff className="w-4 h-4 shrink-0" />
          <span>Pânico Sensorial</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* CABEÇALHO PRINCIPAL DO DESPLUGATEA */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[#27272a] pb-8">
          <div className="flex items-center gap-4">
            
            {/* Mascot SVG Plug Calmo */}
            <div className="w-16 h-16 bg-[#2dd4bf] mascot-badge rounded-lg flex items-center justify-center shadow-lg shadow-teal-950/40 shrink-0">
              <svg viewBox="0 0 100 100" className="w-10 h-10" aria-hidden="true">
                <rect x="25" y="30" width="50" height="40" rx="10" fill="#18181b" />
                <rect x="35" y="15" width="6" height="15" rx="2" fill="#18181b" />
                <rect x="59" y="15" width="6" height="15" rx="2" fill="#18181b" />
                <circle cx="42" cy="50" r="4" fill="#2dd4bf" />
                <circle cx="58" cy="50" r="4" fill="#2dd4bf" />
                <path d="M 45,60 Q 50,63 55,60" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-[#f4f4f5] tracking-tight leading-none">
                  DesplugaTEA
                </h1>
                <span className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Livre e Offline</span>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-1.5 font-medium">Seu refúgio digital descontraído para prevenção de crises e regulação de TEA e TDAH</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Seletor Rápido de Temas Neurodivergentes */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#27272a] rounded-md border border-[#3f3f46] text-xs">
              <span className="text-[#a1a1aa] font-medium text-[11px] hidden sm:inline">Tema:</span>
              <select
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value as ThemeId)}
                className="bg-transparent text-[#f4f4f5] font-bold text-xs outline-none cursor-pointer"
                aria-label="Selecionar tema de cores pastéis para fácil leitura"
              >
                <option value="sage" className="bg-[#e8eee9] text-[#1e3327]">🌿 Sálvia e Menta (Pastel)</option>
                <option value="sky" className="bg-[#e7edf2] text-[#1d3040]">☁️ Céu Empoeirado (Pastel)</option>
                <option value="lavender" className="bg-[#ece7f2] text-[#2b1f38]">🌸 Lavanda Serena (Pastel)</option>
                <option value="sand" className="bg-[#f0ebdf] text-[#332c22]">🌾 Areia e Papiro (Pastel)</option>
                <option value="dark" className="bg-[#18181b] text-[#f4f4f5]">🌙 Modo Escuro Alternativo</option>
              </select>
            </div>

            {/* Botão Guia Científico de Cores Pastéis */}
            <button
              onClick={() => setShowPaletteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-md border border-indigo-400/30 text-xs text-indigo-300 font-bold transition-all cursor-pointer"
              title="Abrir sugestões de cores pastéis e justificativa científica para neurodivergência"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-300" />
              <span>Cores Pastéis</span>
            </button>
          </div>
        </header>

        {/* NOTA DE CONSCIENTIZAÇÃO MÉDICA OBRIGATÓRIA */}
        <div className="bg-teal-950/15 border border-teal-500/25 rounded-lg p-4 flex gap-3 items-center text-xs md:text-sm text-teal-300">
          <Heart className="w-5 h-5 shrink-0 text-teal-400 fill-teal-400/10 animate-pulse" />
          <p className="leading-relaxed">
            <strong>Aviso de Carinho:</strong> Este aplicativo é um suporte complementar de regulação e não substitui tratamentos clínicos. 
            Recomendamos <strong>fortemente</strong> que você consulte e mantenha seu acompanhamento regular com seu <strong>psicólogo</strong> e seu <strong>médico psiquiatra</strong>! Eles são seus maiores aliados.
          </p>
        </div>

        {/* GRID DE GATILHOS INICIAIS */}
        <section className="space-y-4" aria-labelledby="triggers-title">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2dd4bf]" />
            <h2 id="triggers-title" className="text-xl font-bold text-[#f4f4f5] tracking-tight">
              O que está pesando no seu cérebro agora?
            </h2>
          </div>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Dê um clique suave em um dos gatilhos abaixo. O sistema sorteará uma dica e indicará qual ferramenta vai te ajudar mais!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleTriggerClick("som_alto")}
              className={`flex flex-col items-start p-5 rounded-lg border transition-all text-left group relative overflow-hidden outline-none focus:ring-2 focus:ring-[#2dd4bf]/40 ${
                selectedTriggerId === "som_alto"
                  ? "bg-[#134e4a]/20 border-[#2dd4bf] shadow-md shadow-teal-500/5"
                  : "bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46] hover:border-[#52525b]"
              }`}
            >
              <span className="text-3xl mb-3 select-none" aria-hidden="true">🔊</span>
              <span className="font-bold text-[#f4f4f5] text-base">Som Alto</span>
              <span className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">Muito barulho, conversas ou agitação ao redor.</span>
            </button>

            <button
              onClick={() => handleTriggerClick("luz_forte")}
              className={`flex flex-col items-start p-5 rounded-lg border transition-all text-left group relative overflow-hidden outline-none focus:ring-2 focus:ring-[#2dd4bf]/40 ${
                selectedTriggerId === "luz_forte"
                  ? "bg-[#134e4a]/20 border-[#2dd4bf] shadow-md shadow-teal-500/5"
                  : "bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46] hover:border-[#52525b]"
              }`}
            >
              <span className="text-3xl mb-3 select-none" aria-hidden="true">💡</span>
              <span className="font-bold text-[#f4f4f5] text-base">Luz Forte</span>
              <span className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">Lâmpadas frias, brilho ou reflexos excessivos.</span>
            </button>

            <button
              onClick={() => handleTriggerClick("excesso_info")}
              className={`flex flex-col items-start p-5 rounded-lg border transition-all text-left group relative overflow-hidden outline-none focus:ring-2 focus:ring-[#2dd4bf]/40 ${
                selectedTriggerId === "excesso_info"
                  ? "bg-[#134e4a]/20 border-[#2dd4bf] shadow-md shadow-teal-500/5"
                  : "bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46] hover:border-[#52525b]"
              }`}
            >
              <span className="text-3xl mb-3 select-none" aria-hidden="true">🧠</span>
              <span className="font-bold text-[#f4f4f5] text-base">Excesso de Informação</span>
              <span className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">Muitas demandas, notícias ou telas piscando.</span>
            </button>

            <button
              onClick={() => handleTriggerClick("mudanca_rotina")}
              className={`flex flex-col items-start p-5 rounded-lg border transition-all text-left group relative overflow-hidden outline-none focus:ring-2 focus:ring-[#2dd4bf]/40 ${
                selectedTriggerId === "mudanca_rotina"
                  ? "bg-[#134e4a]/20 border-[#2dd4bf] shadow-md shadow-teal-500/5"
                  : "bg-[#27272a] border-[#3f3f46] hover:bg-[#3f3f46] hover:border-[#52525b]"
              }`}
            >
              <span className="text-3xl mb-3 select-none" aria-hidden="true">🔄</span>
              <span className="font-bold text-[#f4f4f5] text-base">Mudança de Rotina</span>
              <span className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">Quebra inesperada de planos e caminhos do dia.</span>
            </button>
          </div>
        </section>

        {/* ÁREA DE REFÚGIO E DICAS DE DESCOMPRESSÃO */}
        <section id="refugio-box" className="scroll-mt-8">
          <div className="bg-[#134e4a]/10 border border-[#2dd4bf]/20 rounded-xl p-6 md:p-8 relative overflow-hidden min-h-[220px] flex flex-col justify-between">
            
            {/* Decoração sutil de fundo */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none select-none" aria-hidden="true">
              <Sparkle className="w-32 h-32 text-[#2dd4bf]" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2dd4bf] uppercase tracking-widest">Sua Dica Segura Sorteada</span>
                {selectedTriggerId && (
                  <button 
                    onClick={() => handleTriggerClick(selectedTriggerId)}
                    className="text-xs text-[#2dd4bf] hover:text-teal-300 transition-colors flex items-center gap-1.5 bg-[#2dd4bf]/10 px-2.5 py-1.5 rounded-md border border-[#2dd4bf]/25 cursor-pointer font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Sortear Outra Dica
                  </button>
                )}
              </div>

              <div className="min-h-[100px] flex items-center">
                {loading ? (
                  <div className="flex items-center gap-3 animate-pulse text-zinc-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Sintonizando frequências de calma no banco de dados local...</span>
                  </div>
                ) : adviceText ? (
                  <p className="text-lg md:text-xl text-[#f4f4f5] font-light leading-relaxed italic">
                    "{adviceText}"
                  </p>
                ) : (
                  <p className="text-lg md:text-xl text-[#a1a1aa] font-light leading-relaxed italic">
                    "Tudo calmo por aqui. Escolha um dos 4 gatilhos acima para carregar na hora dicas práticas e ferramentas de apoio sensorial!"
                  </p>
                )}
              </div>

              {/* Recomendação de Ferramentas */}
              {adviceText && recommendedTools.length > 0 && (
                <div className="pt-4 border-t border-[#2dd4bf]/10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs">
                  <span className="text-[#a1a1aa] font-medium shrink-0">Ferramentas recomendadas para este caso:</span>
                  <div className="flex flex-wrap gap-2">
                    {recommendedTools.map((tool) => {
                      let bg = "bg-sky-500/10 border-sky-400/30 text-sky-300 hover:bg-sky-500/20";
                      let text = "🔊 Mascarador de Som";
                      let targetId = "sound-tool";
                      
                      if (tool === "grounding") {
                        bg = "bg-teal-500/15 border-teal-400/40 text-teal-300 hover:bg-teal-500/25";
                        text = "⚓ Ancoragem 5-4-3-2-1";
                        targetId = "grounding-tool";
                      } else if (tool === "breath") {
                        bg = "bg-emerald-500/10 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/20";
                        text = "🎈 Respiração 4-4-4";
                        targetId = "breathing-tool";
                      } else if (tool === "popit") {
                        bg = "bg-pink-500/10 border-pink-400/30 text-pink-300 hover:bg-pink-500/20";
                        text = "🟢 Pop-it Sensorial";
                        targetId = "popit-tool";
                      } else if (tool === "shapes") {
                        bg = "bg-teal-500/10 border-teal-400/30 text-teal-300 hover:bg-teal-500/20";
                        text = "🧩 Organizador de Formas";
                        targetId = "shapes-tool";
                      } else if (tool === "predictability") {
                        bg = "bg-indigo-500/10 border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/20";
                        text = "🧭 Previsibilidade Motora";
                        targetId = "motor-predictability-tool";
                      }
                      
                      return (
                        <button
                          key={tool}
                          onClick={() => handleNavigateToTool(targetId)}
                          className={`px-3 py-1.5 rounded-full font-bold border transition-all duration-300 cursor-pointer flex items-center gap-1 text-[11px] ${bg}`}
                          title="Clique para ir até a ferramenta"
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ============================================================================
            MÓDULO 1: FERRAMENTAS PARA MOMENTOS DE DESREGULAÇÃO (CRISE)
            ============================================================================ */}
        <section className="space-y-6" aria-labelledby="crisis-tools-title">
          <div className="flex items-center gap-2 border-t border-[#27272a] pt-8">
            <AlertOctagon className="w-5 h-5 text-rose-400" />
            <h2 id="crisis-tools-title" className="text-xl font-bold text-[#f4f4f5] tracking-tight">
              Módulo 1: Suporte Rápido para Crise e Desregulação
            </h2>
          </div>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Dispositivos de ação imediata para blindar seus sentidos e descarregar sobrecarga motora, pânico ou ansiedade profunda.
          </p>

          {/* TÉCNICA PRINCIPAL DE ANCORAGEM SENSORIAL 5-4-3-2-1 */}
          <GroundingTool onNavigateToTool={handleNavigateToTool} triggerVibrate={triggerVibrate} />

          {/* OUTRAS FERRAMENTAS DE ALÍVIO RÁPIDO */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2dd4bf]" />
              <span>Outras Ferramentas de Alívio Imediato</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* 1. Guia de Respiração Háptica e Visual (4-4-4) */}
            <div id="breathing-tool" className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-5 flex flex-col justify-between min-h-[300px] transition-all duration-500">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Wind className="w-5 h-5" />
                  <h3 className="font-bold text-base text-[#f4f4f5]">Respiração Tátil 4-4-4</h3>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Inspire (4s), segure (4s) e expire (4s). O celular emite vibrações leves para conduzir você de olhos fechados!
                </p>
              </div>

              {/* Animação do Balão */}
              <div className="h-28 flex items-center justify-center relative">
                <div className="absolute w-12 h-12 rounded-full border border-dashed border-[#3f3f46]" aria-hidden="true"></div>
                <div 
                  className={`rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform ${
                    breathingActive 
                      ? "bg-emerald-500/20 border border-emerald-400 text-emerald-200" 
                      : "bg-[#18181b] border border-[#3f3f46] text-[#a1a1aa]"
                  }`}
                  style={{
                    width: "56px",
                    height: "56px",
                    transform: !breathingActive 
                      ? "scale(1.0)" 
                      : breathingCounter < 4 
                        ? "scale(1.6)" // Inalação
                        : breathingCounter < 8 
                          ? "scale(1.6)" // Segurando cheio
                          : "scale(1.0)", // Exalação
                    transition: breathingActive 
                      ? breathingCounter === 0 || breathingCounter === 8 
                        ? "transform 4000ms cubic-bezier(0.4, 0, 0.2, 1)" 
                        : "transform 1000ms ease-in-out"
                      : "transform 1000ms ease-out",
                  }}
                  aria-hidden="true"
                >
                  {breathingActive ? (
                    <div className="text-[10px] font-bold leading-none uppercase">
                      {breathingCounter < 4 && "Inale"}
                      {breathingCounter >= 4 && breathingCounter < 8 && "Segure"}
                      {breathingCounter >= 8 && "Exale"}
                      <div className="text-xs mt-1">
                        {breathingCounter < 4 && (4 - breathingCounter)}
                        {breathingCounter >= 4 && breathingCounter < 8 && (8 - breathingCounter)}
                        {breathingCounter >= 8 && (12 - breathingCounter)}s
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold uppercase">Off</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setBreathingActive(!breathingActive)}
                className={`w-full py-3 rounded-md font-bold text-xs tracking-wider uppercase transition-all outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer ${
                  breathingActive
                    ? "bg-[#18181b] hover:bg-[#1f1f23] text-zinc-300 border border-[#3f3f46]"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {breathingActive ? "Pausar Respiração" : "Iniciar Respiração"}
              </button>
            </div>

            {/* 2. Fidget Digital Estoura Bolhas e Pop-it (Interativo com Linha Partida) */}
            <BubblePopper onVibrate={triggerVibrate} />

            {/* 3. Gerador de Ruído Marrom Nofail (Web Audio API) */}
            <div id="sound-tool" className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-5 flex flex-col justify-between min-h-[300px] transition-all duration-500">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sky-300">
                  <Volume2 className="w-5 h-5" />
                  <h3 className="font-bold text-base text-[#f4f4f5]">Mascarador de Som</h3>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Sons graves sintetizados localmente no seu aparelho para bloquear gritos, trânsito e conversas externas.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center my-3 gap-2">
                {soundPlaying && activeSoundType ? (
                  <div className="flex items-center gap-1.5 h-10" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-[#2dd4bf] rounded-full animate-pulse"
                        style={{
                          height: `${12 + Math.sin(i + Date.now()) * 14}px`,
                          animationDuration: `${0.9 + i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#a1a1aa] italic py-4">Sem som ativo</div>
                )}
                <span className="text-[10px] text-zinc-500 font-mono">100% OFFLINE • WEB AUDIO</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    unlockAudio();
                    playSynthesizedSound("brown");
                  }}
                  className={`py-3 rounded-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    activeSoundType === "brown" && soundPlaying
                      ? "bg-sky-500/20 text-sky-300 border-sky-400"
                      : "bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border-[#3f3f46]"
                  }`}
                >
                  Ruído Marrom
                </button>
                <button
                  onClick={() => {
                    unlockAudio();
                    playSynthesizedSound("rain");
                  }}
                  className={`py-3 rounded-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    activeSoundType === "rain" && soundPlaying
                      ? "bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]"
                      : "bg-[#18181b] hover:bg-zinc-800 text-zinc-300 border-[#3f3f46]"
                  }`}
                >
                  Chuva Pesada
                </button>
              </div>

              {soundPlaying && (
                <button
                  onClick={stopSynthesizedSound}
                  className="w-full py-2 bg-rose-950/20 hover:bg-rose-950/30 text-rose-300 border border-rose-500/30 rounded-md font-bold text-xs uppercase tracking-wider cursor-pointer mt-2"
                >
                  Desligar Áudio
                </button>
              )}

              {/* Dica amigável de compatibilidade móvel */}
              <div className="mt-4 p-3 bg-[#18181b]/60 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                <span className="text-amber-400 shrink-0 mt-0.5">💡</span>
                <p className="leading-relaxed">
                  <strong>Dica de Áudio no Celular:</strong> Se não ouvir o som, certifique-se de desativar a chave física de silenciar (modo silencioso lateral do iPhone/iPad) e aumente o volume de mídia do seu aparelho.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* ============================================================================
            MÓDULO 2: FERRAMENTAS PARA MOMENTOS DE DESCOMPRESSÃO (MANUTENÇÃO)
            ============================================================================ */}
        <section className="space-y-6" aria-labelledby="maint-tools-title">
          <div className="flex items-center gap-2 border-t border-[#27272a] pt-8">
            <Heart className="w-5 h-5 text-emerald-400" />
            <h2 id="maint-tools-title" className="text-xl font-bold text-[#f4f4f5] tracking-tight">
              Módulo 2: Descompressão e Manutenção Diária
            </h2>
          </div>
          <p className="text-xs text-[#a1a1aa] leading-relaxed">
            Exercícios e mecanismos visuais para prevenir a sobrecarga antes que ela ocorra, ajudando a organizar o dia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* A. MEDIDOR DE BATERIA CORPORAL (Check-in) */}
            <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between min-h-[320px]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300">
                  <Battery className="w-5 h-5" />
                  <h3 className="font-bold text-base text-[#f4f4f5]">Como está sua Bateria Corporal?</h3>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Arraste o botão para registrar sua energia agora. Daremos sugestões e deixaremos salvo!
                </p>
              </div>

              <div className="my-6 space-y-4">
                {/* Desenho da Bateria */}
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-24 h-12 bg-slate-950 border-2 border-zinc-700 rounded-lg p-1 flex relative">
                    <div 
                      className={`h-full rounded transition-all duration-500 ${
                        batteryLevel > 60 
                          ? "bg-emerald-400" 
                          : batteryLevel > 30 
                            ? "bg-amber-400" 
                            : "bg-rose-500"
                      }`}
                      style={{ width: `${batteryLevel}%` }}
                    />
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-1.5 h-4 bg-zinc-700 rounded-r" />
                  </div>
                  <span className="text-2xl font-black text-[#f4f4f5] font-mono">{batteryLevel}%</span>
                </div>

                {/* Input Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={batteryLevel}
                  onChange={(e) => handleBatteryChange(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-[#2dd4bf]"
                />
              </div>

              {/* Sugestão de Acordo com a Bateria */}
              <div className="bg-slate-950/60 p-3 rounded border border-zinc-800 text-xs leading-relaxed text-[#d4d4d8]">
                {batteryLevel > 70 && (
                  <span>🔋 <strong>Bateria excelente!</strong> Seus níveis de energia estão maravilhosos. Lembre-se de fazer pausas preventivas com seu psicólogo para não esgotar!</span>
                )}
                {batteryLevel <= 70 && batteryLevel > 30 && (
                  <span>⚡ <strong>Energia mediana.</strong> Seu cérebro está trabalhando bastante. Que tal usar nosso Pop-it por 2 minutos para aliviar as tensões acumuladas?</span>
                )}
                {batteryLevel <= 30 && (
                  <span>⚠️ <strong>Alerta de bateria fraca!</strong> Você está na zona de risco de crise. Desligue os sons agora, acione nosso Som de Chuva ou entre em modo silêncio!</span>
                )}
              </div>
            </div>

            {/* B. TEMPORIZADOR VISUAL DE PREENCHIMENTO DE COR */}
            <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-6 flex flex-col justify-between min-h-[320px]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sky-300">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-bold text-base text-[#f4f4f5]">Timer de Descompressão Visual</h3>
                </div>
                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Para acalmar a ansiedade de relógios normais, esta barra drena a cor de forma suave e silenciosa, sem números piscando de forma frenética.
                </p>
              </div>

              {/* Seletor de tempo rápido */}
              <div className="flex gap-2 justify-center my-3">
                {[60, 180, 300, 600].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setTimerDuration(sec);
                      setTimerSecondsLeft(sec);
                      setTimerActive(false);
                      triggerVibrate(50);
                    }}
                    className={`px-3 py-1 text-xs rounded border transition-all cursor-pointer ${
                      timerDuration === sec 
                        ? "bg-[#2dd4bf]/20 border-[#2dd4bf] text-[#2dd4bf] font-bold" 
                        : "bg-slate-950 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {sec / 60} min
                  </button>
                ))}
              </div>

              {/* Barra de preenchimento SVG do Timer */}
              <div className="w-full bg-slate-950 h-6 rounded-full border border-zinc-800 overflow-hidden relative flex items-center">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-[#2dd4bf] transition-all duration-1000 ease-linear"
                  style={{ width: `${(timerSecondsLeft / timerDuration) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono tracking-widest text-[#f4f4f5] bg-blend-difference">
                  {timerActive ? "DESCOMPRESSÃO ATIVA" : "PAUSADO / TOQUE PARA INICIAR"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className={`py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    timerActive 
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                      : "bg-[#2dd4bf]/10 hover:bg-[#2dd4bf]/20 text-[#2dd4bf] border-[#2dd4bf]/30"
                  }`}
                >
                  {timerActive ? "Pausar" : "Iniciar Timer"}
                </button>
                <button
                  onClick={() => {
                    setTimerSecondsLeft(timerDuration);
                    setTimerActive(false);
                    triggerVibrate(100);
                  }}
                  className="py-2.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700 rounded font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Resetar
                </button>
              </div>
            </div>

            {/* C. PREVISIBILIDADE MOTORA E RITMO (JOGO DE ANTECIPAÇÃO E TRILHA CONTÍNUA) */}
            <MotorPredictabilityTool onVibrate={triggerVibrate} />

            {/* D. JOGO DE ORGANIZAÇÃO REPETITIVA (Monótono e Relaxante) */}
            <div id="shapes-tool" className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-4 sm:p-6 flex flex-col justify-between min-h-[340px] transition-all duration-500">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Layers className="w-5 h-5" />
                    <h3 className="font-bold text-base text-[#f4f4f5]">Organizador de Formas Monótono</h3>
                  </div>

                  {/* Controle de Som do Jogo com Opção de Desligar */}
                  <button
                    onClick={toggleShapesSound}
                    onPointerDown={() => unlockMobileAudio()}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border cursor-pointer select-none ${
                      shapesSoundEnabled
                        ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-zinc-850 hover:bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                    title={shapesSoundEnabled ? "Desativar sons de acerto e erro" : "Ativar sons de acerto e erro"}
                    aria-label={shapesSoundEnabled ? "Desativar sons do jogo" : "Ativar sons do jogo"}
                  >
                    {shapesSoundEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sons Ativos</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span>Mudo</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-[#a1a1aa] leading-relaxed">
                  Clique em uma forma geométrica e depois clique no seu depósito correspondente. Sem tempo limite, sem pressa, apenas paz e simetria!
                </p>
              </div>

              {/* Área de Jogo */}
              <div className="bg-slate-950 p-3 sm:p-4 rounded-lg border border-zinc-800 my-3 sm:my-4 flex flex-col gap-3 sm:gap-4">
                
                {/* Fileira de Formas Bagunçadas */}
                <div className="flex justify-center gap-2 sm:gap-4 min-h-[44px] items-center flex-wrap">
                  {gameShapes.length === 0 ? (
                    <span className="text-[11px] text-[#2dd4bf] animate-pulse">Organização concluída! Gerando mais...</span>
                  ) : (
                    gameShapes.map((shape) => (
                      <button
                        key={shape.id}
                        onClick={() => selectShape(shape.id)}
                        onPointerDown={() => unlockMobileAudio()}
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-all border outline-none cursor-pointer flex items-center justify-center shrink-0 ${shape.color} ${
                          shape.type === "circle" ? "rounded-full" : "rounded-md"
                        } ${selectedShapeId === shape.id ? "ring-2 sm:ring-4 ring-[#2dd4bf] scale-110" : "opacity-80"}`}
                        aria-label={`Forma ${shape.type} de cor ${shape.color}`}
                      />
                    ))
                  )}
                </div>

                {/* Depósitos de Destino */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 border-t border-zinc-800/80 pt-3">
                  <button
                    onClick={() => dropShapeInBin("circle")}
                    onPointerDown={() => unlockMobileAudio()}
                    disabled={selectedShapeId === null}
                    className="deposit-bin-btn p-2 sm:p-3 bg-zinc-900 hover:bg-zinc-850 rounded border border-zinc-800 text-[10px] sm:text-xs flex flex-col items-center gap-1.5 sm:gap-2 text-zinc-300 disabled:opacity-40 cursor-pointer"
                  >
                    <div className="deposit-shape-icon w-7 h-7 sm:w-8 sm:h-8 rounded-full border-[2.5px] border-solid border-zinc-200 bg-zinc-900" />
                    <span className="font-semibold text-zinc-200">Depósito dos Círculos</span>
                  </button>

                  <button
                    onClick={() => dropShapeInBin("square")}
                    onPointerDown={() => unlockMobileAudio()}
                    disabled={selectedShapeId === null}
                    className="deposit-bin-btn p-2 sm:p-3 bg-zinc-900 hover:bg-zinc-850 rounded border border-zinc-800 text-[10px] sm:text-xs flex flex-col items-center gap-1.5 sm:gap-2 text-zinc-300 disabled:opacity-40 cursor-pointer"
                  >
                    <div className="deposit-shape-icon w-7 h-7 sm:w-8 sm:h-8 rounded-md border-[2.5px] border-solid border-zinc-200 bg-zinc-900" />
                    <span className="font-semibold text-zinc-200">Depósito dos Quadrados</span>
                  </button>
                </div>
              </div>

              {/* Contador de Formas Organizadas de Forma Leve */}
              <div className="flex justify-between items-center text-[10px] text-zinc-500">
                <span>{sortedCount} formas ordenadas com sucesso</span>
                <button 
                  onClick={generateNewShapes}
                  className="text-[#2dd4bf] font-bold hover:underline cursor-pointer"
                >
                  Embaralhar Tudo
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* FOOTER DA APLICAÇÃO */}
        <footer className="mt-8 border-t border-[#27272a] pt-8 text-center text-xs text-[#a1a1aa] leading-relaxed max-w-lg mx-auto space-y-4">
          <p>
            O <strong>DesplugaTEA</strong> foi desenvolvido com base em padrões de acessibilidade cognitiva recomendados em diretrizes internacionais para o Transtorno do Espectro Autista.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-zinc-400">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Licença MIT
            </span>
            <span>•</span>
            <span>Código Aberto para a Comunidade no GitHub</span>
          </div>
          <p className="text-[#52525b]">
            Diga não ao preconceito, apoie a diversidade neurológica. Siga firme no acompanhamento com profissionais da psicologia e psiquiatria.
          </p>
        </footer>

      </div>

      {/* MODAL COM SUGESTÃO DE CORES PASTÉIS E JUSTIFICATIVA NEUROLÓGICA (WCAG AAA) */}
      <PastelPaletteModal
        isOpen={showPaletteModal}
        onClose={() => setShowPaletteModal(false)}
        currentTheme={currentTheme}
        onSelectTheme={(t) => setCurrentTheme(t)}
      />
    </div>
  );
}
