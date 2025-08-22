# Documentação Técnica — Belle Époque

## Visão Geral

Site educativo sobre a Belle Époque, abordando história, cultura e avanços tecnológicos do período (1871–1914). O projeto simula um jornal antigo, com navegação temática, quiz interativo, animações e alternância de tema claro/escuro.

---

## Estrutura de Pastas

```
belle-epoque/
├── index.html
├── inicio.html
├── cultura.html
├── avancos.html
├── fim.html
├── quiz.html
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── img/
│       └── [imagens históricas e ilustrações]
```

---

## Bibliotecas e Recursos Utilizados

- **HTML5**: Estrutura semântica das páginas.
- **CSS3**: Estilização, animações, responsividade, variáveis de tema, media queries.
- **JavaScript Puro (Vanilla JS)**: Interatividade sem frameworks externos.
- **Google Fonts**: Cinzel e Old Standard TT para tipografia.
- **Imagens**: Arquivos históricos e ilustrações em `static/img/`.

---

## Funcionalidades

- **Navegação centralizada**: menu no topo de todas as páginas.
- **Cards interativos**: mostram texto explicativo ao clicar, com animação de digitação.
- **Carrossel de imagens**: navegação por imagens históricas, responsivo.
- **Alternância de tema**: botão para tema claro/escuro, preferência salva no navegador.
- **Quiz**: perguntas de múltipla escolha, pontuação e explicação.
- **Popup de boas-vindas**: exibido na página inicial.

---

## Explicações de Trechos Importantes

### Alternância de Tema

```javascript
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  themeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    themeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
  });
}
```
- Alterna a classe `dark-theme` no `<body>`, mudando variáveis CSS.
- Salva a preferência do usuário no `localStorage`.

### Cards Interativos com Efeito de Digitação

```javascript
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function() {
    document.querySelectorAll('.card .card-text').forEach(txt => txt.parentNode.removeChild(txt));
    if (!card.querySelector('.card-text')) {
      const texto = card.getAttribute('data-text');
      const p = document.createElement('p');
      p.className = 'card-text';
      card.appendChild(p);
      let i = 0;
      function typeWriter() {
        if (i <= texto.length) {
          p.textContent = texto.slice(0, i);
          i++;
          setTimeout(typeWriter, 22);
        }
      }
      typeWriter();
    }
  });
});
```
- Só um card aberto por vez.
- Texto aparece com efeito de digitação.

### Carrossel de Imagens

```javascript
function initCarousel(root){
  const track = root.querySelector('.track');
  const slides = Array.from(track.children);
  let idx = 0;
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  function update(){ track.style.transform = `translateX(-${idx*100}%)`; }
  prev.addEventListener('click', ()=>{ idx = (idx - 1 + slides.length) % slides.length; update(); });
  next.addEventListener('click', ()=>{ idx = (idx + 1) % slides.length; update(); });
  setInterval(()=>{ idx = (idx + 1) % slides.length; update(); }, 5000);
}
```
- Botões para navegar entre imagens.
- Auto-avança a cada 5 segundos.
- Responsivo: imagens se adaptam ao tamanho do carrossel.

### Quiz Interativo

- Perguntas e respostas em um array JS (`window.QUIZ_QUESTIONS`).
- Quiz exibe explicação após cada resposta, pontua o usuário e mostra progresso.
- Visual do quiz se adapta ao tema claro/escuro via CSS.

### Responsividade

- Uso de `@media (max-width:...)` para ajustar layout, fontes e espaçamentos em telas menores.
- Unidades relativas (`vw`, `vh`, `clamp`, `%`) para garantir adaptação em diferentes dispositivos.

### Popup de Boas-Vindas

```css
.popup-content {
  width: min(92vw, 420px);
  max-height: 92vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.popup-img {
  max-width: 220px;
  max-height: 40vh;
  object-fit: contain;
}
```
- O popup é centralizado, adaptável e nunca sobrepõe o botão de entrada.
- Imagem e botão se ajustam para garantir acessibilidade em telas pequenas.

---

## Como Cada Função é Executada

### Alternância de Tema
- **Como é executada:**
  - O botão com id `theme-toggle` está presente em todas as páginas.
  - Ao clicar, executa o comando:
    ```javascript
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', ...);
    themeBtn.textContent = ...;
    ```
  - O tema é salvo e aplicado automaticamente ao carregar a página.

### Cards Interativos
- **Como é executada:**
  - Cada card tem atributo `data-text` e classe `.card`.
  - Ao clicar em um card, executa:
    ```javascript
    card.addEventListener('click', function() { ... });
    ```
  - O texto é revelado com efeito de digitação usando a função `typeWriter()`.

### Carrossel de Imagens
- **Como é executada:**
  - O carrossel tem botões `.prev` e `.next`.
  - Ao clicar, executa:
    ```javascript
    prev.addEventListener('click', ...);
    next.addEventListener('click', ...);
    ```
  - O carrossel também avança automaticamente a cada 5 segundos via:
    ```javascript
    setInterval(...);
    ```

### Quiz Interativo
- **Como é executada:**
  - O quiz é inicializado se `window.QUIZ_QUESTIONS` estiver presente.
  - Ao clicar em uma opção, executa:
    ```javascript
    btn.addEventListener('click', ()=> select(i));
    ```
  - O comando `select(i)` verifica a resposta, mostra explicação e atualiza a pontuação.

### Popup de Boas-Vindas
- **Como é executada:**
  - O popup aparece automaticamente na página inicial.
  - O botão "Entrar" executa:
    ```javascript
    window.fecharPopup = () => { ... };
    ```
  - Ao clicar, o popup é ocultado e o conteúdo da página fica acessível.

### Navegação Animada
- **Como é executada:**
  - Todos os links do menu têm classe `.navlink`.
  - Ao clicar, executa:
    ```javascript
    a.addEventListener('click', (e) => { ... });
    ```
  - Aplica animação de transição antes de navegar para a nova página.

---

## Observações Técnicas

- Não há dependências externas além do Google Fonts.
- O código é modular e comentado, facilitando manutenção.
- O uso de variáveis CSS (`:root { --paper: ... }`) permite fácil alteração de temas.
- O projeto é ideal para fins educativos, podendo ser expandido para outros temas históricos.

---

## Créditos

- Desenvolvido por Renato Nunes e Rafael Dias.
- Imagens e ilustrações de domínio público ou acervo livre.
- Conteúdo didático baseado em livros e aulas públicas.
