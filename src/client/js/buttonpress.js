/*jshint esversion:8*/

async function delayedSetImage(inputTerm, imageLocation) {
  // fetchCurrent
  contrivedReturn(imageLocation);
}

// delayedImageDisplay = new Promise((resolveFunction, rejectFunction) => {
//   setTimeout(resolveFunction, 3000);
// });

// function testDelayReturnImg(img) {
//   console.log('testDelayReturnImg called');
//   delay();
//   //setTimeout(actualReturn, 3000);
// }

function contrivedReturn(imageLocation) {
  console.log('delay called');
  setTimeout(actualReturn, 3000, imageLocation);
}

function actualReturn(imageLocation) {
  console.log(`actualReturn Called`);
  imageLocation.src = 'https://cdn.pixabay.com/photo/2013/11/25/09/47/buildings-217878_150.jpg';
}


function addTravelCard() {
  console.log('Add travel card presed ');
  //createNewTravelInfoCard();
}

function addUserInputCard() {
  console.log('Add User Input card pressed');
  createUserInputCard();
}

function replaceWithInfoCard() {
  console.log('You want to replace with Information Card');
  if (userInputIsValid()) {
  // Pull user data parse for use with creating new TravelInfoCard;
    let userData = gatherDataFromUserToJSON();
    createNewTravelInfoCard(userData);
    deleteLastUserInputCard();
  }
}

function userInputIsValid() {
  var overallValidity = true;
  console.log(document.getElementById('placename').value);
  let inputDate = document.getElementById('travelDay');
  let travelDate = new Date((inputDate.value).replace(/-/g,'\/'));
  let todaysDate = new Date(Date.now());

  if (!inputDate.value) {
    overallValidity = false;
    console.log('date input is null', inputDate.value);
    document.getElementById('travelDayWarning').style.visibility = 'visible';
  } else if (dateDifference(todaysDate,travelDate) < 0) {
    overallValidity = false;
    console.log('Cannot travel yesterday');
    document.getElementById('travelDayWarning').style.visibility = 'visible';
  } else {
    console.log('date input is good', inputDate.value);
    console.log(`date length ${inputDate.value.length}`);
    document.getElementById('travelDayWarning').style.visibility = 'hidden';
  }

  let placeValue = document.getElementById('placename').value;
  if ( placeValue != null && placeValue != "") {
     document.getElementById('placenameWarning').style.visibility = 'hidden';
     console.log(`the inputvalue:${placeValue}:|`);
   } else {
     overallValidity = false;
     document.getElementById('placenameWarning').style.visibility = 'visible';
   }
   return overallValidity;
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

function createUserInputCard() {
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

function weatherForecastLabel(typeOfWeathercast) {
  if (typeOfWeathercast == 'current'){
    return 'The current weather';
  } else if (typeOfWeathercast == 'forecast' ) {
    return 'The forecast for then';
  } else {
    return 'Typical weather for then';
  }
}

async function createNewTravelInfoCard(userJSONData) {

  const placename = document.getElementById('placename');

  let dateJSON = dateProcessing();

  let departDate = new Date((document.getElementById('travelDay').value).replace(/-/g,'\/'));

  let placeName = document.getElementById('placename').value;

  var travelCard = document.createElement('div');
  travelCard.classList.add("travelCard");

  // Destination Image Cretaion
  var img = document.createElement('img');
  //testDelayReturnImg(img);

  console.log('Calling fetchPixabay');
  fetchPixabayImageFromServer(placename.value,img);
  //delayedSetImage(placename, img);

  console.log('Returned from calling fetchPixabay');
  //img.setAttribute('src',imageAddress);



  // Information stack
  var stack = document.createElement('div');
  stack.classList.add("informationStack");
  stack.innerHTML =
  `<div class="informationStack">
      <div>My Trip to: ${placeName}</div>
      <div>Departing: ${departDate}</div>
      <div>Save trip remove trip </div>
      <div>${placeName} is ${dateJSON.daysAway} days away </div>
      <div>${weatherForecastLabel(dateJSON.typeOfWeathercast)} is: </div>
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

function dateProcessing() {
  // Process date entry logic.
  let inputDate = document.getElementById('travelDay');
  let travelDate = new Date((inputDate.value).replace(/-/g,'\/'));
  let sixteenDaysFromToday = getFutureDateFrom(new Date(Date.now()),16);
  let todaysDate = new Date(Date.now());

  console.log(`today is ${todaysDate}`);
  console.log(`travelday is ${travelDate}`);
  let dateDiff = dateDifference(todaysDate,travelDate);

  var typeOfWeathercast = 'current';

  if (travelDate.getFullYear() == todaysDate.getFullYear()
    && travelDate.getMonth() == todaysDate.getMonth()
    && travelDate.getDate() == todaysDate.getDate())
    {
   // If today retrieve current weatherURL
    console.log('Your traveling today use current weather');
    typeOfWeathercast = 'current';
    //fetchCurrent({lat:1, long:2});

  } else if (travelDate < sixteenDaysFromToday) {
    // If tomorrow till 16 days later use forecast
    console.log('Your traveling in the forecastable region');
    //fetchWeatherForecast({lat:1, long:2});
    typeOfWeathercast = 'forecast';
  } else {
  // If past 16 days use historical numbers
    console.log('We must use historical data');
    //fetchClimateNormals({lat:1, long:2});
    typeOfWeathercast = 'climate';
  }
  return {daysAway:dateDiff, typeOfWeathercast:typeOfWeathercast};
}

function getFutureDateFrom(date, daysAhead) {
  return new Date(date.getTime() +  (daysAhead * 24 * 60 * 60 * 1000));
}

function dateDifference(startDate, endDate) {
  let millisecondDiff = endDate - startDate;
  let days = Math.ceil(millisecondDiff / (24*60*60*1000));
  console.log(`${days} away`);
  return days;
}

async function fetchPixabayImageFromServer(input,imageElement) {
  console.log('fetchPixabayImageFromServer buttonpress Definition');
  console.log('looking for,',input);
    const jsonText = {data: input};
    await fetch('http://localhost:9000/pixabay', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonText)
    })
    .then( res => res.json() )
    .then( data => {
      console.log('Received JSON', typeof data);
      console.log(data);
      console.log(data.data);
      imageElement.src = data.data;
      //console.log(data.stuff);
      return data;
    })
    .catch(function(error) {
      console.log('Sorry error with getting sentiment',error);
    });
}

export { addTravelCard, addUserInputCard, replaceWithInfoCard };
