// =========================
// ELEMENTOS DEL DOM
// =========================
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");
const result = document.getElementById("result");
const area = document.querySelector(".buttons");

// Audio
const loveMusic = document.getElementById("loveMusic");

// Pantalla de carga
const loadingScreen = document.getElementById("loadingScreen");
const loadingBar = document.getElementById("loadingBar");
const loadingText = document.getElementById("loadingText");
const loadingPercentage = document.getElementById("loadingPercentage");

// Elementos de razones
const reasonItems = document.querySelectorAll(".reason-item");

// Botón de descarga
const downloadBtn = document.getElementById("downloadBtn");

// Sistema de desafíos
const challengeModal = document.getElementById("challengeModal");
const photoModal = document.getElementById("photoModal");
const modalClose = document.getElementById("modalClose");
const photoModalClose = document.getElementById("photoModalClose");
const submitAnswer = document.getElementById("submitAnswer");
const challengeContent = document.getElementById("challengeContent");
const challengeTitle = document.getElementById("challengeTitle");
const challengeDescription = document.getElementById("challengeDescription");
const challengeHint = document.getElementById("challengeHint");
const modalPhotoImg = document.getElementById("modalPhotoImg");
const photoCaption = document.getElementById("photoCaption");
const prevPhoto = document.getElementById("prevPhoto");
const nextPhoto = document.getElementById("nextPhoto");
const photosUnlockedCounter = document.getElementById("photosUnlocked");
const resetProgressBtn = document.getElementById("resetProgressBtn");

// =========================
// VARIABLES GLOBALES
// =========================
let unlockedPhotos = [];
let currentPhotoIndex = 0;
let currentChallenge = null;

// =========================
// RESET DE PROGRESO
// =========================
function resetProgress() {
  // Confirmar antes de resetear
  const confirmReset = confirm('🔄 ¿Estás seguro de que quieres reiniciar todo el progreso?\n\nSe borrarán todas las fotos desbloqueadas y tendrás que volver a completar los desafíos.');
  
  if (confirmReset) {
    // Limpiar array
    unlockedPhotos = [];
    
    // Limpiar localStorage
    localStorage.removeItem('valentineUnlockedPhotos');
    
    // Bloquear todas las fotos visualmente
    document.querySelectorAll('.photo-challenge').forEach(photo => {
      photo.classList.remove('unlocked');
    });
    
    // Actualizar contador
    updateUnlockedCounter();
    
    // Mensaje de confirmación
    alert('✅ Progreso reiniciado exitosamente.\n\n¡Ahora puedes volver a jugar todos los desafíos! 🎮');
  }
}

// Definir los desafíos para cada foto
const challenges = {
  1: {
    type: 'question',
    title: 'Nivel 1: Nuestro Inicio 💕',
    description: '¿En qué mes te pedí que fuéramos novios?',
    question: 'Escribe el mes en que empezamos',
    answer: ['diciembre', 'december', 'dic'],
    hint: 'Pista: El último mes del año... 🎄',
    placeholder: 'Ej: Diciembre',
    successMessage: '¡Correcto! 🎉 Diciembre, el mejor mes de mi vida porque dijiste que sí'
  },
  2: {
    type: 'multiple',
    title: 'Nivel 2: ¿Me Conoces? 🤔',
    description: '¿Cuál es mi color favorito?',
    options: ['Rojo ❤️', 'Azul 💙', 'Rosa 💗', 'Verde 💚'],
    answer: 0, // Rojo
    hint: 'Pista: Es el color de la pasión y el amor...',
    successMessage: '¡Exacto! ❤️ El rojo, como nuestro amor intenso'
  },
  3: {
    type: 'question',
    title: 'Nivel 3: Nuestras Bromas 😄',
    description: 'Completa la frase: "Brayan estás muy..."',
    question: 'Escribe cómo termina la frase',
    answer: ['tonoto', 'tonto', 'tontito'],
    hint: 'Pista: Es algo que siempre me dices cuando hago locuras... 😅',
    placeholder: 'Brayan estás muy...',
    successMessage: '¡Jaja sí! 😂 Pero soy TU tonoto favorito 💕'
  },
  4: {
    type: 'multiple',
    title: 'Nivel 4: Comida Favorita 🍽️',
    description: '¿Cuál es mi comida favorita?',
    options: ['Pizza 🍕', 'Ceviche 🐟', 'Hamburguesa 🍔', 'Sushi 🍣'],
    answer: 1, // Ceviche
    hint: 'Pista: Es un platillo peruano delicioso del mar...',
    successMessage: '¡Sí! 🐟 El ceviche, y es aún mejor cuando lo comparto contigo'
  },
  5: {
    type: 'question',
    title: 'Nivel 5: Nuestra Canción 🎵',
    description: '¿Cuál es NUESTRA canción?',
    question: 'Escribe el nombre de nuestra canción especial',
    answer: ['besos', 'beso'],
    hint: 'Pista: Una canción romántica que habla de... 💋',
    placeholder: 'Nombre de la canción',
    successMessage: '¡Perfecta respuesta! 🎶 "Besos" es nuestra canción para siempre 💋'
  },
  6: {
    type: 'click_game',
    title: '👑 Nivel Final: Prueba de Amor 💖',
    description: '¿Aún me amas?',
    question: 'Demuéstralo haciendo click rápido',
    targetClicks: 20,
    timeLimit: 5, // segundos
    hint: 'Si me amas, ¡demuéstralo con 20 clicks en 5 segundos! 💪',
    successMessage: '¡LO LOGRASTE! 👑 Sabía que me amas tanto como yo a ti 💝'
  }
};

