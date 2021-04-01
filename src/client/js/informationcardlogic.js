
/*jshint esversion:8*/
const CURRENT = 'CURRENT';
const FORECAST = 'FORECAST';
const CLIMATE = 'CLIMATE';

import getWeatherPromise from './getWeather';

// Get the lat long of placename from Geonmaes API
 function getLatLongLocationPromise(input){
    console.log('buttonpress getLatLongLocation recevied:',input);
    const jsonText = {data: input};

    return fetch('http://localhost:9000/location', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonText)
    });
}

async function fillinWeatherAsynchronously(weather_Type,
                                           from_placename,
                                           uiupdate_temperature,
                                           uiupdate_weather_description,
                                           month_day) {
  console.log('blah, blah, getLocationThenWeatherCalled');
  // this needs to be a promise wrapped in a promise
  getLatLongLocationPromise(from_placename)
    .then( res => res.json() )
    .then( json_Location => {
      console.log('Received from server',json_Location);
      return getWeatherPromise(json_Location,
                               weather_Type,
                               month_day);
    })
    .then( data => {
      // Update the UI Weather elements
      console.log('-->fillinWeather received',data);
      updateUIElementsBasedOn(weather_Type,
                              data,
                              uiupdate_temperature,
                              uiupdate_weather_description
                              );
      return;
      //uiupdate_temperature.innerHTML = `High: ${data.high} Low:${data.low}`;
      //uiupdate_weather_description.innerHTML = data.description;
    })
    .catch(function(error) {
      console.log('Sorry error with getting location or weather',error);
    });
}

function updateUIElementsBasedOn(typeOfWeathercast,
                                 data,
                                 uiupdate_temperature,
                                 uiupdate_weather_description) {

  //uiupdate_temperature.innerHTML = `High: ${data.high} Low:${data.low}`;
  //console.log('target ui temp',uiupdate_temperature);
  //console.log('target ui desc',uiupdate_weather_description);
  console.log('typeOfWeathercast',typeOfWeathercast);
  //uiupdate_temperature.innerHTML = 'haha overriden';
  if (typeOfWeathercast == CURRENT){
    console.log('--> Update with current');
    uiupdate_temperature.innerHTML = `Temperature: ${data.temp}`;
    // TODO This is duplicated change to a function
    uiupdate_weather_description.innerHTML = data.description;

    //return 'The current weather';
  } else if (typeOfWeathercast == FORECAST) {
    uiupdate_temperature.innerHTML = `High: ${data.hitemp} Low: ${data.lowtemp}`;
    // TODO this is duplicated create a function
    uiupdate_weather_description.innerHTML = data.description;

    //uiupdate_weather_description.innerHTML = `${data.description}`;
    //uiupdate_temperature.innerHTML = `High: ${data.high} Low:${data.low}`;

    //return 'The forecast for then';
  } else if (typeOfWeathercast == CLIMATE){
    uiupdate_weather_description =
    'The day is too far in the future to forecast weather';
    //uiupdate_temperature.innerHTML = `Average Temperatue: ${data.avgtemp}`;
    //uiupdate_weather_description.innerHTML =
    //`Max temperature: ${data.maxtemp} Min temperature: ${data.mintemp}`;
    //return 'Typical weather for then';
  }
}


