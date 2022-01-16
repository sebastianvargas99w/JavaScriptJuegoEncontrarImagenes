function createAction() {
  window.location.replace('html/crear.xhtml');
}

function joinAction() {
  window.location.replace('html/unirse.xhtml');
}

function setup() {
  document.getElementById('create').addEventListener('click', createAction);
  document.getElementById('join').addEventListener('click', joinAction);
}

window.addEventListener('load', setup);
