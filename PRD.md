# Documento de Requisitos de Produto (PRD) & Roteiro de Testes
## Aplicativo: DesplugaTEA

Este documento define os objetivos de produto, as funcionalidades implementadas, os fluxos de experiência do usuário (UX) e as especificações técnicas para orientar e garantir a qualidade dos testes do aplicativo **DesplugaTEA**.

---

## 1. Visão Geral do Produto
O **DesplugaTEA** é uma plataforma interativa de regulação sensorial e bem-estar projetada especialmente para auxiliar no foco, na redução de sobrecarga sensorial e na autorregulação de pessoas no espectro autista (TEA) ou com sensibilidades sensoriais. O aplicativo foca em atividades minimalistas, estimulação visual sutil, sons ambientais sintetizados eficientemente e atividades motoras monótonas e calmantes.

---

## 2. Funcionalidades Principais

### A. Regulador de Sons Sensoriais (Áudio Sintetizado)
Gera frequências sonoras ambientais em tempo real (sem consumo excessivo de dados móveis) para mascaramento acústico e relaxamento.
*   **Tipos de Áudio:**
    *   **Chuva (Ruído Rosa com Filtro Dinâmico):** Um som brilhante e constante que auxilia no bloqueio de ruídos agudos do cotidiano.
    *   **Ruído Marrom (Brownian Noise):** Frequências mais profundas e graves, ideais para foco profundo e controle de ansiedade.
*   **Correção e Compatibilidade Avançada para iOS/Safari:**
    *   **Contorno do Silent Switch (Chave de Silenciar Física):** Integração de um gatilho de áudio silencioso via HTML5 em Base64 para forçar o sistema operacional a usar o canal de mídia ativa (*Media playback*), garantindo que o som seja reproduzido mesmo se o aparelho estiver no modo silencioso físico.
    *   **Gesto de Ativação (AudioContext Unlock):** Ouvintes nos gestos globais de toque (`touchstart`, `touchend`, `click`) garantem a inicialização e o estado reativo (`resume()`) do `AudioContext` para contornar políticas rígidas de reprodução automática do Safari.
    *   **Otimização de Memória:** Buffer sintetizado reduzido para 2 segundos, garantindo loops perfeitos com baixíssimo consumo de hardware em aparelhos móveis.

### B. Organizador de Formas Monótono
Uma atividade de repetição motora projetada para diminuir os níveis de estresse por meio da categorização simples de figuras geométricas.
*   **Área de Depósito Ajustada:**
    *   **Depósito de Círculos:** Um botão delimitado por uma borda sólida e inteiriça na cor clara padrão do sistema (`zinc-200`), com fundo idêntico ao do recipiente (`bg-zinc-900`), sem interrupções visuais ou pontilhados.
    *   **Depósito de Quadrados:** Um botão delimitado por uma borda sólida e inteiriça na cor clara padrão do sistema (`zinc-200`), com fundo idêntico ao do recipiente (`bg-zinc-900`), sem interrupções visuais ou pontilhados.
*   **Mecanismo:** O usuário seleciona uma forma na tela e clica no depósito correto para organizá-la.

### C. Nível de Bateria (Persistência)
Uma analogia visual para medir a energia diária ou nível de disposição do usuário.
*   O valor é mantido de forma consistente no navegador através de persistência em `localStorage` sob a chave `desplugatea_battery`.

---

## 3. Plano de Testes (Roteiro Prático)

Este plano de testes guiará o controle de qualidade (QA) para validação do sistema em dispositivos desktop e móveis (com ênfase especial no iOS).

### Cenário 1: Teste de Desbloqueio de Áudio (Foco em iOS Safari)
*   **Objetivo:** Garantir a reprodução do som no Safari mesmo sob restrições severas e com o botão de silenciar ativo.
*   **Passos:**
    1.  Abra o aplicativo em um dispositivo iOS (iPhone ou iPad) usando o Safari.
    2.  Certifique-se de que a chave física lateral de Silenciar (Silent Mode) está **ativada** (modo silencioso).
    3.  Aumente o volume de mídia geral do aparelho.
    4.  Interaja com a tela em qualquer local (para disparar os listeners de gesto).
    5.  Clique no botão para ativar o som de **Chuva** ou **Ruído Marrom**.
*   **Resultado Esperado:** O áudio deve começar a tocar imediatamente de forma contínua, clara e limpa, contornando com sucesso o bloqueio do Safari e o interruptor silencioso físico do aparelho.

### Cenário 2: Validação Visual do Organizador de Formas Monótono
*   **Objetivo:** Verificar a conformidade do design com os requisitos de acessibilidade visual minimalista.
*   **Passos:**
    1.  Navegue até a seção do **Organizador de Formas Monótono**.
    2.  Examine os componentes do **Depósito dos Círculos** e **Depósito dos Quadrados**.
*   **Resultado Esperado:**
    *   As formas geométricas indicativas (o círculo e o quadrado do depósito) **não** devem conter traços pontilhados ou tracejados.
    *   As bordas devem ser totalmente **sólidas**, inteiriças e contínuas na tonalidade clara padrão do sistema (`zinc-200`).
    *   O preenchimento de fundo de ambas as figuras no depósito deve corresponder exatamente à cor de fundo escura do próprio botão (`bg-zinc-900`), garantindo harmonia visual e alta legibilidade.

### Cenário 3: Persistência do Nível de Bateria
*   **Objetivo:** Garantir que o valor definido de bateria não seja reiniciado ao recarregar a página.
*   **Passos:**
    1.  Ajuste o controle deslizante de energia/bateria para um valor específico (ex: `65%`).
    2.  Recarregue a página inteira no navegador (F5 ou Refresh).
*   **Resultado Esperado:** O valor de energia deve reidratar a partir do `localStorage` mantendo-se exatamente em `65%`.

---

## 4. Requisitos de Infraestrutura e Execução
*   **Frontend:** React 18+ com Vite e Tailwind CSS.
*   **Áudio:** Web Audio API (`window.AudioContext` / `webkitAudioContext`) integrada ao gerenciador clássico de elementos `HTMLAudioElement` para conformidade móvel.
*   **Compatibilidade Mínima:** iOS 14.5+, Android 9+, Safari 14+, Chrome 90+, Firefox 88+.