// TODO: Remove old prototyep methods
//async function createNewTravelInfoCard(userJSONData) {
async function createNewTravelInfoCard() {

  let dateJSON = dateProcessing();

  let place_Name = document.getElementById('placename').value;
  let depart_Date = new Date((document.getElementById('travelDay').value).replace(/-/g,'\/'));

  let temperature_div = document.createElement('div');
  let weather_description_div = document.createElement('div');
  temperature_div.innerHTML = 'Getting Temperature';
  weather_description_div.innerHTML = 'Getting Weather';

  console.log('informationLogig #94 weathertype',dateJSON.typeOfWeathercast);
  if (dateJSON.typeOfWeathercast == CURRENT || dateJSON.typeOfWeathercast == FORECAST) {
    fillinWeatherAsynchronously(dateJSON.typeOfWeathercast,
                                place_Name,
                                temperature_div,
                                weather_description_div,
                                dateJSON.month_day);
  } else {
    temperature_div.innerHTML = '';
    weather_description_div.innerHTML = 'Travel date is too far to forecast weather';
  }


  // Show the Add Travel Leg Button
  let addLegButton = document.getElementById('addTravelLegButton');
  console.log('Changing addtravellegButton to block');
  addLegButton.style.display = 'block';

  //const placename = document.getElementById('placename');


  // Create travelCard
  var travelCard = document.createElement('div');
  travelCard.classList.add("travel_card");
  // Destination Image Cretaion
  console.log('Calling fetchPixabay');
  var update_Image_Target = document.createElement('img');
  fetchPixabayImageFromServer(place_Name, update_Image_Target);

  //TODO Return original code
  //debugdelayedSetImage(placename, img);

  console.log('Returned from calling fetchPixabay');
  //img.setAttribute('src',imageAddress);

  // Information stack
  var stack = document.createElement('div');
  stack.classList.add("information_stack");
  stack.innerHTML =
      `<div>My Trip to: ${place_Name}</div>
      <div>Departing: ${depart_Date.toDateString()}</div>
      <div>
        <button class='inline_button' onclick='Client.removeInformationCard(this)''>&minus; Remove Trip</button>
      </div>
      <div>${place_Name} is ${dateJSON.daysAway} ${dateJSON.daysLabel} away </div>
      <div>${weatherForecastLabel(dateJSON.typeOfWeathercast)}</div>`;
      // The weather if possible will fall below these lines like this,
      //<!--div id="temperature_div">High 9999 Low -6666 </div-->
      //<!--div id="weather_descrition">Mostly cloudy throught the day </div-->

  stack.appendChild(temperature_div);
  stack.appendChild(weather_description_div);

  travelCard.appendChild(update_Image_Target);
  travelCard.appendChild(stack);

  let cardContainer = document.getElementById('listcontainer');

  cardContainer.insertBefore(travelCard, addLegButton);
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

  // Default value for type of weathercase
  var typeOfWeathercast = CURRENT;

  if (travelDate.getFullYear() == todaysDate.getFullYear()
    && travelDate.getMonth() == todaysDate.getMonth()
    && travelDate.getDate() == todaysDate.getDate())
    {
   // If today retrieve current weatherURL
    console.log('Your traveling today use current weather');
    typeOfWeathercast = CURRENT;
    //fetchCurrent({lat:1, long:2});

  } else if (travelDate < sixteenDaysFromToday) {
    // If tomorrow till 16 days later use forecast
    console.log('Your traveling in the forecastable region');
    //fetchWeatherForecast({lat:1, long:2});
    typeOfWeathercast = FORECAST;
  } else {
  // If past 16 days use historical numbers
    console.log('We must use historical data');
    //fetchClimateNormals({lat:1, long:2});
    typeOfWeathercast = CLIMATE;
  }

  let daysLabel = (dateDiff == 1) ? 'day' : 'days';

  let month_day = {month:travelDate.getMonth(), day:travelDate.getDate()};

  return {daysAway:dateDiff, typeOfWeathercast:typeOfWeathercast,
          daysLabel:daysLabel, month_day:month_day};
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
  if (typeOfWeathercast == CURRENT ){
    return '<div> The current weather is:</div>';
  } else if (typeOfWeathercast == FORECAST ) {
    return '<div>The forecast for then is:</div>';
  } else if (typeOfWeathercast == CLIMATE ){
    return '';
  } else {
    throw new Error("Type of Weather forecast type is unrecogized");
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
      console.log('Sorry error with getting pixabay image',error);
    });
}

export { createNewTravelInfoCard, dateDifference, getFutureDateFrom };
