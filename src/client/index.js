
/* jshint esversion:6 */

import { generate } from './js/app.js';

import './styles/style.scss';

const button = document.getElementById('generate');
button.addEventListener("click", generate);

export { generate };
