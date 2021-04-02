
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

  let place_element = document.getElementById('placename');
  let place_Name = document.getElementById('placename').value;

  let depart_Date = convertInputDateToJavascriptDate();

  let temperature_div = document.createElement('div');
  temperature_div.innerHTML = 'Getting Temperature';

  let weather_description_div = document.createElement('div');
  weather_description_div.innerHTML = 'Getting Weather';

  let output_placename_div = document.createElement('div');
  output_placename_div.innerHTML = `<div>${place_Name} is ${dateJSON.daysAway}
                            ${dateJSON.daysLabel} away </div>`;

  if (dateJSON.typeOfWeathercast == CURRENT ||
      dateJSON.typeOfWeathercast == FORECAST) {
    fillinWeatherAsynchronously(dateJSON.typeOfWeathercast,
                                place_Name,
                                temperature_div,
                                weather_description_div,
                                dateJSON.month_day,
                                output_placename_div);
  } else {
    temperature_div.innerHTML = '';
    weather_description_div.innerHTML = 'Travel date is too far to forecast weather';
  }

  // Show the Add Travel Leg Button
  let addLegButton = document.getElementById('addTravelLegButton');
  addLegButton.style.display = 'block';

  // Create travelCard
  let travelCard = document.createElement('div');
  travelCard.classList.add("travel_card");

  // Destination Image Cretaion
  let figure = document.createElement('figure');
  let figure_caption = document.createElement('figurecaption');
  let update_Image_Target = document.createElement('img');
  figure.appendChild(update_Image_Target);
  figure.appendChild(figure_caption);
  fetchPixabayImageFromServer(place_Name, update_Image_Target, figure_caption);

  // Information stack
  let stack = createInformationStack(place_Name,
                                     depart_Date,
                                     dateJSON,
                                     temperature_div,
                                     weather_description_div,
                                     output_placename_div);

  travelCard.appendChild(figure);
  travelCard.appendChild(stack);

  let cardContainer = document.getElementById('listcontainer');

  cardContainer.insertBefore(travelCard, addLegButton);
}


function createInformationStack(   place_Name,
                                   depart_Date,
                                   dateJSON,
                                   temperature_div,
                                   weather_description_div,
                                   output_placename_div) {
  let stack = document.createElement('div');
  stack.classList.add("information_stack");
  stack.innerHTML =
      `
      <div>My Trip to: ${place_Name}</div>
      <div>Departing: ${depart_Date.toDateString()}</div>
      <div>
        <button class='inline_button' onclick='Client.removeInformationCard(this)''>&minus; Remove Trip</button>
      </div>`;
      // The weather if possible will fall below these lines like this,
      //<div>${place_Name} is ${dateJSON.daysAway} ${dateJSON.daysLabel} away </div>
      //<div>${weatherForecastLabel(dateJSON.typeOfWeathercast)}</div>
      //<!--div id="temperature_div">High 9999 Low -6666 </div-->
      //<!--div id="weather_descrition">Mostly cloudy throught the day </div-->
  stack.appendChild(output_placename_div);
  let forecastlabel = document.createElement('div');
  forecastlabel.innerHTML = `<div>${weatherForecastLabel(dateJSON.typeOfWeathercast)}</div>`;
  stack.appendChild(forecastlabel);
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


async function fillinWeatherAsynchronously(weather_Type,
                                           from_placename,
                                           uiupdate_temperature,
                                           uiupdate_weather_description,
                                           month_day,
                                           output_placename_div) {
  getLatLongLocationPromise(from_placename)
    .then( res => res.json() )
    .then( json_Location => {
      if (json_Location.exists == true) {
        replacePlacenameInDiv(output_placename_div, json_Location);
        return getWeatherPromise(json_Location,
                                 weather_Type,
                                 month_day);
      } else {
        output_placename_div.innerHTML = `You've entered a nonexistent place: `+
                                         `${from_placename}`;
        uiupdate_temperature.innerHTML = 'impossible to know!';
        uiupdate_weather_description.innerHTML = '';
        throw 'Unknown location';
      }
    })
    .then( weather_data => {
      // Update the UI Weather elements
      updateUIElementsBasedOn(weather_Type,
                              weather_data,
                              uiupdate_temperature,
                              uiupdate_weather_description);
      return;
    })
    .catch(function(error) {
      console.log('Sorry error with getting location or weather',error);
    });
}

function replacePlacenameInDiv(output_placename_div, json_Location) {
  let original = output_placename_div.innerHTML;
  let indexOfIs = original.indexOf('is');
  let indexOfcarat = original.indexOf('>');
  let old = original.substring(indexOfcarat+1,indexOfIs);
  let replacement = `${json_Location.toponym}, ${json_Location.admincode} `;
  let newString = original.replace(old,replacement);
  output_placename_div.innerHTML = newString;
}


// Get the lat long of placename from Geonmaes API
function getLatLongLocationPromise(input){
    const jsonText = {data: input};
    return fetch('http://localhost:9000/location', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonText)
    });
}


function updateUIElementsBasedOn(typeOfWeathercast,
                                 data,
                                 uiupdate_temperature,
                                 uiupdate_weather_description) {

  if (typeOfWeathercast == CURRENT){

    uiupdate_temperature.innerHTML = `Temperature: ${data.temp}`;
    uiupdate_weather_description.innerHTML = data.description;

  } else if (typeOfWeathercast == FORECAST) {

    uiupdate_temperature.innerHTML = `High: ${data.hitemp} Low: ${data.lowtemp}`;
    uiupdate_weather_description.innerHTML = data.description;

  } else if (typeOfWeathercast == CLIMATE){
    uiupdate_weather_description =
    'The day is too far in the future to forecast weather';
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
  let typeOfWeathercast = CURRENT;

  if (travelDate.getFullYear() == todaysDate.getFullYear() &&
    travelDate.getMonth() == todaysDate.getMonth() &&
    travelDate.getDate() == todaysDate.getDate()) {
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


async function fetchPixabayImageFromServer(input,imageElement,caption) {
    const jsonText = {data: input};
    await fetch('http://localhost:9000/pixabay', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonText)
    })
    .then( res => res.json() )
    .then( data => {
      if (data.data == 'No hits') {
        caption.innerHTML = 'No Image Available';
      } else {
        imageElement.src = data.data;
        return data;
      }
    })
    .catch(function(error) {
      console.log('Sorry error with getting pixabay image',error);
    });
}

export { createNewTravelInfoCard };
