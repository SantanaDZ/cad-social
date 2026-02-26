---
name: Extrair Identidade Visual
description: Acessa um site usando o browser_subagent e extrai sua identidade visual (paleta de cores, tipografia, logo, estilos gerais).
---

# Extrair Identidade Visual

Esta skill orienta o Antigravity sobre como extrair a identidade visual completa de qualquer site informado pelo usuário.

## Passo a Passo da Execução

1. **Reconhecer a Solicitação:**
   Identifique a URL do site a partir da mensagem do usuário.

2. **Instruir o Browser Subagent:**
   Invoque a ferramenta `browser_subagent` com um **Task** detalhado para a URL alvo. A instrução (`Task`) para o subagente deve ser semelhante a:
   > "Navigate to [URL]. Your goal is to extract the visual identity of this website.
   > 1. Run JavaScript in the browser console to get computed styles for the body, main headings (h1, h2), and primary call-to-action buttons.
   > 2. Extract the main 'font-family' used for headings and paragraph text.
   > 3. Extract the primary 'background-color' and text 'color' to form the color palette. Note the exact HEX or RGB values.
   > 4. Inspect the header to find the main logo URL (look for <img> or <svg> tags inside the header or nav element).
   > 5. Make notes on the general UI styling (e.g., border-radius on buttons, box-shadows, gradient backgrounds, light vs dark mode).
   > 6. Return a comprehensive summary containing typography, color palette, logo URL, and generic UI styling notes."

3. **Tratar os Dados Retornados:**
   Após a execução do subagente, você receberá os dados brutos de identidade visual. 

4. **Formatar a Saída para o Usuário:**
   Apresente o resultado ao usuário de forma clara e estruturada (utilizando blocos de código markdown ou um artefato dedicado), contendo:
   - **Tipografia**: Detalhes sobre as famílias de fontes utilizadas (Títulos vs. Corpo do texto).
   - **Paleta de Cores**: Valores HEX/RGB para as cores de Fundo Primário, Fundo Secundário, Texto Principal, Texto Secundário, e Links/Botões e Destaques.
   - **Recursos da Marca (Logo)**: Link(s) direto(s) para o logotipo e favicon, se encontrados.
   - **Estilo de UI (Design System)**: Notas específicas sobre sombras, arredondamento de bordas (border-radius) e feeling/estética geral da interface.