// =========================
// SISTEMA DE DESBLOQUEO DE FOTOS
// =========================
function initPhotoGallery() {
  const unlockButtons = document.querySelectorAll('.unlock-btn');
  
  unlockButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const photoChallenge = button.closest('.photo-challenge');
      const photoNumber = parseInt(photoChallenge.dataset.photo);
      
      // Si ya está desbloqueada, mostrar la foto
      if (unlockedPhotos.includes(photoNumber)) {
        showPhotoModal(photoNumber);
      } else {
        // Mostrar desafío
        showChallenge(photoNumber);
      }
    });
  });
  
  // Cargar progreso guardado
  loadProgress();
}

function showChallenge(photoNumber) {
  currentChallenge = photoNumber;
  const challenge = challenges[photoNumber];
  
  challengeTitle.textContent = challenge.title;
  challengeDescription.textContent = challenge.description;
  challengeHint.textContent = challenge.hint;
  challengeHint.classList.add('hidden');
  
  // Limpiar contenido anterior
  challengeContent.innerHTML = '';
  
  if (challenge.type === 'question') {
    // Input de texto
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'challenge-input';
    input.placeholder = challenge.placeholder || 'Tu respuesta aquí...';
    input.id = 'challengeAnswer';
    challengeContent.appendChild(input);
    
    // Focus en el input
    setTimeout(() => input.focus(), 100);
  } else if (challenge.type === 'multiple') {
    // Opciones múltiples
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'challenge-options';
    
    challenge.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = option;
      btn.dataset.index = index;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
      optionsContainer.appendChild(btn);
    });
    
    challengeContent.appendChild(optionsContainer);
  } else if (challenge.type === 'click_game') {
    // Mini-juego de clicks
    createClickGame(challenge);
  }
  
  challengeModal.classList.remove('hidden');
}

