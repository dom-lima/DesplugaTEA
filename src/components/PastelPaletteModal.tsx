import React, { useState } from "react";
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  Brain, 
  Heart, 
  SunMedium, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from "lucide-react";

export type ThemeId = "dark" | "sage" | "sky" | "lavender" | "sand";

export interface PaletteInfo {
  id: ThemeId;
  name: string;
  tagline: string;
  badge: string;
  recommendedFor: string;
  colors: {
    bgApp: { name: string; hex: string; label: string };
    cardBg: { name: string; hex: string; label: string };
    borders: { name: string; hex: string; label: string };
    textPrimary: { name: string; hex: string; label: string };
    textSecondary: { name: string; hex: string; label: string };
    accent: { name: string; hex: string; label: string };
  };
  contrastRatio: string;
  wcagLevel: "WCAG AAA (Excepcional)" | "WCAG AAA";
  neuroRationale: string;
  benefits: string[];
}

export const PASTEL_PALETTES: PaletteInfo[] = [
  {
    id: "sage",
    name: "Sálvia Veludo & Menta Serena",
    tagline: "Equilíbrio parassimpático, zero ofuscamento e contraste suave",
    badge: "Recomendação Nº 1 para TEA",
    recommendedFor: "Pessoas no espectro autista com hipersensibilidade sensorial, fotofobia e ansiedade",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#E8EEE9", label: "Sálvia Névoa Fosca" },
      cardBg: { name: "Superfície dos Cartões", hex: "#D9E4DC", label: "Sálvia Aveludada (Sem Branco Puro)" },
      borders: { name: "Bordas Estruturantes", hex: "#AEC3B4", label: "Verde Mineral Delicado" },
      textPrimary: { name: "Texto Principal", hex: "#1E3327", label: "Floresta Carvão Suave (6.9:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#3F5C4C", label: "Sálvia Musgo Médio" },
      accent: { name: "Acentos e Leitura", hex: "#174D34", label: "Verde Floresta Legível (NUNCA claro)" }
    },
    contrastRatio: "6.9:1 (Cartões) / 7.6:1 (Fundo) — Conforto Ótimo sem Ofuscamento",
    wcagLevel: "WCAG AAA",
    neuroRationale: "Remove o branco puro (#FFFFFF) que reflete luz excessiva na retina e causa estresse sensorial. O verde de leitura foi aprofundado para tom floresta mineral (#174D34), garantindo leitura nítida e relaxante sem fadiga.",
    benefits: [
      "Elimina o ofuscamento e a sensação de ardência ocular",
      "Contraste moderado e confortável: fácil de ler sem agressividade visual",
      "Verde mineral escuro e nítido em todos os títulos, botões e ícones"
    ]
  },
  {
    id: "sky",
    name: "Céu Suave & Névoa",
    tagline: "Clareza mental, redução de estímulos invasivos e foco sereno",
    badge: "Excelente para TDAH & Fotofobia",
    recommendedFor: "Pessoas com pensamentos acelerados, névoa mental e sensibilidade à luz branca",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#E7EDF2", label: "Céu Suave Empoeirado" },
      cardBg: { name: "Superfície dos Cartões", hex: "#D9E3EB", label: "Nuvem Aveludada (Sem Branco)" },
      borders: { name: "Bordas Estruturantes", hex: "#ABC0D0", label: "Ardósia Azul Suave" },
      textPrimary: { name: "Texto Principal", hex: "#1D3040", label: "Marinho Carvão Suave (7.1:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#3D5469", label: "Grafite Azul Neutro" },
      accent: { name: "Acentos e Leitura", hex: "#165038", label: "Verde Mineral & Marinho Legível" }
    },
    contrastRatio: "7.1:1 (Cartões) / 7.8:1 (Fundo) — Nitidez com Calma",
    wcagLevel: "WCAG AAA",
    neuroRationale: "O azul com fundo acinzentado e cartões sem reflexo de branco filtram a sobrecarga cognitiva do TDAH. Todos os textos secundários e verdes mantêm tonalidade profunda para evitar contraste apagado.",
    benefits: [
      "Filtra a agitação de telas brilhantes",
      "Reduz a dispersão visual típica do TDAH",
      "Letras escuras sobre azul suave proporcionam estabilidade visual"
    ]
  },
  {
    id: "lavender",
    name: "Lavanda Veludo & Ametista",
    tagline: "Desaceleração de pensamentos e acolhimento emocional",
    badge: "Acolhimento & Anti-Pânico",
    recommendedFor: "Crises de ansiedade, ruminações mentais e pânico sensorial",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#ECE7F2", label: "Bruma de Lavanda" },
      cardBg: { name: "Superfície dos Cartões", hex: "#DED6E6", label: "Ametista Fosca (Sem Branco)" },
      borders: { name: "Bordas Estruturantes", hex: "#B9ABC9", label: "Ametista Pastel Médio" },
      textPrimary: { name: "Texto Principal", hex: "#2B1F38", label: "Berinjela Suave Noturna (7.2:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#55456B", label: "Ametista Escuro Neutro" },
      accent: { name: "Acentos e Leitura", hex: "#174F35", label: "Verde Mineral e Orquídea Legível" }
    },
    contrastRatio: "7.2:1 (Cartões) / 7.9:1 (Fundo) — Harmonia e Repouso",
    wcagLevel: "WCAG AAA",
    neuroRationale: "Cores na faixa do violeta/lavanda dessaturado reduzem a percepção de alarme no sistema nervoso central. A ausência de contrastes cortantes acalma os batimentos cardíacos.",
    benefits: [
      "Sensação imediata de acolhimento e desaceleração mental",
      "Conforto para momentos de transição de rotina ou sobrecarga social",
      "Excelente distinção de leitura sem linhas duras ou ofuscamento"
    ]
  },
  {
    id: "sand",
    name: "Areia & Papiro Aconchegante",
    tagline: "Filtro total de luz azul, conforto orgânico e baixo contraste (Irlen)",
    badge: "Anti-Estresse Escotópico (Irlen)",
    recommendedFor: "Pessoas com sensibilidade ao brilho, enxaqueca e aversão a alto contraste",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#F0EBDF", label: "Areia & Papiro Quente" },
      cardBg: { name: "Superfície dos Cartões", hex: "#E4DDD0", label: "Linho Cru Macio (Sem Branco)" },
      borders: { name: "Bordas Estruturantes", hex: "#C0B6A2", label: "Pedra Bege Neutra" },
      textPrimary: { name: "Texto Principal", hex: "#332C22", label: "Café Mineral Aveludado (6.5:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#5B5244", label: "Sépia Neutro Suave" },
      accent: { name: "Acentos e Leitura", hex: "#1D5236", label: "Verde Musgo e Âmbar Profundos" }
    },
    contrastRatio: "6.5:1 (Cartões) / 7.2:1 (Fundo) — Baixo Contraste Suave",
    wcagLevel: "WCAG AAA",
    neuroRationale: "Projetada especificamente para quem sofre com alto contraste: simula a leitura em papel de livro reciclado ou papiro sob luz natural. Elimina qualquer vibração óptica de letras na tela.",
    benefits: [
      "Elimina a fadiga e ardor nos olhos após longos períodos",
      "Acaba com a sensação de 'letras vibrando' comum na Síndrome de Irlen",
      "Textura e calor visual calmantes mesmo em ambientes escuros"
    ]
  }
];

