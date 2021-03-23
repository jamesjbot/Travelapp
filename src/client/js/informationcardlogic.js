
/*jshint esversion:8*/

async function createNewTravelInfoCard(userJSONData) {

  let addLegButton = document.getElementById('addTravelLegButton');
  console.log('Changing addtravellegButton to block');
  addLegButton.style.display = 'block';

  const placename = document.getElementById('placename');
  let dateJSON = dateProcessing();
  let departDate = new Date((document.getElementById('travelDay').value).replace(/-/g,'\/'));
  let placeName = document.getElementById('placename').value;

  // Create travelCard
  var travelCard = document.createElement('div');
  travelCard.classList.add("travelCard");
  // Destination Image Cretaion
  console.log('Calling fetchPixabay');
  var updateImageTarget = document.createElement('img');
  fetchPixabayImageFromServer(placename.value,updateImageTarget);
  //TODO Return original code
  //debugdelayedSetImage(placename, img);

  console.log('Returned from calling fetchPixabay');
  //img.setAttribute('src',imageAddress);

  // Information stack
  var stack = document.createElement('div');
  stack.classList.add("informationStack");
  stack.innerHTML =
  `<div class='informationStack'>
      <div>My Trip to: ${placeName}</div>
      <div>Departing: ${departDate.toDateString()}</div>
      <div>
        <button class='inline_button' >+ TODO: Save trip</button>
        <button class='inline_button' onclick='Client.removeInformationCard(this)''>-- Remove Trip</button>
      </div>
      <div>${placeName} is ${dateJSON.daysAway} ${dateJSON.daysLabel} away </div>
      <div>${weatherForecastLabel(dateJSON.typeOfWeathercast)} is: </div>
      <div>High -46 Low -35 </div>
      <div>Mostly cloudy throught the day </div>
    </div>`;

  travelCard.appendChild(updateImageTarget);
  travelCard.appendChild(stack);

  let cardContainer = document.getElementById('listcontainer');

  cardContainer.insertBefore(travelCard, addLegButton);

  console.log("I should have just set the addLegButton to block");
}

function displayParentName(element) {
  console.log('I got element', element);
}

// Processes the date so that we know which type of forecast to display
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

  let daysLabel = (dateDiff == 1) ? 'day' : 'days';

  return {daysAway:dateDiff, typeOfWeathercast:typeOfWeathercast, daysLabel:daysLabel};
}


// Return the elapsed days between start and end dates
function dateDifference(startDate, endDate) {
  let millisecondDiff = endDate - startDate;
  let days = Math.ceil(millisecondDiff / (24*60*60*1000));
  console.log(`${days} away`);
  return days;
}

function getFutureDateFrom(date, daysAhead) {
  return new Date(date.getTime() +  (daysAhead * 24 * 60 * 60 * 1000));
}


// Return the content for the weather Forecast Label
function weatherForecastLabel(typeOfWeathercast) {
  if (typeOfWeathercast == 'current'){
    return 'The current weather';
  } else if (typeOfWeathercast == 'forecast' ) {
    return 'The forecast for then';
  } else {
    return 'Typical weather for then';
  }
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

export { createNewTravelInfoCard, dateDifference, displayParentName };