// =========================
// MINI-JUEGO DE CLICKS
// =========================
function createClickGame(challenge) {
  const gameContainer = document.createElement('div');
  gameContainer.className = 'click-game-container';
  gameContainer.innerHTML = `
    <div class="click-game-info">
      <p class="game-instruction">¡Haz ${challenge.targetClicks} clicks en ${challenge.timeLimit} segundos!</p>
      <div class="game-stats">
        <div class="stat-item">
          <span class="stat-label">Clicks:</span>
          <span class="stat-value" id="clickCount">0</span>/${challenge.targetClicks}
        </div>
        <div class="stat-item">
          <span class="stat-label">Tiempo:</span>
          <span class="stat-value" id="timeLeft">${challenge.timeLimit}</span>s
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" id="clickProgress"></div>
      </div>
    </div>
    <button class="click-game-button" id="gameClickBtn">
      <span class="btn-emoji">💖</span>
      <span class="btn-text">¡CLICK AQUÍ!</span>
    </button>
    <button class="game-start-btn" id="startGameBtn">Iniciar Prueba de Amor 💕</button>
  `;
  
  challengeContent.appendChild(gameContainer);
  
  // Ocultar botón de submit
  submitAnswer.style.display = 'none';
  
  let clicks = 0;
  let timeRemaining = challenge.timeLimit;
  let gameStarted = false;
  let gameInterval = null;
  
  const clickBtn = document.getElementById('gameClickBtn');
  const startBtn = document.getElementById('startGameBtn');
  const clickCountEl = document.getElementById('clickCount');
  const timeLeftEl = document.getElementById('timeLeft');
  const progressBar = document.getElementById('clickProgress');
  
  clickBtn.disabled = true;
  clickBtn.style.opacity = '0.5';
  
  startBtn.addEventListener('click', () => {
    // Iniciar juego
    gameStarted = true;
    clicks = 0;
    timeRemaining = challenge.timeLimit;
    
    clickBtn.disabled = false;
    clickBtn.style.opacity = '1';
    startBtn.style.display = 'none';
    
    updateGameUI();
    
    // Countdown
    gameInterval = setInterval(() => {
      timeRemaining--;
      timeLeftEl.textContent = timeRemaining;
      
      if (timeRemaining <= 0) {
        endGame(false);
      }
    }, 1000);
  });
  
  clickBtn.addEventListener('click', () => {
    if (!gameStarted) return;
    
    clicks++;
    updateGameUI();
    
    // Efecto visual
    clickBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      clickBtn.style.transform = 'scale(1)';
    }, 100);
    
    // Confeti mini en cada click
    if (clicks % 5 === 0) {
      createMiniConfetti();
    }
    
    // Verificar victoria
    if (clicks >= challenge.targetClicks) {
      endGame(true);
    }
  });
  
  function updateGameUI() {
    clickCountEl.textContent = clicks;
    const progress = (clicks / challenge.targetClicks) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    
    // Cambiar color según progreso
    if (progress < 50) {
      progressBar.style.background = 'linear-gradient(90deg, #ff4b7d, #ff7aa7)';
    } else if (progress < 80) {
      progressBar.style.background = 'linear-gradient(90deg, #ff7aa7, #ffd700)';
    } else {
      progressBar.style.background = 'linear-gradient(90deg, #ffd700, #ffed4e)';
    }
  }
  
  function endGame(won) {
    clearInterval(gameInterval);
    gameStarted = false;
    clickBtn.disabled = true;
    
    if (won) {
      // ¡GANÓ!
      setTimeout(() => {
        unlockPhoto(currentChallenge);
        alert(challenge.successMessage);
        challengeModal.classList.add('hidden');
        submitAnswer.style.display = '';
        
        setTimeout(() => {
          showPhotoModal(currentChallenge);
        }, 300);
      }, 500);
    } else {
      // Perdió - puede reintentar
      alert('¡Casi! 💔 Inténtalo de nuevo. ¡Sé que puedes lograrlo! 💪');
      startBtn.style.display = 'block';
      startBtn.textContent = 'Intentar de Nuevo 💕';
      clickBtn.style.opacity = '0.5';
    }
  }
}

function checkAnswer() {
  const challenge = challenges[currentChallenge];
  
  // El click game se maneja por separado
  if (challenge.type === 'click_game') {
    return;
  }
  
  let isCorrect = false;
  
  if (challenge.type === 'question') {
    const input = document.getElementById('challengeAnswer');
    const userAnswer = input.value.trim().toLowerCase();
    
    // Verificar si coincide con alguna respuesta válida
    isCorrect = challenge.answer.some(ans => 
      userAnswer.includes(ans.toLowerCase()) || ans.toLowerCase().includes(userAnswer)
    );
  } else if (challenge.type === 'multiple') {
    const selected = document.querySelector('.option-btn.selected');
    if (selected) {
      isCorrect = parseInt(selected.dataset.index) === challenge.answer;
    }
  }
  
  if (isCorrect) {
    // ¡Respuesta correcta!
    unlockPhoto(currentChallenge);
    
    // Mostrar mensaje de éxito
    alert(challenge.successMessage);
    
    challengeModal.classList.add('hidden');
    
    // Mostrar la foto desbloqueada
    setTimeout(() => {
      showPhotoModal(currentChallenge);
    }, 300);
  } else {
    // Respuesta incorrecta - mostrar hint
    challengeHint.classList.remove('hidden');
    
    // Vibrar el modal (efecto de error)
    const modal = document.querySelector('.modal-content');
    modal.style.animation = 'none';
    setTimeout(() => {
      modal.style.animation = 'shake 0.5s';
    }, 10);
  }
}

