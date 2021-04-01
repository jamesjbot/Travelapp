/*jshint esversion:8*/

import { createUserInputCard, isDateSupported } from './userinputcardlogic';
import { createNewTravelInfoCard, dateDifference } from './informationcardlogic';

// icons for weatherbitApikey
let base_icon_addr = 'https://www.weatherbit.io/static/img/icons/';
//t01n.png

function addUserInputCard() {
  console.log('Add User Input card Called');
  createUserInputCard();
}

function replaceWithInfoCard() {
  console.log('You want to replace with Information Card');

  if (userInputIsValid()) {

    createNewTravelInfoCard();
    deleteLastUserInputCard();
  } else {

    console.log('user input in invalid');
  }
}

function userInputIsValid() {
  let overallValidity = true;

  // Check date validity
  if (isDateSupported()) { // Input object is date type
    if (!isInputDateTypeValid()) overallValidity = false;
  } else { // Genric Input Object in form
    if (!isGenericInputDateTypeValid())  overallValidity = false;
  }

  // Check placename validity
  if (!isPlacenameValid()) { //Only override overallValidity if invalid
    overallValidity = false;
  }

  return overallValidity;
}

function dateFromGenericInputString(genericDateString) {
  let year = genericDateString.substring(6);
  let month = genericDateString.substring(3,5) - 1;
  let day = genericDateString.substring(0,2);
  let travelDate = new Date(year, month, day);
  return travelDate;
}

function isGenericInputDateTypeValid() {
  let overallValidity = true;
  let regExp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/gi; // Non characters like blanks commas

  let inputDate = document.getElementById('travelDay');

  let travelDate = dateFromGenericInputString(inputDate.value);
  let todaysDate = new Date(Date.now());

  if (!regExp.test(inputDate.value)) {
    overallValidity = false;
    return overallValidity;
  }

  let validityOfDate = validateTodaysDateWith(travelDate);
  if (!validityOfDate) overallValidity = false;
  return overallValidity;
}

// Validity of input with type date
function isInputDateTypeValid() {
  var overallValidity = true;
  console.log(document.getElementById('placename').value);

  let inputDate = document.getElementById('travelDay');
  let travelDate = new Date((inputDate.value).replace(/-/g,'\/'));

  if (!inputDate.value) {
    document.getElementById('travelDayWarning').style.visibility = 'visible';
    return false;
  }

  let validityOfDate = validateTodaysDateWith(travelDate);

  if (!validityOfDate) overallValidity = false;
  return overallValidity;
}

function validateTodaysDateWith(travelDate) {
  let overallValidity = true;
  let todaysDate = new Date(Date.now());

  if (dateDifference(todaysDate,travelDate) < 0) {
    // Travelling before today
    overallValidity = false;
    document.getElementById('travelDayWarning').style.visibility = 'visible';
  } else {
    document.getElementById('travelDayWarning').style.visibility = 'hidden';
  }
  return overallValidity;
}


function isPlacenameValid() {
  let placeValue = document.getElementById('placename').value;
  if ( placeValue != null && placeValue != "") {
     document.getElementById('placenameWarning').style.visibility = 'hidden';
     console.log(`the inputvalue:${placeValue}:|`);
     return true;
   } else {
     document.getElementById('placenameWarning').style.visibility = 'visible';
     return false;
   }
}

function gatherDataFromUserToJSON() {
  let inputCard = document.getElementById('lastUserInputCard');
  let placeName = document.getElementById('placename').value;
  let travelDate = document.getElementById('travelDay').value;
  return {htmlElement: inputCard, place:placename, date:travelDate};
}


function deleteLastUserInputCard() {
  let inputCard = document.getElementById('lastUserInputCard');
  document.getElementById('listcontainer').removeChild(inputCard);
}

export { addUserInputCard, replaceWithInfoCard,
  validateTodaysDateWith, dateFromGenericInputString };
