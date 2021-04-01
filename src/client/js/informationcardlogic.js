
/*jshint esversion:8*/
import { isDateSupported } from './userinputcardlogic';
import { dateFromGenericInputString } from './buttonpress';
import { dateDifference, getFutureDateFrom } from './datelogic';
import getWeatherPromise from './getWeather';

const CURRENT = 'CURRENT';
const FORECAST = 'FORECAST';
const CLIMATE = 'CLIMATE';

async function createNewTravelInfoCard() {

  let dateJSON = convertInputDateToJSON();

  let place_Name = document.getElementById('placename').value;
  let depart_Date = convertInputDateToJavascriptDate();

  let temperature_div = document.createElement('div');
  let weather_description_div = document.createElement('div');
  temperature_div.innerHTML = 'Getting Temperature';
  weather_description_div.innerHTML = 'Getting Weather';

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
  addLegButton.style.display = 'block';

  // Create travelCard
  var travelCard = document.createElement('div');
  travelCard.classList.add("travel_card");

  // Destination Image Cretaion
  var update_Image_Target = document.createElement('img');
  fetchPixabayImageFromServer(place_Name, update_Image_Target);

  // Information stack
  let stack = createInformationStack(place_Name,
                                     depart_Date,
                                     dateJSON,
                                     temperature_div,
                                     weather_description_div);

  travelCard.appendChild(update_Image_Target);
  travelCard.appendChild(stack);

  let cardContainer = document.getElementById('listcontainer');

  cardContainer.insertBefore(travelCard, addLegButton);
}

function createInformationStack(place_Name,
                                   depart_Date,
                                   dateJSON,
                                   temperature_div,
                                   weather_description_div) {
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
  return stack;
}

function convertInputDateToJavascriptDate() {
  if (isDateSupported()) {
    return new Date((document.getElementById('travelDay').value).replace(/-/g,'\/'));
  } else {
    return dateFromGenericInputString(document.getElementById('travelDay').value);
  }
}

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


// Processes the date so that we know which type of forecast to display
function convertInputDateToJSON() {
  // Process date entry logic.

  let todaysDate = new Date(Date.now());
  let sixteenDaysFromToday = getFutureDateFrom(new Date(Date.now()),16);

  let inputDate = document.getElementById('travelDay');

  let travelDate;
  if (isDateSupported()) {
    travelDate = new Date((inputDate.value).replace(/-/g,'\/'));
  } else {
    travelDate = dateFromGenericInputString(inputDate.value);
  }

  let dateDiff = dateDifference(todaysDate,travelDate);

  // Default value for type of weathercase
  var typeOfWeathercast = CURRENT;

  if (travelDate.getFullYear() == todaysDate.getFullYear()
    && travelDate.getMonth() == todaysDate.getMonth()
    && travelDate.getDate() == todaysDate.getDate())
    {
   // If today retrieve current weatherURL
    typeOfWeathercast = CURRENT;

  } else if (travelDate < sixteenDaysFromToday) {
    // If tomorrow till 16 days later use forecast
    typeOfWeathercast = FORECAST;
  } else {
  // We can't forcast that far
    typeOfWeathercast = CLIMATE;
  }

  let daysLabel = (dateDiff == 1) ? 'day' : 'days';

  let month_day = {month:travelDate.getMonth(), day:travelDate.getDate()};

  return {daysAway:dateDiff, typeOfWeathercast:typeOfWeathercast,
          daysLabel:daysLabel, month_day:month_day};
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
      imageElement.src = data.data;
      return data;
    })
    .catch(function(error) {
      console.log('Sorry error with getting pixabay image',error);
    });
}

export { createNewTravelInfoCard };