function unlockPhoto(photoNumber) {
  if (!unlockedPhotos.includes(photoNumber)) {
    unlockedPhotos.push(photoNumber);
    saveProgress();
    
    // Animar el desbloqueo
    const photoChallenge = document.querySelector(`[data-photo="${photoNumber}"]`);
    photoChallenge.classList.add('unlocked');
    
    // Confeti pequeño
    createMiniConfetti();
    
    // Actualizar contador
    updateUnlockedCounter();
    
    // Sonido de desbloqueo (si tienes audio)
    playUnlockSound();
  }
}

function showPhotoModal(photoNumber) {
  currentPhotoIndex = unlockedPhotos.indexOf(photoNumber);
  
  modalPhotoImg.src = `img/foto${photoNumber}.jpg`;
  photoCaption.textContent = `Recuerdo ${photoNumber}/6 desbloqueado 💝`;
  
  // Habilitar/deshabilitar botones de navegación
  prevPhoto.disabled = currentPhotoIndex === 0;
  nextPhoto.disabled = currentPhotoIndex === unlockedPhotos.length - 1;
  
  photoModal.classList.remove('hidden');
}

function navigatePhoto(direction) {
  const newIndex = currentPhotoIndex + direction;
  if (newIndex >= 0 && newIndex < unlockedPhotos.length) {
    showPhotoModal(unlockedPhotos[newIndex]);
  }
}

function createMiniConfetti() {
  const colors = ['#ff4b7d', '#ff7aa7', '#ffd700', '#ff1744'];
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 2 + 1;
    confetti.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => confetti.remove(), duration * 1000);
  }
}

function playUnlockSound() {
  // Pequeño sonido de éxito (opcional)
  // Puedes agregar un audio corto aquí
}

function updateUnlockedCounter() {
  photosUnlockedCounter.textContent = unlockedPhotos.length;
  
  // Si desbloqueó todas, ¡celebración especial!
  if (unlockedPhotos.length === 6) {
    setTimeout(() => {
      alert('🎉 ¡FELICIDADES! 🎉\n\n¡Has desbloqueado todos nuestros recuerdos especiales!\n\nGracias por conocerme tan bien 💝');
      createConfetti(); // Confeti grande
    }, 500);
  }
}

function saveProgress() {
  localStorage.setItem('valentineUnlockedPhotos', JSON.stringify(unlockedPhotos));
}

function loadProgress() {
  const saved = localStorage.getItem('valentineUnlockedPhotos');
  if (saved) {
    unlockedPhotos = JSON.parse(saved);
    unlockedPhotos.forEach(photoNumber => {
      const photoChallenge = document.querySelector(`[data-photo="${photoNumber}"]`);
      if (photoChallenge) {
        photoChallenge.classList.add('unlocked');
      }
    });
    updateUnlockedCounter();
  }
}

// Event Listeners para modales
if (modalClose) {
  modalClose.addEventListener('click', () => {
    challengeModal.classList.add('hidden');
  });
}

if (photoModalClose) {
  photoModalClose.addEventListener('click', () => {
    photoModal.classList.add('hidden');
  });
}

if (submitAnswer) {
  submitAnswer.addEventListener('click', checkAnswer);
}

if (prevPhoto) {
  prevPhoto.addEventListener('click', () => navigatePhoto(-1));
}

if (nextPhoto) {
  nextPhoto.addEventListener('click', () => navigatePhoto(1));
}

