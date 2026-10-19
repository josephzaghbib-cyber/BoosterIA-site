'use strict';
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('#navigation a').forEach(link => {
  if (link.getAttribute('href') === page) link.setAttribute('aria-current', 'page');
});
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header-inner')) closeMenu();
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => {
    element.classList.add('js-reveal');
    observer.observe(element);
  });
}
const privacyDialog = document.querySelector('#privacy-dialog');
document.querySelectorAll('.privacy-open').forEach(button => button.addEventListener('click', () => privacyDialog.showModal()));
privacyDialog.querySelector('.dialog-close').addEventListener('click', () => privacyDialog.close());
privacyDialog.addEventListener('click', event => {
  if (event.target === privacyDialog) {
    const bounds = privacyDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) privacyDialog.close();
  }
});
const form = document.querySelector('#contact-form');
if (form) {
  const subject = new URLSearchParams(location.search).get('formation');
  if (['decouvrir', 'chatgpt', 'automatiser'].includes(subject)) form.elements.subject.value = subject;
  const messages = {
    name: 'Indiquez votre nom et prénom.',
    email: 'Indiquez une adresse e-mail valide.',
    subject: 'Choisissez le sujet de votre demande.',
    message: 'Écrivez un message de 20 caractères minimum.',
    consent: 'Confirmez avoir compris le fonctionnement de cette démonstration.'
  };
  function validate(field) {
    const value = field.value.trim();
    const valid = field.type === 'checkbox' ? field.checked : field.checkValidity() && value.length >= (field.name === 'message' ? 20 : 1);
    field.setAttribute('aria-invalid', String(!valid));
    field.setAttribute('aria-describedby', `${field.name}-error`);
    document.getElementById(`${field.name}-error`).textContent = valid ? '' : messages[field.name];
    return valid;
  }
  Object.keys(messages).forEach(name => {
    form.elements[name].addEventListener('input', () => {
      document.querySelector('#form-status').textContent = '';
      if (form.elements[name].hasAttribute('aria-invalid')) validate(form.elements[name]);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = Object.keys(messages).map(name => form.elements[name]).filter(field => !validate(field));
    const status = document.querySelector('#form-status');
    status.textContent = '';
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    status.textContent = 'Votre message est correctement renseigné. Ceci est une démonstration : aucun message n’a été envoyé ni enregistré. Le service de réception doit encore être configuré.';
    status.focus();
  });
}