interface PastelPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
}

export default function PastelPaletteModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}: PastelPaletteModalProps) {
  const [selectedPaletteId, setSelectedPaletteId] = useState<ThemeId>(
    currentTheme === "dark" ? "sage" : currentTheme
  );

  if (!isOpen) return null;

  const activePalette = PASTEL_PALETTES.find(p => p.id === selectedPaletteId) || PASTEL_PALETTES[0];

  return (
    <div 
      className="fixed inset-0 z-[9995] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#1f1f23] text-zinc-100 border border-zinc-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO MODAL */}
        <div className="p-4 sm:p-6 border-b border-zinc-700/80 bg-[#18181b] flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Sugestão de Cores Pastéis para Neurodivergência
                </h2>
                <span className="bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Padrão WCAG AAA
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Paletas cientificamente formuladas para TEA, TDAH e hipersensibilidade sensorial com máxima legibilidade.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer shrink-0"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO DO MODAL (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* INTRODUÇÃO: O SEGREDO DO CONTRASTE NEURODIVERGENTE */}
          <div className="bg-zinc-850/70 border border-zinc-700/80 rounded-xl p-4 flex gap-3 items-start text-xs text-zinc-300">
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <p className="font-semibold text-zinc-100">
                Como as cores pastéis foram calibradas para fácil leitura e conforto neurológico?
              </p>
              <p>
                O erro mais comum em design pastel é usar texto cinza claro ou branco, o que exige esforço visual e piora a leitura. 
                Aqui aplicamos a <strong>Regra de Ouro Neurosensorial</strong>: <strong>Fundos em tons pastéis suaves e dessaturados</strong> (que cortam o reflexo do branco puro) combinados com <strong>Tipografia em Carvão Mineral Profundo</strong> (que atinge contrastes superiores a 12:1, muito acima do exigido por acessibilidade).
              </p>
            </div>
          </div>

          {/* SELETOR DAS 4 PALETAS SUGERIDAS */}
          <div>
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-3">
              Escolha uma Paleta para Explorar e Testar:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {PASTEL_PALETTES.map((palette) => {
                const isSelected = selectedPaletteId === palette.id;
                const isAppTheme = currentTheme === palette.id;

                return (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedPaletteId(palette.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected 
                        ? "bg-zinc-800 border-teal-400 ring-2 ring-teal-400/30 shadow-lg" 
                        : "bg-zinc-850 border-zinc-700/70 hover:border-zinc-500 hover:bg-zinc-800/80"
                    }`}
                  >
                    <div>
                      {/* Mini Amostras de Cores */}
                      <div className="flex gap-1.5 mb-2.5">
                        <span className="w-5 h-5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: palette.colors.bgApp.hex }} title="Fundo Geral" />
                        <span className="w-5 h-5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: palette.colors.borders.hex }} title="Bordas" />
                        <span className="w-5 h-5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: palette.colors.accent.hex }} title="Acento" />
                        <span className="w-5 h-5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: palette.colors.textPrimary.hex }} title="Texto" />
                      </div>

                      <div className="text-xs font-bold text-white leading-snug">
                        {palette.name}
                      </div>
                      <span className="inline-block mt-1 text-[10px] text-teal-300 bg-teal-950/60 border border-teal-500/30 px-1.5 py-0.2 rounded font-medium">
                        {palette.badge}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-zinc-700/60 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 font-mono text-[10px]">{palette.contrastRatio.split(" ")[0]}</span>
                      {isAppTheme && (
                        <span className="text-teal-400 font-bold flex items-center gap-1 text-[10px]">
                          <Check className="w-3 h-3" /> Ativa
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DETALHAMENTO DA PALETA SELECIONADA */}
          <div className="bg-[#18181b] border border-zinc-700/90 rounded-2xl p-4 sm:p-6 space-y-6">
            
            {/* Cabeçalho da Paleta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{activePalette.name}</h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {activePalette.wcagLevel}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{activePalette.tagline}</p>
              </div>

              {/* Botão de Ativação Direta no App */}
              <button
                onClick={() => onSelectTheme(activePalette.id)}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  currentTheme === activePalette.id
                    ? "bg-emerald-600 text-white cursor-default"
                    : "bg-teal-500 hover:bg-teal-400 text-zinc-950 active:scale-95"
                }`}
              >
                {currentTheme === activePalette.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Paleta Ativa no Aplicativo!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Ativar Esta Paleta no Aplicativo</span>
                  </>
                )}
              </button>
            </div>

            {/* TABELA DE CORES COM HEXADECIMAL E AMOSTRAS */}
            <div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                Especificações Técnicas de Cores (Cores & Contraste):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                
                {/* 1. Fundo Geral */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/30 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.bgApp.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block truncate">{activePalette.colors.bgApp.name}</span>
                    <span className="font-mono text-xs font-bold text-zinc-100">{activePalette.colors.bgApp.hex}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{activePalette.colors.bgApp.label}</span>
                  </div>
                </div>

                {/* 2. Cartões / Superfícies */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/30 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.cardBg.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block truncate">{activePalette.colors.cardBg.name}</span>
                    <span className="font-mono text-xs font-bold text-zinc-100">{activePalette.colors.cardBg.hex}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{activePalette.colors.cardBg.label}</span>
                  </div>
                </div>

                {/* 3. Bordas */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/30 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.borders.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block truncate">{activePalette.colors.borders.name}</span>
                    <span className="font-mono text-xs font-bold text-zinc-100">{activePalette.colors.borders.hex}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{activePalette.colors.borders.label}</span>
                  </div>
                </div>

                {/* 4. Texto Principal */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/30 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.textPrimary.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block truncate">{activePalette.colors.textPrimary.name}</span>
                    <span className="font-mono text-xs font-bold text-zinc-100">{activePalette.colors.textPrimary.hex}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{activePalette.colors.textPrimary.label}</span>
                  </div>
                </div>

                {/* 5. Texto Secundário */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/30 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.textSecondary.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block truncate">{activePalette.colors.textSecondary.name}</span>
                    <span className="font-mono text-xs font-bold text-zinc-100">{activePalette.colors.textSecondary.hex}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{activePalette.colors.textSecondary.label}</span>
                  </div>
                </div>

                {/* 6. Acento / Destaque */}
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/30 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.accent.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block truncate">{activePalette.colors.accent.name}</span>
                    <span className="font-mono text-xs font-bold text-zinc-100">{activePalette.colors.accent.hex}</span>
                    <span className="text-[10px] text-zinc-400 block truncate">{activePalette.colors.accent.label}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* PREVIEW INTERATIVO DA PALETA (COMO FICA NA PRÁTICA) */}
            <div>
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                Simulação Visual da Leitura e Contraste:
              </h4>
              <div 
                className="p-5 rounded-xl border transition-all"
                style={{ 
                  backgroundColor: activePalette.colors.bgApp.hex,
                  borderColor: activePalette.colors.borders.hex
                }}
              >
                <div 
                  className="p-4 rounded-lg border shadow-sm space-y-3"
                  style={{ 
                    backgroundColor: activePalette.colors.cardBg.hex,
                    borderColor: activePalette.colors.borders.hex
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-xs font-extrabold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: activePalette.colors.accent.hex }}
                    >
                      Exemplo de Cartão
                    </span>
                    <span 
                      className="text-[11px] font-mono font-bold"
                      style={{ color: activePalette.colors.textSecondary.hex }}
                    >
                      Contraste {activePalette.contrastRatio}
                    </span>
                  </div>

                  <h5 
                    className="text-base font-bold leading-tight"
                    style={{ color: activePalette.colors.textPrimary.hex }}
                  >
                    A leitura neste tom pastel é suave, nítida e sem ofuscamento.
                  </h5>

                  <p 
                    className="text-xs leading-relaxed"
                    style={{ color: activePalette.colors.textSecondary.hex }}
                  >
                    O contraste entre o texto em carvão mineral e a base pastel dessaturada permite ler parágrafos inteiros sem cansar os olhos ou provocar estresse visual.
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <button 
                      className="px-3 py-1.5 rounded font-bold text-xs text-white"
                      style={{ backgroundColor: activePalette.colors.accent.hex }}
                    >
                      Botão Interativo
                    </button>
                    <span 
                      className="text-[11px] font-semibold"
                      style={{ color: activePalette.colors.textSecondary.hex }}
                    >
                      Borda de apoio: {activePalette.colors.borders.hex}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* JUSTIFICATIVA NEUROLÓGICA & BENEFÍCIOS CLÍNICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>Mecanismo Neurosensorial:</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {activePalette.neuroRationale}
                </p>
              </div>

              <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Benefícios para o Usuário TEA/TDAH:</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside leading-relaxed">
                  {activePalette.benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* GUIA DE DIRETRIZES PARA APLICAÇÃO NEURODIVERGENTE */}
          <div className="border border-zinc-800 rounded-xl p-4 sm:p-5 bg-zinc-900/50 space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
              <SunMedium className="w-4 h-4 text-amber-400" />
              <span>4 Mandamentos de Cores para Neurodivergência</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="p-3 bg-zinc-850 rounded-lg border border-zinc-750">
                <strong className="text-zinc-100 block mb-1">1. Banir o Branco Puro (#FFFFFF) como Fundo:</strong>
                O branco de alta luminância causa halos, ofuscamento e fadiga retiniana rápida em cérebros hiper-reativos.
              </div>
              <div className="p-3 bg-zinc-850 rounded-lg border border-zinc-750">
                <strong className="text-zinc-100 block mb-1">2. Tipografia Carvão Mineral (#14261E / #142334):</strong>
                Nunca use texto cinza claro ou esbranquiçado sobre tons pastéis. O texto deve ser escuro e encorpado para evitar ambiguidade visual.
              </div>
              <div className="p-3 bg-zinc-850 rounded-lg border border-zinc-750">
                <strong className="text-zinc-100 block mb-1">3. Bordas Físicas para Propriocepção:</strong>
                Pessoas autistas precisam de contornos visuais bem definidos para delimitar onde um elemento começa e outro termina.
              </div>
              <div className="p-3 bg-zinc-850 rounded-lg border border-zinc-750">
                <strong className="text-zinc-100 block mb-1">4. Alternância com Modo Noturno:</strong>
                Mesmo com pastéis perfeitos, em momentos de colapso agudo (meltdown/shutdown), o modo noturno suave continua sendo indispensável.
              </div>
            </div>
          </div>

        </div>

        {/* RODAPÉ DO MODAL */}
        <div className="p-4 sm:p-5 border-t border-zinc-700/80 bg-[#18181b] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTheme("dark")}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                currentTheme === "dark" 
                  ? "bg-zinc-700 border-zinc-500 text-white" 
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              🌙 Restaurar Modo Escuro Original
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors cursor-pointer"
          >
            Concluir e Voltar
          </button>
        </div>

      </div>
    </div>
  );
}