// Cerrar modal al hacer clic fuera
challengeModal?.addEventListener('click', (e) => {
  if (e.target === challengeModal) {
    challengeModal.classList.add('hidden');
  }
});

photoModal?.addEventListener('click', (e) => {
  if (e.target === photoModal) {
    photoModal.classList.add('hidden');
  }
});

// Enter para enviar respuesta
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !challengeModal.classList.contains('hidden')) {
    checkAnswer();
  }
});

// Animación de shake para error
const shakeAnimation = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
`;
const style = document.createElement('style');
style.textContent = shakeAnimation;
document.head.appendChild(style);

// =========================
// RAZONES POR LAS QUE TE AMO
// =========================
const loadingMessages = [
  "Cargando mi mundo contigo...",
  "Generando recuerdos especiales...",
  "Construyendo momentos perfectos...",
  "Preparando sorpresas románticas...",
  "Añadiendo corazones infinitos...",
  "Creando nuestra historia de amor...",
  "Cargando sonrisas y abrazos...",
  "Preparando todo con amor..."
];

function startMinecraftLoading() {
  let progress = 0;
  let messageIndex = 0;
  
  const loadingInterval = setInterval(() => {
    // Incrementar progreso más rápido
    const increment = Math.random() * 20 + 10;
    progress += increment;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      
      // Esperar un momento en 100% antes de ocultar
      setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        
        // Remover del DOM después de la animación
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 300);
    }
    
    // Actualizar barra y porcentaje
    loadingBar.style.width = progress + '%';
    loadingPercentage.textContent = Math.floor(progress) + '%';
    
    // Cambiar mensaje cada cierto progreso
    if (progress > (messageIndex + 1) * 12.5 && messageIndex < loadingMessages.length - 1) {
      messageIndex++;
      loadingText.textContent = loadingMessages[messageIndex];
    }
    
  }, 150); // Actualizar más rápido: cada 150ms
}

// =========================
// FUNCIONES AUXILIARES
// =========================
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function dist(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.sqrt(dx * dx + dy * dy);
}

// =========================
// BOTÓN "NO" - LÓGICA MEJORADA
// =========================
function placeNoRandom() {
  const box = area.getBoundingClientRect();
  const b = btnNo.getBoundingClientRect();

  // Límites seguros dentro del contenedor
  const pad = 10;
  const maxX = box.width - b.width - pad;
  const maxY = box.height - b.height - pad;

  const x = Math.random() * maxX + pad;
  const y = Math.random() * maxY + pad;

  btnNo.style.left = `${x}px`;
  btnNo.style.top = `${y}px`;
}

// Detector de cercanía del mouse
area.addEventListener("mousemove", (e) => {
  const box = area.getBoundingClientRect();
  const mx = e.clientX - box.left;
  const my = e.clientY - box.top;

  const b = btnNo.getBoundingClientRect();
  const bx = (b.left - box.left) + b.width / 2;
  const by = (b.top - box.top) + b.height / 2;

  const danger = 130; // Distancia a la que "huye"
  if (dist(mx, my, bx, by) < danger) {
    placeNoRandom();
  }
});

// Touch para móviles
btnNo.addEventListener("touchstart", (e) => {
  e.preventDefault();
  placeNoRandom();
}, { passive: false });

// Click
btnNo.addEventListener("click", (e) => {
  e.preventDefault();
  placeNoRandom();
});

// =========================
// BOTÓN "SÍ" - MOSTRAR RESULTADO
// =========================
btnSi.addEventListener("click", () => {
  // Reproducir música de amor
  if (loveMusic) {
    loveMusic.play().catch(error => {
      console.log("No se pudo reproducir la música automáticamente:", error);
      // Algunos navegadores bloquean autoplay, pero al ser acción del usuario debería funcionar
    });
  }
  
  // Crear confeti
  createConfetti();
  
  // Mostrar resultado
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "center" });
  
  // Agregar celebración
  setTimeout(() => {
    const celebration = document.querySelector(".celebration");
    if (celebration) {
      celebration.style.animation = "bounce 0.5s ease infinite";
    }
  }, 300);
});

// =========================
// BOTÓN DE RESET
// =========================
if (resetProgressBtn) {
  resetProgressBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetProgress();
  });
}

// =========================
// CONFETI
// =========================
function createConfetti() {
  const colors = ['#ff4b7d', '#ff7aa7', '#ff95bb', '#ff1744', '#ff6090'];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);

    const duration = Math.random() * 3 + 2;
    const xMove = (Math.random() - 0.5) * 200;
    
    confetti.animate([
      { 
        transform: 'translateY(0px) translateX(0px) rotate(0deg)',
        opacity: 1
      },
      { 
        transform: `translateY(${window.innerHeight + 10}px) translateX(${xMove}px) rotate(${Math.random() * 360}deg)`,
        opacity: 0
      }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    setTimeout(() => {
      confetti.remove();
    }, duration * 1000);
  }
}

// =========================
// RAZONES POR LAS QUE TE AMO
// =========================
reasonItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    const reasonText = item.querySelector(".reason-text");
    
    if (item.classList.contains("revealed")) {
      // Ocultar
      item.classList.remove("revealed");
      reasonText.classList.add("hidden");
      reasonText.classList.remove("visible");
    } else {
      // Mostrar
      item.classList.add("revealed");
      reasonText.classList.remove("hidden");
      reasonText.classList.add("visible");
      
      // Efecto de corazón
      const heart = item.querySelector(".heart-icon");
      heart.style.transform = "scale(1.3)";
      setTimeout(() => {
        heart.style.transform = "scale(1)";
      }, 300);
    }
  });
});

// =========================
// BOTÓN DE DESCARGA
// =========================
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    // Crear certificado estilo carta
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');

    // Fondo tipo papel pergamino/carta
    const gradient = ctx.createLinearGradient(0, 0, 1000, 1400);
    gradient.addColorStop(0, '#fff5f7');
    gradient.addColorStop(0.5, '#ffe8ed');
    gradient.addColorStop(1, '#ffd6e0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 1400);

    // Borde decorativo doble
    ctx.strokeStyle = '#ff4b7d';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 940, 1340);
    
    ctx.strokeStyle = '#ff7aa7';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 900, 1300);

    // Decoración de corazones en las esquinas
    ctx.font = '60px Arial';
    ctx.fillText('💕', 70, 110);
    ctx.fillText('💕', 870, 110);
    ctx.fillText('💕', 70, 1330);
    ctx.fillText('💕', 870, 1330);

    // Título principal
    ctx.fillStyle = '#ff1744';
    ctx.font = 'bold 56px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificado de Amor', 500, 200);
    
    ctx.font = '32px Georgia, serif';
    ctx.fillStyle = '#ff4b7d';
    ctx.fillText('San Valentín 2026', 500, 250);

    // Línea decorativa
    ctx.strokeStyle = '#ff7aa7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(200, 290);
    ctx.lineTo(800, 290);
    ctx.stroke();

    // Contenido de la carta
    ctx.fillStyle = '#2d1b2e';
    ctx.font = '28px Georgia, serif';
    ctx.textAlign = 'center';
    
    const today = new Date();
    const dia = today.getDate();
    const mes = today.toLocaleDateString('es-ES', { month: 'long' });
    const año = today.getFullYear();
    
    ctx.fillText(`${dia} de ${mes} de ${año}`, 500, 370);

    // Cuerpo de la carta
    ctx.font = '32px Georgia, serif';
    ctx.fillStyle = '#1a0a1e';
    
    ctx.fillText('Por medio de la presente,', 500, 460);
    ctx.fillText('se certifica que:', 500, 520);

    // Nombre destacado
    ctx.font = 'bold 56px Georgia, serif';
    ctx.fillStyle = '#ff1744';
    ctx.fillText('Gaby', 500, 620);

    // Continuación
    ctx.font = '32px Georgia, serif';
    ctx.fillStyle = '#1a0a1e';
    ctx.fillText('Ha aceptado oficialmente', 500, 710);
    ctx.fillText('ser mi San Valentín', 500, 760);
    ctx.fillText('en este día tan especial,', 500, 810);
    ctx.fillText('llenando mi corazón de alegría', 500, 860);
    ctx.fillText('y haciendo este 14 de febrero', 500, 910);
    ctx.fillText('el más hermoso de todos.', 500, 960);

    // Corazones decorativos
    ctx.font = '40px Arial';
    ctx.fillText('💖 ✨ 💝 ✨ 💖', 500, 1040);

    // Mensaje final
    ctx.font = 'italic 28px Georgia, serif';
    ctx.fillStyle = '#ff4b7d';
    ctx.fillText('Este certificado es válido por toda la eternidad', 500, 1120);

    // Línea para firma
    ctx.strokeStyle = '#ff4b7d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 1220);
    ctx.lineTo(700, 1220);
    ctx.stroke();

    // Texto de firma
    ctx.font = '24px Georgia, serif';
    ctx.fillStyle = '#2d1b2e';
    ctx.fillText('Con todo mi amor', 500, 1260);

    // Sello/fecha
    ctx.font = '20px Georgia, serif';
    ctx.fillStyle = '#666';
    ctx.fillText(`Certificado generado el ${dia}/${today.getMonth() + 1}/${año}`, 500, 1310);

    // Descargar
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificado-San-Valentin-Gaby-${año}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Feedback
    downloadBtn.textContent = "¡Descargado! 💝";
    setTimeout(() => {
      downloadBtn.textContent = "Descargar Certificado 💝";
    }, 3000);
  });
}

// =========================
// INICIALIZACIÓN
// =========================
window.addEventListener("load", () => {
  // Iniciar pantalla de carga Minecraft
  if (loadingScreen) {
    startMinecraftLoading();
  }
  
  // Inicializar sistema de galería con desafíos
  initPhotoGallery();
  
  // Colocar botón "No" al inicio (después de que cargue)
  setTimeout(() => {
    if (btnNo && area) {
      placeNoRandom();
    }
  }, 2500); // Reducido a 2.5 segundos

  // Crear corazones flotantes adicionales
  setTimeout(() => {
    createFloatingHearts();
  }, 2200);
});

// =========================
// CORAZONES FLOTANTES EXTRAS
// =========================
function createFloatingHearts() {
  const container = document.querySelector('.bg-hearts');
  const hearts = ['💕', '💖', '💗', '💓', '💞', '💘', '❤️', '🌹'];
  
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.position = 'absolute';
    heart.style.fontSize = Math.random() * 20 + 20 + 'px';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '-50px';
    heart.style.opacity = '0';
    heart.style.animation = `floatHeart ${Math.random() * 10 + 15}s linear infinite`;
    heart.style.animationDelay = Math.random() * 5 + 's';
    
    container.appendChild(heart);
  }
}

// =========================
// EFECTO PARALLAX EN SCROLL
// =========================
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.card');
      
      parallaxElements.forEach((el, index) => {
        const speed = 0.05;
        const yPos = -(scrolled * speed * (index + 1) * 0.3);
        el.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    });
    
    ticking = true;
  }
});

// =========================
// EASTER EGG - Konami Code
// =========================
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

// Código secreto para reset: R-E-S-E-T
let resetCode = [];
const resetSequence = ['r', 'e', 's', 'e', 't'];

document.addEventListener('keydown', (e) => {
  // Konami Code
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);
  
  if (konamiCode.join(',') === konamiSequence.join(',')) {
    // Easter egg activado!
    createMassiveConfetti();
    alert('💝 ¡Código secreto activado! ¡Te amo infinitamente! 💝');
  }
  
  // Reset Code
  resetCode.push(e.key.toLowerCase());
  resetCode = resetCode.slice(-5);
  
  if (resetCode.join('') === resetSequence.join('')) {
    // Código de reset activado
    console.log('🔄 Código de reset detectado');
    resetProgress();
    resetCode = []; // Limpiar después de usar
  }
});

function createMassiveConfetti() {
  for (let i = 0; i < 200; i++) {
    setTimeout(() => createConfetti(), i * 50);
  }
}

console.log('💕 Hecho con amor para ti 💕');
console.log('🎮 Pista: Intenta el código Konami (↑↑↓↓←→←→BA)');
console.log('🔄 Para resetear el progreso, presiona el botón 🔄 o escribe: RESET');