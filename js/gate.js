const ACCESS_CODE = '070726';
const STORAGE_KEY = 'feedback-hub-unlock';

document.addEventListener('DOMContentLoaded', initAccessGate);

function initAccessGate() {
  const gate = document.getElementById('access-gate');
  const protectedEl = document.querySelector('.article-protected');
  if (!gate || !protectedEl) return;

  const form = gate.querySelector('.gate-form');
  const input = gate.querySelector('.gate-input');
  const error = gate.querySelector('.gate-error');

  if (sessionStorage.getItem(STORAGE_KEY) === '1') {
    unlock(gate, protectedEl);
    return;
  }

  document.body.classList.add('article-locked');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();

    if (value === ACCESS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, '1');
      error.textContent = '';
      unlock(gate, protectedEl);
      return;
    }

    error.textContent = 'Неверный код';
    input.value = '';
    input.focus();
    gate.classList.add('gate--shake');
    setTimeout(() => gate.classList.remove('gate--shake'), 400);
  });

  input.focus();
}

function unlock(gate, protectedEl) {
  document.body.classList.remove('article-locked');
  gate.classList.add('gate--hidden');
  protectedEl.removeAttribute('hidden');
  gate.setAttribute('aria-hidden', 'true');
}
