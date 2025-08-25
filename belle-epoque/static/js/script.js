// Page flip transition on navigation
document.addEventListener('DOMContentLoaded', () => {
  // Aplica tema salvo no localStorage ao carregar
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  // Botão de alternar tema em todas as páginas
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    // Atualiza ícone do botão conforme tema
    themeBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    themeBtn.addEventListener('click', function() {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeBtn.textContent = isDark ? '☀️' : '🌙';
    });
  }
  // Animação dos cards: mostra texto ao clicar
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      card.classList.add('card-glow');
    });
    card.addEventListener('mouseleave', function() {
      card.classList.remove('card-glow');
    });
    card.addEventListener('click', function() {
      // Fecha todos os outros cards
      document.querySelectorAll('.card .card-text').forEach(function(txt){
        txt.parentNode.removeChild(txt);
      });
      // Adiciona texto apenas ao card clicado
      if (card.querySelector('.card-text')) return;
      const texto = card.getAttribute('data-text');
      if (texto) {
        const p = document.createElement('p');
        p.className = 'card-text';
        p.style.opacity = 0;
        p.style.transform = 'translateY(20px)';
        card.appendChild(p);
        setTimeout(() => {
          p.style.transition = 'opacity .5s, transform .5s';
          p.style.opacity = 1;
          p.style.transform = 'none';
          // Efeito de digitação
          let i = 0;
          function typeWriter() {
            if (i <= texto.length) {
              p.textContent = texto.slice(0, i);
              i++;
              setTimeout(typeWriter, 22);
            }
          }
          typeWriter();
        }, 10);
      }
    });
  });
  // Popup only on index if present
  const popup = document.getElementById('popup');
  if (popup) {
    // Always show on load, as solicitado
    document.body.style.overflow = 'hidden';
    window.fecharPopup = () => {
      popup.style.display = 'none';
      document.body.style.overflow = '';
    };
  }

  // Intercept nav links para animar flip e fade-in
  document.querySelectorAll('.navlink').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      document.body.classList.add('page-flip-enter');
      // Aplica fade-out nos elementos principais
      document.querySelectorAll('.fade-in').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(60px)';
      });
      setTimeout(() => { window.location.href = href; }, 520);
    });
  });

  // Aplica fade-in nos elementos ao carregar (força reflow para reiniciar animação)
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach((el, i) => {
      el.classList.remove('fade-in');
      void el.offsetWidth; // força reflow
      el.style.animationDelay = (i * 0.12) + 's';
      el.classList.add('fade-in');
    });
  }, 80);

  // Init carousels
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  // Init quiz if present
  if (window.QUIZ_QUESTIONS && document.getElementById('quiz-app')) {
    initQuiz(window.QUIZ_QUESTIONS);
  }
});

function initCarousel(root){
  const track = root.querySelector('.track');
  const slides = Array.from(track.children);
  let idx = 0;

  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');

  function update(){ track.style.transform = `translateX(-${idx*100}%)`; }
  prev.addEventListener('click', ()=>{ idx = (idx - 1 + slides.length) % slides.length; update(); });
  next.addEventListener('click', ()=>{ idx = (idx + 1) % slides.length; update(); });

  // Auto-advance
  setInterval(()=>{ idx = (idx + 1) % slides.length; update(); }, 5000);
}

// ----------------- Quiz -----------------
function initQuiz(QUESTIONS){
  let qIndex = 0;
  let score = 0;
  const total = QUESTIONS.length;
  const app = document.getElementById('quiz-app');
  const qNum = document.getElementById('qnum');
  const scoreEl = document.getElementById('score');

  function render(){
    const q = QUESTIONS[qIndex];
    app.innerHTML = '';
    const qEl = document.createElement('div');
    qEl.className = 'question';
    qEl.innerHTML = `<h3>${qIndex+1}. ${q.q}</h3>`;
    app.appendChild(qEl);

    const options = document.createElement('div');
    let selected = false;
    q.opts.forEach((text, i)=>{
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = text;
      btn.addEventListener('click', ()=> select(i));
      options.appendChild(btn);
    });
    app.appendChild(options);

    const aviso = document.createElement('div');
    aviso.className = 'quiz-aviso';
    aviso.style.color = 'crimson';
    aviso.style.fontWeight = 'bold';
    aviso.style.marginTop = '8px';
    aviso.style.display = 'none';
    aviso.textContent = 'Selecione uma alternativa para continuar.';
    app.appendChild(aviso);

    const controls = document.createElement('div');
    controls.className = 'controls';
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn';
    nextBtn.textContent = 'Próxima';
    nextBtn.disabled = true;
    nextBtn.addEventListener('click', function(){
      if(nextBtn.disabled){
        aviso.style.display = 'block';
        aviso.textContent = 'Selecione uma alternativa para passar para a próxima pergunta.';
        alert('Selecione uma alternativa para passar para a próxima pergunta.');
        return;
      }
      aviso.style.display = 'none';
      qIndex++;
      if(qIndex < total){
        render();
      }else{
        app.innerHTML = `<h3>Quiz finalizado!</h3><p>Sua pontuação: <strong>${score}/${total}</strong></p>`;
        qNum.textContent = `${total}/${total}`;
        scoreEl.textContent = score;
      }
    });
    controls.appendChild(nextBtn);
    app.appendChild(controls);

    function select(i){
      selected = true;
      aviso.style.display = 'none';
      const correct = q.ans;
      options.querySelectorAll('button').forEach((b, idx)=>{
        b.disabled = true;
        if(idx === correct) b.classList.add('correct');
        if(idx === i && idx !== correct) b.classList.add('wrong');
      });
      if(i === correct) score++;
      nextBtn.disabled = false;
      qNum.textContent = `${qIndex+1}/${total}`;
      scoreEl.textContent = score;
    }
  }

  render();
}
