
/* jshint esversion:8*/

// Test if browser has date inputs
let isDateSupported = function () {
	let input = document.createElement('input');
	let value = 'a';
	input.setAttribute('type', 'date');
	input.setAttribute('value', value);
	return (input.value !== value);
};


function createUserInputCard() {

  // Just collapse the addLeg button so there is no space
  let addLegButton = document.getElementById('addTravelLegButton');
  addLegButton.style.display = 'none';

  let userInputCard = document.createElement('div');
  userInputCard.setAttribute('id','lastUserInputCard');
  userInputCard.classList.add('input_card');

  let placename = document.createElement('div');
  placename.innerHTML =
    `<label for="zip">Enter Placename here</label>
    <input type="text" class='input_area' id="placename" value="" placeholder="Enter Placename here">
    <label class="warning" id="placenameWarning" visibility="hidden">Enter a valid place name (hint: city, state)</label>`
  let travelDate = document.createElement('div');
  travelDate.innerHTML =
    `<label>Enter your date of Travel:</label>
    ${inputDatepicker()}
    <label class="warning" id="travelDayWarning" visibility="hidden">${warningMessage()}</label>`;

  //add a submit button
  let submitButton = document.createElement('button');
  submitButton.setAttribute('id','travelInfoButton');
  submitButton.setAttribute('type','button');
  submitButton.innerHTML = 'Get Travel Info';
  submitButton.setAttribute('onclick','Client.replaceWithInfoCard()');
  submitButton.classList.add('main_buttons');

  // Create the card
  userInputCard.appendChild(placename);
  userInputCard.appendChild(travelDate);
  userInputCard.appendChild(submitButton);

  // Display the card
  let cardContainer = document.getElementById('listcontainer');
  cardContainer.insertBefore(userInputCard, addLegButton);
}

function inputDatepicker() {
  if (isDateSupported()) {
    return `<input type="date" class='input_area' id="travelDay" name="travelDay">`;
  } else {
    return `<input type='text' class='input_area' placeholder='DD/MM/YYYY' id="travelDay" name="travelDay">`;
  }
}

function warningMessage() {
  if (isDateSupported()) {
    return `Enter a valid date`;
  } else {
    return `Enter a valid date of the form DD/MM/YYYY`;
  }
}

export {isDateSupported, createUserInputCard };
