# 🧩 DesplugaTEA

> **Aplicativo de regulação sensorial, descompressão e suporte para pessoas no Espectro Autista (TEA) e neurodivergentes.**

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg)](https://tailwindcss.com/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20AAA%20Calibrated-success.svg)](#paletas-pastéis-calibradas-para-neurodivergência)

---

## 📖 Sobre o Projeto

O **DesplugaTEA** é uma plataforma interativa de regulação sensorial e bem-estar projetada especialmente para auxiliar no acolhimento, foco, alívio de crises de ansiedade, pânico e episódios de sobrecarga sensorial comuns no Transtorno do Espectro Autista (TEA) e outras condições neurodivergentes.

O projeto foi concebido seguindo diretrizes de acessibilidade cognitiva e conforto neurossensorial:
* **Anti-ofuscamento visual:** Sem luzes piscantes, sem contrastes estroboscópicos ou fundos brancos puros que causem fadiga ocular e enxaqueca sensorial.
* **Áudios sintetizados em tempo real:** Ruído rosa (chuva suave) e ruído marrom sintetizados localmente com Web Audio API, sem consumo de banda e contornando a chave física de silêncio no iOS/Safari.
* **Ancoragem corporal estruturada:** Técnica 5-4-3-2-1 guiada para trazer a mente de volta ao momento presente em momentos de crise.
* **Atividades motoras monótonas:** Stimming visual e organizador de formas para diminuir a hiperatividade parassimpática.

---

## ✨ Principais Funcionalidades

### 1. 🧘‍♀️ Técnica de Ancoragem 5-4-3-2-1 (Grounding Sensorial)
Um guia passo a passo interativo multissensorial especialmente adaptado para sobrecarga sensorial e crises de ansiedade:
* 👁️ **5 Coisas para Ver:** Observação de objetos concretos no ambiente imediato.
* 🖐️ **4 Coisas para Tocar:** Texturas e superfícies táteis para reancorar o corpo.
* 👂 **3 Coisas para Ouvir:** Identificação de frequências e sons ao redor.
* 👃 **2 Coisas para Cheirar:** Percepção olfativa e aromas presentes.
* 👅 **1 Coisa para Saborear:** Foco no paladar residual ou um gole d'água fresca.
* Inclui cronômetro de apoio (30s), exemplos práticos adaptados, anotações de pensamentos e navegação intuitiva.

### 2. 🎨 Paletas Pastéis Calibradas para Neurodivergência
Evita o contraste excessivo (que causa fotofobia e estresse visual) e o contraste insuficiente (que prejudica a leitura):
* **Sálvia Veludo & Menta Serena:** Equilíbrio parassimpático e relaxamento (Recomendação Nº 1 para TEA).
* **Céu Suave & Neblina Serena:** Serenidade cognitiva e desaceleração do ritmo cardíaco.
* **Lavanda Acolhedora & Ametista:** Redução de ansiedade e conforto visual.
* **Areia & Papiro Aconchegante:** Especialmente calibrado para Síndrome de Irlen e baixa fadiga reflexiva.
* **Modo Noturno Escuro:** Fundo carvão escuro para ambientes com baixa luminosidade.

### 3. 🌧️ Gerador de Sons Sensoriais (Web Audio API)
* **Chuva Suave (Ruído Rosa com Filtro Dinâmico):** Mascaramento acústico contra barulhos repentinos do dia a dia.
* **Ruído Marrom (Brownian Noise):** Frequências aveludadas e graves para foco e descompressão.
* **Compatibilidade Avançada iOS/Safari:** Contorno do botão de mudo físico via canal de áudio HTML5 e desbloqueio por toque inicial.

### 4. 📦 Organizador de Formas Monótono
* Atividade de repetição motora para alívio de estresse (Stimming).
* Depósitos de círculos e quadrados com demarcação visual sólida e nítida.
* Mecanismo suave de arrastar ou clicar para organizar formas geométricas.

### 5. 🫁 Respiração Guiada 4-7-8
* Ciclo visual desacelerado para reativar o sistema nervoso parassimpático.

### 6. 🔋 Nível de Bateria Social & Botão de Silêncio Rápido
* Registro do nível de energia pessoal diária persistido localmente (`localStorage`).
* Botão de emergência "Modo Silêncio" para pausar todos os estímulos instantaneamente.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com classes semânticas e variáveis CSS
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Áudio:** Web Audio API nativa com sintetizadores em tempo real
* **Servidor de Desenvolvimento / Produção:** [Vite 6](https://vitejs.dev/) & [Express](https://expressjs.com/) (Node.js)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* [Node.js](https://nodejs.org/) versão 18 ou superior
* Gerenciador de pacotes `npm` (ou `yarn` / `bun` / `pnpm`)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/desplugatea.git
   cd desplugatea
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O aplicativo estará disponível em: [http://localhost:3000](http://localhost:3000)

4. **Gerar a versão para produção (Build):**
   ```bash
   npm run build
   ```

5. **Executar em modo produção:**
   ```bash
   npm start
   ```

---

## 📁 Estrutura de Arquivos

```text
├── src/
│   ├── components/
│   │   ├── GroundingTool.tsx       # Técnica de Ancoragem 5-4-3-2-1
│   │   └── PastelPaletteModal.tsx  # Seletor de Paletas Pastéis (WCAG AAA)
│   ├── App.tsx                     # Componente principal do DesplugaTEA
│   ├── index.css                   # Definição das paletas pastéis e temas
│   └── main.tsx                    # Ponto de entrada do React
├── API_DOC.md                      # Especificação e testes de API / TestSprite
├── PRD.md                          # Documento de Requisitos de Produto e Roteiro de Testes
├── LICENSE                         # Licença MIT
├── package.json                    # Dependências e scripts do projeto
├── server.ts                       # Servidor Express de produção e dev proxy
└── vite.config.ts                  # Configurações do Vite
```

---

## 🧪 Documentação e Testes

* **Documento de Requisitos (PRD):** Consulte [PRD.md](./PRD.md) para detalhes de arquitetura funcional e casos de teste.
* **Documentação de API (TestSprite):** Consulte [API_DOC.md](./API_DOC.md) para rotas HTTP, payloads de teste e validações.

---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** — consulte o arquivo [LICENSE](./LICENSE) para obter mais detalhes.

Você é livre para usar, copiar, modificar, mesclar, publicar, distribuir e licenciar o software, inclusive para fins comerciais ou educacionais, mantendo os devidos créditos aos autores originais.

---

## 💙 Apoio & Neurodiversidade

*O DesplugaTEA é uma ferramenta de apoio e regulação sensorial. Não substitui o acompanhamento contínuo de profissionais da saúde mental, como médicos psiquiatras, neurologistas, psicólogos e terapeutas ocupacionais.*
