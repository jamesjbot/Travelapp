
/* jshint esversion:8*/

function createUserInputCard() {
  console.log('createUserInputCard called');

  // Just collapse the addLeg button so there is no space
  let addLegButton = document.getElementById('addTravelLegButton');
  addLegButton.style.display = 'none';

  var userInputCard = document.createElement('div');
  userInputCard.setAttribute('id','lastUserInputCard');
  // TODO: Add a class
  //userInputCard.classList.add();
  let placename = document.createElement('div');
  placename.innerHTML =
    `<label for="zip">Enter Placename here</label>
    <input type="text" id="placename" value="" placeholder="Enter Placename here">
    <label class="warning" id="placenameWarning" visibility="hidden">Enter a valid place name (hint: city, state)</label>`
  let travelDate = document.createElement('div');
  travelDate.innerHTML =
    `<label for="bday">Enter your date of Travel:</label>
    <input type="date" id="travelDay" name="travelDay">
    <label class="warning" id="travelDayWarning" visibility="hidden">Enter a valid date</label>`;

  //add a submit button
  let submitButton = document.createElement('button');
  submitButton.setAttribute('id','travelInfoButton');
  submitButton.setAttribute('type','button');
  submitButton.innerHTML = 'Get Travel Info';
  submitButton.setAttribute('onclick','Client.replaceWithInfoCard()');

  // Create the card
  userInputCard.appendChild(placename);
  userInputCard.appendChild(travelDate);
  userInputCard.appendChild(submitButton);

  // Display the card
  let cardContainer = document.getElementById('listcontainer');
  cardContainer.insertBefore(userInputCard, addLegButton);
}

export default createUserInputCard ;
