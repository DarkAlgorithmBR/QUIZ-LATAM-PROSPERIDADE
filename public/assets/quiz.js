// Estado global do Quiz
const quizState = {
  gender: null,
  answers: {},
  currentStep: 1,
  history: [1],
  estimatedTotalSteps: 10
};

// Progresso por etapa em porcentagem (acompanha o valor exato dos prints)
const stepProgress = {
  1: 10,
  2: 20,
  3: 29,
  4: 33,
  5: 36,
  6: 47,
  7: 52,
  8: 64,
  9: 72,
  10: 82,
  11: 88,
  12: 90,
  13: 91,
  14: 100,
  'vsl': 100
};

/**
 * Atualiza a interface do Topbar (Barra de progresso e botão voltar)
 */
function updateTopbar(step) {
  const backBtn = document.getElementById('back-btn');
  const progressFill = document.getElementById('progress-fill');
  const pctLabel = document.getElementById('progress-pct-label');

  // Controle de visibilidade do botão voltar
  if (step === 1 || step === '1' || step === 14 || step === '14') {
    if (backBtn) backBtn.style.visibility = 'hidden';
  } else {
    if (backBtn) backBtn.style.visibility = 'visible';
  }

  // Estilo circular do botão voltar e label 100% na Mini VSL
  if (step === 'vsl') {
    if (backBtn) {
      backBtn.classList.add('circular');
      backBtn.style.visibility = 'visible';
    }
    if (pctLabel) pctLabel.style.display = 'inline-block';
  } else {
    if (backBtn) backBtn.classList.remove('circular');
    if (pctLabel) pctLabel.style.display = 'none';
  }

  // Atualização da largura da barra de progresso
  if (progressFill) {
    const pct = stepProgress[step] || Math.min(100, Math.round((Number(step) / quizState.estimatedTotalSteps) * 100));
    progressFill.style.width = `${pct}%`;
  }
}

/**
 * Seleção do gênero (Etapa 1)
 */
function selectGender(gender) {
  quizState.gender = gender;
  console.log('Gênero selecionado:', gender);

  if (navigator.vibrate) {
    try { navigator.vibrate(30); } catch (e) {}
  }

  setTimeout(() => {
    goToStep(2);
  }, 200);
}

/**
 * Seleção genérica de resposta (Etapa 2 em diante)
 */
function selectAnswer(questionKey, value) {
  quizState.answers[questionKey] = value;
  console.log(`Resposta salva para [${questionKey}]:`, value);

  if (navigator.vibrate) {
    try { navigator.vibrate(25); } catch (e) {}
  }

  const nextStepNum = Number(quizState.currentStep) + 1;
  const nextStepElement = document.getElementById(`step-${nextStepNum}`);

  setTimeout(() => {
    if (nextStepElement) {
      goToStep(nextStepNum);
    } else {
      goToStep('vsl');
    }
  }, 220);
}

/**
 * Avança para a próxima etapa (usado em botões de continuar/seguir)
 */
function nextStep() {
  const nextStepNum = Number(quizState.currentStep) + 1;
  const nextStepElement = document.getElementById(`step-${nextStepNum}`);
  if (nextStepElement) {
    goToStep(nextStepNum);
  } else {
    goToStep('vsl');
  }
}

/**
 * Alterna visual do card de checkbox (Seleção Múltipla)
 */
