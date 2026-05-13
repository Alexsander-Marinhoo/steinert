---
page: contato
---
Uma página limpa, luxuosa e confiável para a seção de Contato ("Fale Conosco"). O design deve seguir uma estética de revista com uso elegante de white space, apresentando um formulário de contato minimalista envolto em detalhes de glassmorphism.

**DESIGN SYSTEM (REQUIRED):**
# Design System: High-End Dental Editorial

## 1. Overview & Creative North Star
A clínica odontológica de alto padrão exige um equilíbrio entre a autoridade clínica e o acolhimento humano. O "Norte Criativo" deste sistema é definido como **"A Curadoria Clínica"**. 

Diferente de sistemas de saúde genéricos que utilizam grids rígidos e simetria óbvia, esta abordagem utiliza uma estética editorial de luxo. O design deve parecer uma revista de alta costura aplicada à medicina: grandes espaços negativos (white space), tipografia expressiva com variações de peso e elementos que se sobrepõem organicamente. A quebra da "aparência de template" é alcançada através de imagens que sangram para fora dos containers e uma hierarquia visual que prioriza o conforto emocional antes da informação técnica.

## 2. Colors: Profundidade e Serenidade
O sistema utiliza uma paleta centrada no `primary` (#001856), um azul profundo que comunica confiança inabalável, equilibrado por uma escala de cinzas quentes e superfícies translúcidas.

### A Regra "Sem Linhas" (No-Line Rule)
Para manter o aspecto premium e fluido, **é proibido o uso de bordas sólidas de 1px para separar seções.** A delimitação de áreas deve ser feita exclusivamente através de:
*   **Mudança de Tonalidade:** Alternar entre `surface` (#f8f9fa) e `surface-container-low` (#f3f4f5).
*   **Espaçamento Negativo:** Usar o vácuo visual para agrupar ou separar informações.

### Hierarquia de Superfície e Camadas
Trate a interface como camadas físicas de papel fino ou vidro fosco. 
*   **Base:** `surface` (#f8f9fa).
*   **Elevação Primária:** `surface-container-lowest` (#ffffff) para cards que precisam de destaque máximo.
*   **Recessão:** `surface-container-high` (#e7e8e9) para áreas de formulários ou inputs, criando uma sensação de profundidade "escavada".

### Glassmorphism & Texturas Signature
Elementos flutuantes (como menus ou badges de depoimentos) devem utilizar `surface` com 80% de opacidade e `backdrop-filter: blur(12px)`. Para CTAs principais, utilize um gradiente sutil de `primary` para `primary-container` para evitar a "flatness" excessiva e adicionar uma alma vibrante ao botão.

## 3. Typography: Autoridade Editorial
A combinação de **Manrope** (Display/Headlines) e **Inter** (Body/Labels) cria um diálogo entre o design contemporâneo e a legibilidade técnica.

*   **Display & Headline (Manrope):** Utilizada em tamanhos generosos. O uso de *itálico* em palavras-chave dentro de títulos (ex: "Seu sorriso *começa* aqui") é encorajado para quebrar a monotonia e guiar o olhar.
*   **Body & UI (Inter):** Focada em clareza absoluta. O `body-lg` (1rem) é o padrão para garantir acessibilidade sem perder a elegância.
*   **Hierarquia Tonal:** Títulos utilizam `on-surface`, enquanto textos de apoio utilizam `on-surface-variant` para criar contraste suave e reduzir o cansaço visual.

## 4. Elevation & Depth: Camadas Tonais
A profundidade não é uma sombra projetada, mas uma relação entre luz e material.

*   **Shadows Ambientais:** Quando sombras forem estritamente necessárias, use valores de blur amplos (ex: 30px) com opacidade extremamente baixa (4-6%). A cor da sombra deve ser um tom derivado do `primary` (navy) diluído, nunca cinza neutro ou preto.
*   **The Ghost Border:** Se houver necessidade de acessibilidade em elementos como inputs, utilize `outline-variant` com apenas 20% de opacidade.
*   **Interação de Imagens:** Fotos de pacientes e tecnologia devem ser tratadas com cantos arredondados (token `xl`: 0.75rem) e, ocasionalmente, sobrepor-se a dois containers de cores diferentes para criar tridimensionalidade.

## 5. Components: Anatomia do Cuidado

### Buttons
*   **Primary:** Background gradiente (`primary` -> `primary-container`), texto em `on-primary`. Border-radius: `full` (9999px) para um toque amigável.
*   **Secondary/Ghost:** Apenas texto em `primary` com um ícone sutil de seta. Sem bordas.
*   **States:** No hover, o botão deve sofrer um leve "lift" (elevação) e um aumento sutil na saturação do gradiente.

### Cards & Lists
*   **Proibição de Divisores:** Não utilize linhas horizontais em listas de serviços. Use um aumento no padding vertical ou uma mudança sutil para `surface-container-low` no fundo do item.
*   **Cards de Especialidade:** Background `surface-container-lowest`, sem bordas, com ícones em tons de `primary` desaturados.

### Input Fields
*   Os campos de agendamento devem parecer "integrados" à página. Utilize `surface-container-high` com `border-radius: md` (0.375rem). O rótulo (label) deve estar sempre no topo em `label-md` para clareza imediata.

**Page Structure:**
1. **Header/Nav:** Mantém o exato mesmo "Glass navigaton bar" com logotipo e menu ("Início", "Serviços", "Equipe", "Contato") da home.
2. **Hero de Contato:** Título grande "Fale com a *Odonto Prata*" e uma frase curta sobre localização privilegiada.
3. **Formulário de Contato:** Campos de input clean ("Nome", "Telefone", "Mensagem"), utilizando fundo `surface-container-high`. Sem grid genérico, com margens largas e botão primário gradiente "Enviar Mensagem".
4. **Informações Clínicas:** Um box luxuoso ao lado (ou abaixo no mobile) listando Email, WhatsApp, e Endereço com tipografia Inter, ícones minimalistas e alto contraste no `primary`.
5. **Mapa (Mocked):** Um container retangular para simular o mapa do Google sob uma máscara com bordas arredondadas e efeito de opacidade elegante.
6. **Footer:** Mesmo rodapé limpo com cores `blue-900` e links úteis.
