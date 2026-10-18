# Documentação de API & Especificação de Teste E2E (Testsprite)
## Aplicativo: DesplugaTEA

Esta documentação foi projetada para orientar os testes automatizados do **Testsprite**. Como o **DesplugaTEA** é uma aplicação web interativa (Full-Stack baseada em React + Express), o Testsprite pode testar o aplicativo de duas formas:
1.  **Testes de Integração de API (Backend):** Através de chamadas HTTP para o servidor Express.
2.  **Testes de Interface de Usuário & E2E (Frontend):** Interagindo com os seletores DOM e elementos interativos do aplicativo.

---

## 1. Ambientes de Teste
*   **Servidor Local (Ambiente de Execução):** `http://localhost:3000`
*   **Servidor de Produção/Visualização:** `https://ais-pre-zukywz43nkzfzsjov2s65x-377856471951.us-west1.run.app` (URL Compartilhada)

---

## 2. API do Backend (HTTP / REST)

O backend Express serve principalmente para empacotar o ecossistema e realizar verificações de integridade.

### A. Health Check / Status da Aplicação
Verifica se o servidor de backend está ativo e respondendo corretamente.

*   **Endpoint:** `/api/health`
*   **Método:** `GET`
*   **Headers Recomendados:** `Content-Type: application/json`
*   **Resposta de Sucesso (200 OK):**
    ```json
    {
      "status": "ok",
      "message": "DesplugaTEA rodando 100% local e gratuito"
    }
    ```

#### Exemplo de Chamada via cURL (para o Testsprite):
```bash
curl -X GET "https://ais-pre-zukywz43nkzfzsjov2s65x-377856471951.us-west1.run.app/api/health" \
     -H "Accept: application/json"
```

---

## 3. Contrato de Elementos DOM do Frontend (Para Automação E2E do Testsprite)

Para testar a interface de usuário de forma automatizada (usando Playwright, Puppeteer ou similar no Testsprite), utilize os seguintes IDs e seletores principais mapeados na aplicação:

| Seção/Funcionalidade | ID do Elemento HTML | Tipo de Elemento | Descrição / Ações do Teste |
| :--- | :--- | :--- | :--- |
| **Guia de Respiração** | `breathing-tool` | `div` | Bloco da ferramenta de respiração. Contém os botões para controlar os ciclos. |
| **Simulador de Pop It** | `popit-tool` | `div` | Painel do Pop It interativo. Ideal para cliques repetitivos e estímulos sonoros rápidos. |
| **Regulador de Sons** | `sound-tool` | `div` | Painel de controle de ruídos ambientais sintetizados (Chuva / Ruído Marrom). |
| **Organizador de Formas** | `shapes-tool` | `div` | Jogo minimalista de ordenação de figuras (círculos e quadrados). |
| **Mensagens de Refúgio** | `refugio-box` | `section` | Caixa de textos motivacionais e de regulação emocional rápida. |

---

## 4. Cenários de Testes Automatizados Recomendados para o Testsprite

### Cenário 1: Automação do Organizador de Formas Monótono
1.  **Ação:** Localizar o container `#shapes-tool`.
2.  **Ação:** Clicar em uma das formas geradas disponíveis na lista de seleção.
3.  **Ação:** Localizar os botões de depósito:
    *   **Depósito de Círculos:** Um botão contendo um círculo com borda sólida e inteiriça branca/clara (`border-zinc-200`) e fundo correspondente ao botão (`bg-zinc-900`).
    *   **Depósito de Quadrados:** Um botão contendo um quadrado com borda sólida e inteiriça branca/clara (`border-zinc-200`) e fundo correspondente ao botão (`bg-zinc-900`).
4.  **Ação:** Clicar no depósito correto para mover e ordenar a forma geométrica.
5.  **Resultado Esperado:** A forma é removida do painel de seleção, e o contador ou indicador visual é incrementado ou limpo.

### Cenário 2: Validação da Web Audio API e Gestos de Áudio
1.  **Ação:** Simular o primeiro gesto de clique do usuário em qualquer lugar da tela (ativa o `unlockAudio` e remove os ouvintes preventivos do iOS).
2.  **Ação:** Localizar o botão de áudio de Chuva ou Ruído Marrom dentro do container `#sound-tool`.
3.  **Ação:** Clicar no botão para iniciar a síntese.
4.  **Resultado Esperado:** O estado do `AudioContext` deve passar de `suspended` para `running`. O sistema deve tocar o buffer silencioso inicial para registrar o canal multimídia do dispositivo antes de começar a reprodução real do ruído dinâmico filtrado.

### Cenário 3: Salvamento e Rehidratação da Bateria Interna (localStorage)
1.  **Ação:** Localizar o controle deslizante (slider) de energia/bateria.
2.  **Ação:** Alterar o valor para `45%`.
3.  **Ação:** Verificar no `localStorage` se a chave `desplugatea_battery` foi salva com o valor `"45"`.
4.  **Ação:** Recarregar a página.
5.  **Resultado Esperado:** O controle de bateria deve iniciar em `45%` reidratado do armazenamento interno.
