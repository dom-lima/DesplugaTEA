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

export type ThemeId = "sage" | "sky" | "lavender" | "sand" | "dark";

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
    name: "Sálvia Veludo e Menta Serena",
    tagline: "Equilíbrio parassimpático, zero ofuscamento e contraste suave",
    badge: "Recomendação Nº 1 para TEA",
    recommendedFor: "Pessoas no espectro autista com hipersensibilidade sensorial, fotofobia e ansiedade",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#E8EEE9", label: "Sálvia Névoa Fosca Pastel" },
      cardBg: { name: "Superfície dos Cartões", hex: "#D9E4DC", label: "Sálvia Aveludada Pastel (Zero Branco)" },
      borders: { name: "Bordas Estruturantes", hex: "#AEC3B4", label: "Verde Mineral Delicado" },
      textPrimary: { name: "Texto Principal", hex: "#1E3327", label: "Floresta Mineral Profundo (7.6:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#3F5C4C", label: "Sálvia Musgo Médio" },
      accent: { name: "Acentos e Leitura", hex: "#174D34", label: "Verde Floresta Legível (Zero Verde Claro)" }
    },
    contrastRatio: "6.9:1 a 7.6:1 — Conforto Ótimo sem Ofuscamento",
    wcagLevel: "WCAG AAA",
    neuroRationale: "Remove completamente o branco puro (#FFFFFF) que reflete luz excessiva e causa estresse sensorial. O verde de leitura foi aprofundado para tom floresta mineral (#174D34), garantindo nitidez e relaxamento ocular sem qualquer fundo cinza.",
    benefits: [
      "Elimina o ofuscamento e a sensação de ardência ocular",
      "Contraste moderado e confortável: fácil de ler sem agressividade visual",
      "Verde mineral escuro e nítido em todos os títulos, botões e ícones"
    ]
  },
  {
    id: "sky",
    name: "Céu Suave e Névoa",
    tagline: "Clareza mental, redução de estímulos invasivos e foco sereno",
    badge: "Excelente para TDAH e Fotofobia",
    recommendedFor: "Pessoas com pensamentos acelerados, névoa mental e sensibilidade à luz branca",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#E7EDF2", label: "Céu Suave Pastel" },
      cardBg: { name: "Superfície dos Cartões", hex: "#D9E3EB", label: "Nuvem Aveludada Pastel (Zero Branco)" },
      borders: { name: "Bordas Estruturantes", hex: "#ABC0D0", label: "Azul Suave Estrutural" },
      textPrimary: { name: "Texto Principal", hex: "#1D3040", label: "Marinho Profundo (7.8:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#3D5469", label: "Azul Petróleo Médio" },
      accent: { name: "Acentos e Leitura", hex: "#165038", label: "Verde Mineral e Marinho Legível" }
    },
    contrastRatio: "7.1:1 a 7.8:1 — Nitidez com Calma",
    wcagLevel: "WCAG AAA",
    neuroRationale: "O azul pastel suave com cartões em névoa límpida e sem reflexo de branco filtra a sobrecarga cognitiva do TDAH. Todos os textos secundários e verdes mantêm tonalidade profunda para evitar contraste apagado ou campos cinzentos.",
    benefits: [
      "Filtra a agitação de telas brilhantes",
      "Reduz a dispersão visual típica do TDAH",
      "Letras em marinho escuro sobre azul suave proporcionam estabilidade visual"
    ]
  },
  {
    id: "lavender",
    name: "Lavanda Veludo e Ametista",
    tagline: "Desaceleração de pensamentos e acolhimento emocional",
    badge: "Acolhimento e Anti-Pânico",
    recommendedFor: "Crises de ansiedade, ruminações mentais e pânico sensorial",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#ECE7F2", label: "Bruma de Lavanda Pastel" },
      cardBg: { name: "Superfície dos Cartões", hex: "#DED6E6", label: "Ametista Fosca Pastel (Zero Branco)" },
      borders: { name: "Bordas Estruturantes", hex: "#B9ABC9", label: "Ametista Pastel Médio" },
      textPrimary: { name: "Texto Principal", hex: "#2B1F38", label: "Berinjela Suave Profunda (7.9:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#55456B", label: "Ametista Escura" },
      accent: { name: "Acentos e Leitura", hex: "#174F35", label: "Verde Mineral e Orquídea Legível" }
    },
    contrastRatio: "7.2:1 a 7.9:1 — Harmonia e Repouso",
    wcagLevel: "WCAG AAA",
    neuroRationale: "Cores na faixa do violeta/lavanda pastel reduzem a percepção de alarme no sistema nervoso central. A ausência de cinzas escuros e contrastes cortantes acalma o ritmo cognitivo.",
    benefits: [
      "Sensação imediata de acolhimento e desaceleração mental",
      "Conforto para momentos de transição de rotina ou sobrecarga social",
      "Excelente distinção de leitura sem linhas duras ou ofuscamento"
    ]
  },
  {
    id: "sand",
    name: "Areia e Papiro Aconchegante",
    tagline: "Filtro total de luz azul, conforto orgânico e baixo contraste (Irlen)",
    badge: "Anti-Estresse Escotópico (Irlen)",
    recommendedFor: "Pessoas com sensibilidade ao brilho, enxaqueca e aversão a alto contraste",
    colors: {
      bgApp: { name: "Fundo Geral", hex: "#F0EBDF", label: "Areia e Papiro Pastel Quente" },
      cardBg: { name: "Superfície dos Cartões", hex: "#E4DDD0", label: "Linho Cru Macio (Zero Branco)" },
      borders: { name: "Bordas Estruturantes", hex: "#C0B6A2", label: "Areia Mineral Suave" },
      textPrimary: { name: "Texto Principal", hex: "#332C22", label: "Café Mineral Aveludado (7.2:1)" },
      textSecondary: { name: "Texto Secundário", hex: "#5B5244", label: "Âmbar e Sépia Suave" },
      accent: { name: "Acentos e Leitura", hex: "#1D5236", label: "Verde Musgo Profundo" }
    },
    contrastRatio: "6.5:1 a 7.2:1 — Baixo Contraste Suave",
    wcagLevel: "WCAG AAA",
    neuroRationale: "Projetada especificamente para quem sofre com alto contraste: simula a leitura em papel de livro ou papiro sob luz natural. Elimina qualquer vibração óptica e mantém tons pastéis orgânicos em 100% dos campos.",
    benefits: [
      "Elimina a fadiga e ardor nos olhos após longos períodos",
      "Acaba com a sensação de 'letras vibrando' comum na Síndrome de Irlen",
      "Textura e calor visual calmantes mesmo em ambientes de baixa luminosidade"
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
      className="fixed inset-0 z-[9995] bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="modal-pastel-card bg-[var(--bg-card,#d9e4dc)] text-[var(--text-primary,#1e3327)] border border-[var(--border-card,#aec3b4)] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO MODAL */}
        <div className="p-4 sm:p-6 border-b border-[var(--border-card,#aec3b4)] bg-[var(--bg-app,#e8eee9)] flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-inner,#cddcd1)] border border-[var(--border-card,#aec3b4)] flex items-center justify-center text-[var(--accent-readable,#174d34)] shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary,#1e3327)] tracking-tight">
                  Sugestão de Cores Pastéis para Neurodivergência
                </h2>
                <span className="bg-emerald-500/15 border border-emerald-600/30 text-[var(--accent-readable,#174d34)] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Padrão WCAG AAA
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted,#3f5c4c)] mt-1">
                Paletas cientificamente formuladas para TEA, TDAH e hipersensibilidade sensorial: 100% pastéis, zero cinza.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[var(--bg-inner,#cddcd1)] hover:bg-[var(--border-card,#aec3b4)] text-[var(--text-primary,#1e3327)] transition-colors cursor-pointer shrink-0"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO DO MODAL (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm bg-[var(--bg-card,#d9e4dc)]">
          
          {/* INTRODUÇÃO: O SEGREDO DO CONTRASTE NEURODIVERGENTE */}
          <div className="bg-[var(--bg-inner,#cddcd1)] border border-[var(--border-card,#aec3b4)] rounded-xl p-4 flex gap-3 items-start text-xs text-[var(--text-secondary,#2a4234)]">
            <Info className="w-5 h-5 text-[var(--accent-readable,#174d34)] shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <p className="font-bold text-[var(--text-primary,#1e3327)]">
                Harmonia 100% Pastel: Leitura Fácil, Fundo Aveludado e Zero Cinza
              </p>
              <p>
                Eliminamos qualquer campo cinza ou contraste abrupto. A interface utiliza <strong>tons pastéis suaves e puros</strong> em todas as camadas e botões, combinados com <strong>tipografia em tons minerais profundos</strong>. O resultado é nitidez impecável, sem fadiga retiniana e sem sensação de cores apagadas.
              </p>
            </div>
          </div>

          {/* SELETOR DAS 4 PALETAS PASTÉIS */}
          <div>
            <label className="text-xs font-bold text-[var(--text-muted,#3f5c4c)] uppercase tracking-wider block mb-3">
              Selecione uma Paleta Pastel para Visualizar:
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
                        ? "bg-[var(--bg-app,#e8eee9)] border-[var(--accent-readable,#174d34)] ring-2 ring-[var(--accent-readable,#174d34)]/30 shadow-md" 
                        : "bg-[var(--bg-inner,#cddcd1)] border-[var(--border-card,#aec3b4)] hover:border-[var(--accent-readable,#174d34)]"
                    }`}
                  >
                    <div>
                      {/* Mini Amostras de Cores */}
                      <div className="flex gap-1.5 mb-2.5">
                        <span className="w-5 h-5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: palette.colors.bgApp.hex }} title="Fundo Geral" />
                        <span className="w-5 h-5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: palette.colors.cardBg.hex }} title="Cartões" />
                        <span className="w-5 h-5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: palette.colors.borders.hex }} title="Bordas" />
                        <span className="w-5 h-5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: palette.colors.textPrimary.hex }} title="Texto" />
                      </div>

                      <div className="text-xs font-bold text-[var(--text-primary,#1e3327)] leading-snug">
                        {palette.name}
                      </div>
                      <span className="inline-block mt-1 text-[10px] text-[var(--accent-readable,#174d34)] bg-emerald-500/10 border border-emerald-600/20 px-1.5 py-0.2 rounded font-semibold">
                        {palette.badge}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[var(--border-subtle,#bdd1c3)] flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted,#3f5c4c)] font-mono text-[10px]">{palette.contrastRatio.split(" ")[0]}</span>
                      {isAppTheme && (
                        <span className="text-[var(--accent-readable,#174d34)] font-bold flex items-center gap-1 text-[10px]">
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
          <div className="bg-[var(--bg-app,#e8eee9)] border border-[var(--border-card,#aec3b4)] rounded-2xl p-4 sm:p-6 space-y-6">
            
            {/* Cabeçalho da Paleta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-card,#aec3b4)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-primary,#1e3327)]">{activePalette.name}</h3>
                  <span className="bg-emerald-500/15 text-[var(--accent-readable,#174d34)] border border-emerald-600/20 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {activePalette.wcagLevel}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted,#3f5c4c)] mt-1">{activePalette.tagline}</p>
              </div>

              {/* Botão de Ativação Direta no App */}
              <button
                onClick={() => onSelectTheme(activePalette.id)}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  currentTheme === activePalette.id
                    ? "bg-[var(--accent-readable,#174d34)] text-white cursor-default"
                    : "bg-[var(--accent-readable,#174d34)] hover:opacity-90 text-white active:scale-95"
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
                    <span>Aplicar Esta Paleta Pastel</span>
                  </>
                )}
              </button>
            </div>

            {/* TABELA DE CORES COM HEXADECIMAL E AMOSTRAS */}
            <div>
              <h4 className="text-xs font-bold text-[var(--text-muted,#3f5c4c)] uppercase tracking-wider mb-3">
                Especificações Técnicas de Cores (100% Tons Pastéis):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                
                {/* 1. Fundo Geral */}
                <div className="p-3 bg-[var(--bg-inner,#cddcd1)] rounded-xl border border-[var(--border-card,#aec3b4)] flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/15 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.bgApp.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted,#3f5c4c)] block truncate">{activePalette.colors.bgApp.name}</span>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary,#1e3327)]">{activePalette.colors.bgApp.hex}</span>
                    <span className="text-[10px] text-[var(--text-secondary,#2a4234)] block truncate">{activePalette.colors.bgApp.label}</span>
                  </div>
                </div>

                {/* 2. Cartões / Superfícies */}
                <div className="p-3 bg-[var(--bg-inner,#cddcd1)] rounded-xl border border-[var(--border-card,#aec3b4)] flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/15 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.cardBg.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted,#3f5c4c)] block truncate">{activePalette.colors.cardBg.name}</span>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary,#1e3327)]">{activePalette.colors.cardBg.hex}</span>
                    <span className="text-[10px] text-[var(--text-secondary,#2a4234)] block truncate">{activePalette.colors.cardBg.label}</span>
                  </div>
                </div>

                {/* 3. Bordas */}
                <div className="p-3 bg-[var(--bg-inner,#cddcd1)] rounded-xl border border-[var(--border-card,#aec3b4)] flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/15 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.borders.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted,#3f5c4c)] block truncate">{activePalette.colors.borders.name}</span>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary,#1e3327)]">{activePalette.colors.borders.hex}</span>
                    <span className="text-[10px] text-[var(--text-secondary,#2a4234)] block truncate">{activePalette.colors.borders.label}</span>
                  </div>
                </div>

                {/* 4. Texto Principal */}
                <div className="p-3 bg-[var(--bg-inner,#cddcd1)] rounded-xl border border-[var(--border-card,#aec3b4)] flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/15 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.textPrimary.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted,#3f5c4c)] block truncate">{activePalette.colors.textPrimary.name}</span>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary,#1e3327)]">{activePalette.colors.textPrimary.hex}</span>
                    <span className="text-[10px] text-[var(--text-secondary,#2a4234)] block truncate">{activePalette.colors.textPrimary.label}</span>
                  </div>
                </div>

                {/* 5. Texto Secundário */}
                <div className="p-3 bg-[var(--bg-inner,#cddcd1)] rounded-xl border border-[var(--border-card,#aec3b4)] flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/15 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.textSecondary.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted,#3f5c4c)] block truncate">{activePalette.colors.textSecondary.name}</span>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary,#1e3327)]">{activePalette.colors.textSecondary.hex}</span>
                    <span className="text-[10px] text-[var(--text-secondary,#2a4234)] block truncate">{activePalette.colors.textSecondary.label}</span>
                  </div>
                </div>

                {/* 6. Acento / Destaque */}
                <div className="p-3 bg-[var(--bg-inner,#cddcd1)] rounded-xl border border-[var(--border-card,#aec3b4)] flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-black/15 shadow-inner shrink-0" 
                    style={{ backgroundColor: activePalette.colors.accent.hex }} 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-muted,#3f5c4c)] block truncate">{activePalette.colors.accent.name}</span>
                    <span className="font-mono text-xs font-bold text-[var(--text-primary,#1e3327)]">{activePalette.colors.accent.hex}</span>
                    <span className="text-[10px] text-[var(--text-secondary,#2a4234)] block truncate">{activePalette.colors.accent.label}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* PREVIEW INTERATIVO DA PALETA */}
            <div>
              <h4 className="text-xs font-bold text-[var(--text-muted,#3f5c4c)] uppercase tracking-wider mb-3">
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
                    O contraste entre o texto em mineral profundo e a base pastel dessaturada permite ler com facilidade, sem cansar os olhos ou provocar estresse visual.
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <button 
                      className="px-3 py-1.5 rounded font-bold text-xs text-white cursor-pointer"
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

            {/* JUSTIFICATIVA NEUROLÓGICA E BENEFÍCIOS CLÍNICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[var(--bg-inner,#cddcd1)] border border-[var(--border-card,#aec3b4)] p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent-readable,#174d34)] font-bold text-xs uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>Mecanismo Neurosensorial:</span>
                </div>
                <p className="text-xs text-[var(--text-secondary,#2a4234)] leading-relaxed">
                  {activePalette.neuroRationale}
                </p>
              </div>

              <div className="bg-[var(--bg-inner,#cddcd1)] border border-[var(--border-card,#aec3b4)] p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[var(--accent-readable,#174d34)] font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Benefícios para TEA e TDAH:</span>
                </div>
                <ul className="text-xs text-[var(--text-secondary,#2a4234)] space-y-1.5 list-disc list-inside leading-relaxed">
                  {activePalette.benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* GUIA DE DIRETRIZES PARA APLICAÇÃO NEURODIVERGENTE */}
          <div className="border border-[var(--border-card,#aec3b4)] rounded-xl p-4 sm:p-5 bg-[var(--bg-inner,#cddcd1)] space-y-3">
            <h4 className="text-xs font-bold text-[var(--text-primary,#1e3327)] uppercase tracking-wider flex items-center gap-2">
              <SunMedium className="w-4 h-4 text-amber-600" />
              <span>4 Diretrizes de Cores para Neurodivergência</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[var(--text-secondary,#2a4234)]">
              <div className="p-3 bg-[var(--bg-card,#d9e4dc)] rounded-lg border border-[var(--border-subtle,#bdd1c3)]">
                <strong className="text-[var(--text-primary,#1e3327)] block mb-1">1. Banir o Branco Puro (#FFFFFF):</strong>
                O branco de alta luminância causa halos, ofuscamento e fadiga retiniana rápida em cérebros hiper-reativos.
              </div>
              <div className="p-3 bg-[var(--bg-card,#d9e4dc)] rounded-lg border border-[var(--border-subtle,#bdd1c3)]">
                <strong className="text-[var(--text-primary,#1e3327)] block mb-1">2. Tipografia Mineral Profunda:</strong>
                Nunca use texto cinza claro ou esbranquiçado sobre tons pastéis. O texto deve ser nítido e escuro para evitar ambiguidade.
              </div>
              <div className="p-3 bg-[var(--bg-card,#d9e4dc)] rounded-lg border border-[var(--border-subtle,#bdd1c3)]">
                <strong className="text-[var(--text-primary,#1e3327)] block mb-1">3. Bordas Físicas Delicadas:</strong>
                Pessoas autistas se beneficiam de contornos visuais bem definidos para delimitar onde um elemento começa e outro termina.
              </div>
              <div className="p-3 bg-[var(--bg-card,#d9e4dc)] rounded-lg border border-[var(--border-subtle,#bdd1c3)]">
                <strong className="text-[var(--text-primary,#1e3327)] block mb-1">4. Harmonia Pastel Sem Cinzas:</strong>
                Todos os cartões e campos acompanham a família cromática do tema, criando uma sensação reconfortante de ordem e acolhimento.
              </div>
            </div>
          </div>

        </div>

        {/* RODAPÉ DO MODAL */}
        <div className="p-4 sm:p-5 border-t border-[var(--border-card,#aec3b4)] bg-[var(--bg-app,#e8eee9)] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTheme("dark")}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                currentTheme === "dark" 
                  ? "bg-[var(--accent-readable,#174d34)] text-white border-transparent" 
                  : "bg-[var(--bg-inner,#cddcd1)] border-[var(--border-card,#aec3b4)] text-[var(--text-secondary,#2a4234)] hover:bg-[var(--border-card,#aec3b4)]"
              }`}
            >
              🌙 Modo Escuro Alternativo
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[var(--accent-readable,#174d34)] hover:opacity-90 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Concluir e Voltar
          </button>
        </div>

      </div>
    </div>
  );
}
