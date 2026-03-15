/**
 * Quiz — Find Your Automation Match
 * Step-by-step lead capture with Formspree
 */

(function () {
  'use strict';

  const TOTAL_STEPS = 6;
  const steps = document.querySelectorAll('.quiz-step');
  const backBtn = document.querySelector('.quiz-back');
  const nextBtn = document.querySelector('.quiz-next');
  const progressFill = document.querySelector('.quiz-progress-fill');
  const form = document.querySelector('.quiz-form');
  const hiddenFields = {
    goal: document.getElementById('quiz-goal'),
    industry: document.getElementById('quiz-industry'),
    pain: document.getElementById('quiz-pain'),
    timeline: document.getElementById('quiz-timeline'),
    budget: document.getElementById('quiz-budget')
  };

  let currentStep = 1;
  const answers = {};

  function goToStep(step) {
    if (step < 1 || step > TOTAL_STEPS) return;
    currentStep = step;

    steps.forEach(function (el) {
      const s = parseInt(el.getAttribute('data-step'), 10);
      el.classList.toggle('is-active', s === currentStep);
    });

    progressFill.style.width = ((currentStep / TOTAL_STEPS) * 100) + '%';
    document.querySelector('.quiz-progress').setAttribute('aria-valuenow', currentStep);

    backBtn.classList.toggle('is-visible', currentStep > 1);
    nextBtn.style.display = (currentStep === 6) ? 'none' : '';
    updateNextState();

    if (currentStep === 6) {
      syncHiddenFields();
    }
  }

  function syncHiddenFields() {
    if (hiddenFields.goal) hiddenFields.goal.value = answers.goal || '';
    if (hiddenFields.industry) hiddenFields.industry.value = answers.industry || '';
    if (hiddenFields.pain) hiddenFields.pain.value = answers.pain || '';
    if (hiddenFields.timeline) hiddenFields.timeline.value = answers.timeline || '';
    if (hiddenFields.budget) hiddenFields.budget.value = answers.budget || '';
  }

  function selectOption(btn, key) {
    const container = btn.closest('.quiz-step');
    container.querySelectorAll('.quiz-option').forEach(function (b) {
      b.classList.remove('is-selected');
    });
    btn.classList.add('is-selected');
    answers[key] = btn.getAttribute('data-value');
  }

  steps.forEach(function (step) {
    const stepNum = parseInt(step.getAttribute('data-step'), 10);
    const options = step.querySelectorAll('.quiz-option[data-value]');

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        const keys = ['goal', 'industry', 'pain', 'timeline', 'budget'];
        const key = keys[stepNum - 1];
        if (key) {
          selectOption(opt, key);
          onOptionSelect();
        }
      });
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      goToStep(currentStep - 1);
    });
  }

  function canProceed() {
    if (currentStep === 6) return true;
    const keys = ['goal', 'industry', 'pain', 'timeline', 'budget'];
    return !!answers[keys[currentStep - 1]];
  }

  function updateNextState() {
    if (nextBtn) {
      nextBtn.disabled = !canProceed();
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (!canProceed()) return;
      goToStep(currentStep + 1);
    });
  }

  function onOptionSelect() {
    updateNextState();
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('quiz-name');
      const contactInput = document.getElementById('quiz-contact');
      const nameError = document.getElementById('quiz-name-error');
      const contactError = document.getElementById('quiz-contact-error');
      const submitBtn = document.getElementById('quiz-submit');

      nameError.textContent = '';
      contactError.textContent = '';
      var valid = true;

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Name is required';
        valid = false;
      }
      if (!contactInput.value.trim()) {
        contactError.textContent = 'Telegram or WhatsApp is required';
        valid = false;
      }
      if (!valid) return;

      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            form.innerHTML = '<p class="form-success" style="color: var(--accent); font-weight: 600;">Request sent! We\'ll reply within a few hours.</p>';
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          if (contactError) {
            contactError.textContent = 'Something went wrong. Try Telegram: @volknick';
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;
          }
        });
    });
  }

  goToStep(1);
  updateNextState();
})();
