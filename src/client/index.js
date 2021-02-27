
/* jshint esversion:6 */

// TODO: Remove addTravelCard
import { addTravelCard, addUserInputCard } from './js/buttonpress';
import { generate } from './js/app';
import { populateDays, populateYears} from './js/datelogic';

import './styles/style.scss';

// Attach EventListener to button
const legbutton = document.getElementById('addTravelLegButton');
legbutton.addEventListener("click", addUserInputCard);

const button = document.getElementById('generate');
button.addEventListener("click", generate);

// define variables
var nativePicker = document.querySelector('.nativeDatePicker');
var fallbackPicker = document.querySelector('.fallbackDatePicker');
var fallbackLabel = document.querySelector('.fallbackLabel');

var yearSelect = document.querySelector('#year');
var monthSelect = document.querySelector('#month');
var daySelect = document.querySelector('#day');

// hide fallback initially
fallbackPicker.style.display = 'none';
fallbackLabel.style.display = 'none';

//preserve day selection
var previousDay;

// test whether a new date input falls back to a text input or not
var test = document.createElement('input');

try {
  test.type = 'date';
} catch (e) {
  console.log(e.description);
}

// if it does, run the code inside the if() {} block
if(test.type === 'text') {
  // hide the native picker and show the fallback
  nativePicker.style.display = 'none';
  fallbackPicker.style.display = 'block';
  fallbackLabel.style.display = 'block';

  // populate the days and years dynamically
  // (the months are always the same, therefore hardcoded)
  populateDays(monthSelect.value, daySelect, yearSelect, previousDay);
  populateYears(document, yearSelect, monthSelect);
}

// when the month or year <select> values are changed, rerun populateDays()
// in case the change affected the number of available days
yearSelect.onchange = function() {
  populateDays(monthSelect.value, daySelect, yearSelect, previousDay);
};

monthSelect.onchange = function() {
  populateDays(monthSelect.value, daySelect, yearSelect, previousDay);
};

// update what day has been set to previously
// see end of populateDays() for usage
daySelect.onchange = function() {
  previousDay = daySelect.value;
};

export { generate };