function toggleCheckbox(input) {
  const card = input.closest('.checkbox-card');
  if (card) {
    if (input.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  }

  if (navigator.vibrate) {
    try { navigator.vibrate(20); } catch (e) {}
  }
}

/**
 * Salva a seleção múltipla e avança para a próxima etapa
 */
function saveMultipleAndNext() {
  const checkedInputs = document.querySelectorAll('input[name="deseos"]:checked');
  const selectedValues = Array.from(checkedInputs).map(i => i.value);
  quizState.answers.deseos = selectedValues;
  console.log('Desejos selecionados:', selectedValues);
  nextStep();
}

/**
 * Navegação suave entre etapas
 */
function goToStep(stepIdOrNumber, isBack = false) {
  const currentActive = document.querySelector('.quiz-step.active');
  const nextTargetId = typeof stepIdOrNumber === 'number' 
    ? `step-${stepIdOrNumber}` 
    : (stepIdOrNumber.startsWith('step-') ? stepIdOrNumber : `step-${stepIdOrNumber}`);

  const nextElement = document.getElementById(nextTargetId);

  if (!nextElement) {
    console.warn(`Etapa ${nextTargetId} não encontrada.`);
    return;
  }

  if (!isBack && quizState.currentStep !== stepIdOrNumber) {
    quizState.history.push(stepIdOrNumber);
  }

  if (currentActive) {
    currentActive.classList.remove('active');
    setTimeout(() => {
      currentActive.style.display = 'none';

      nextElement.style.display = 'block';
      void nextElement.offsetWidth; // Força reflow
      nextElement.classList.add('active');

      quizState.currentStep = stepIdOrNumber;
      updateTopbar(stepIdOrNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Carrega o player e dispara resize para o VTurb apenas ao chegar na VSL
      if (stepIdOrNumber === 'vsl' || stepIdOrNumber === 'step-vsl') {
        loadVturbPlayer();
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 60);
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 300);
      }
    }, 180);
  } else {
    nextElement.style.display = 'block';
    nextElement.classList.add('active');
    quizState.currentStep = stepIdOrNumber;
    updateTopbar(stepIdOrNumber);

    if (stepIdOrNumber === 'vsl' || stepIdOrNumber === 'step-vsl') {
      loadVturbPlayer();
      setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 60);
      setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 300);
    }
  }
}

/**
 * Carregamento sob demanda (Lazy Loading) do player do VTurb
 * Evita que o áudio/vídeo comece a tocar em segundo plano antes da hora
 */
let vturbLoaded = false;
function loadVturbPlayer() {
  if (vturbLoaded) return;
  vturbLoaded = true;

  const wrapper = document.getElementById('vturb-wrapper');
  if (!wrapper) return;

  // Injeta o elemento HTML do smartplayer
  wrapper.innerHTML = `
    <vturb-smartplayer id="vid-6adbafd658d713890625e539" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;">
      <div class="vturb-player-placeholder" style="position: relative; width: 100%; padding: 178.21782178217822% 0 0; z-index: 0; background-color: black;"></div>
    </vturb-smartplayer>
  `;

  // Injeta o script oficial do VTurb agora que o usuário realmente chegou na VSL
  const s = document.createElement("script");
  s.src = "https://scripts.converteai.net/5969fc19-f452-49b5-bdc2-c801ca778b5e/players/6adbafd658d713890625e539/v4/player.js";
  s.async = true;
  document.head.appendChild(s);
}

/**
 * Função para retornar à etapa anterior
 */
function goBack() {
  if (quizState.history.length > 1) {
    quizState.history.pop();
    const previousStep = quizState.history[quizState.history.length - 1];
    goToStep(previousStep, true);
  } else {
    goToStep(1, true);
  }
}

/**
 * Suporte a delay no botão CTA da VSL
 */
function setupVturbDelay(seconds = 0) {
  if (seconds <= 0) {
    const cta = document.getElementById('vsl-cta');
    if (cta) cta.style.display = 'block';
    return;
  }

  setTimeout(() => {
    const cta = document.getElementById('vsl-cta');
    if (cta) {
      cta.style.display = 'block';
      cta.style.opacity = 0;
      cta.style.transition = 'opacity 0.6s ease';
      void cta.offsetWidth;
      cta.style.opacity = 1;
    }
  }, seconds * 1000);
}

// Inicializa a topbar no carregamento
document.addEventListener('DOMContentLoaded', () => {
  updateTopbar(1);
});
