function instructionAction() {
  const popup = document.getElementById('instructions-content');
  document.getElementById('about-content').classList.remove('show');
  popup.classList.toggle('show');
}

function aboutAction() {
  const popup = document.getElementById('about-content');
  document.getElementById('instructions-content').classList.remove('show');
  popup.classList.toggle('show');
}

function setupNavListeners() {
  document.getElementById('instructions').addEventListener('click', instructionAction);
  document.getElementById('instructions-content').addEventListener('click', instructionAction);
  document.getElementById('about').addEventListener('click', aboutAction);
  document.getElementById('about-content').addEventListener('click', aboutAction);
}

window.addEventListener('load', setupNavListeners);
