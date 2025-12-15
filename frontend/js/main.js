import { iniciarApp } from './controller/app-controller.js';
import { iniciarProjetoController } from './controller/projeto-controller.js';

window.addEventListener('DOMContentLoaded', () => {
  iniciarApp();
  iniciarProjetoController();
});
