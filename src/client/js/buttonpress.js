/*jshint esversion:8*/

function addTravelCard() {
  console.log('Add travel card presed ');
  createNewTravelInfoCard();
}

function addUserInputCard() {
  console.log('Add User Input card pressed');
  createUserInputCard();
}

function replaceWithInfoCard() {
  // TODO Replace card with travel log.
  console.log('You want to replace with Information Card');
  deleteLastUserInputCard();
  createNewTravelInfoCard();
}

function deleteLastUserInputCard() {
  let inputCard = document.getElementById('lastUserInputCard');
  document.getElementById('listcontainer').removeChild(inputCard);
}

function createUserInputCard() {
  var userInputCard = document.createElement('div');
  userInputCard.setAttribute('id','lastUserInputCard');
  // TODO: Add a class
  //userInputCard.classList.add();
  let placename = document.createElement('div');
  placename.innerHTML =
    `<label for="zip">Enter Placename here</label>
    <input type="text" id="placename" placeholder="Enter Placename here">`;
  let travelDate = document.createElement('div');
  travelDate.innerHTML =
    `<label for="bday">Enter your date of Travel:</label>
    <input type="date" id="travelday" name="travelday">`;

    //add a submit button
    let submitButton = document.createElement('button');
    submitButton.setAttribute('type','button');
    submitButton.innerHTML = 'Get Travel Info';
    submitButton.setAttribute('onclick','Client.replaceWithInfoCard()');

    // Create the card
    userInputCard.appendChild(placename);
    userInputCard.appendChild(travelDate);
    userInputCard.appendChild(submitButton);

    // Display the card
    let cardContainer = document.getElementById('listcontainer');
    let addLegButton = document.getElementById('addTravelLegButton');
    cardContainer.insertBefore(userInputCard, addLegButton);
    addLegButton.style.visibility = 'hidden';
}


function createNewTravelInfoCard() {
  var travelCard = document.createElement('div');
  travelCard.classList.add("travelCard");
  var img = document.createElement('img');
  img.setAttribute('src',"https://www.niagarafallslive.com/wp-content/uploads/2017/08/opt-falls-background-1264x790-176k.jpg");
  var stack = document.createElement('div');
  stack.classList.add("informationStack");
  stack.innerHTML =
  `<div class="informationStack">
      <div>My Trip to: Paris, France</div>
      <div>Departing: </div>
      <div>Save trip remove trip </div>
      <div>Paris France is 220 days away </div>
      <div>Typical weather for then is: </div>
      <div>High -46 Low -35 </div>
      <div>Mostly cloudy throught the day </div>
    </div>`;
    travelCard.appendChild(img);
    travelCard.appendChild(stack);

    let cardContainer = document.getElementById('listcontainer');
    let addLegButton = document.getElementById('addTravelLegButton');
    cardContainer.insertBefore(travelCard, addLegButton);
    addLegButton.style.visibility = 'visible';
}


export { addTravelCard, addUserInputCard, replaceWithInfoCard };
