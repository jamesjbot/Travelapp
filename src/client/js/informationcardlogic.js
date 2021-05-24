
/*jshint esversion:8*/
import { isDateSupported } from './userinputcardlogic';
import { dateFromGenericInputString } from './buttonpress';
import { dateDifference, getFutureDateFrom } from './datelogic';
import { getWeatherPromise } from './getWeather';

// TODO Remove 
//import { json } from 'body-parser';
//import { setMaxListeners } from '../../server/server';

const CURRENT = 'CURRENT';
const FORECAST = 'FORECAST';
const CLIMATE = 'CLIMATE';

let suffix = 0;

async function sendTripDataToServer(rawData) {
  await fetch('http://localhost:9000/postUserData', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawData)
  })
    .then(res => {
      if (res.status == '200') { return; } else { throw 'sending data to server error'; }
    })
    .catch(function (error) {
      console.log('Sorry error sending data to server', error);
    });
}

async function getTripDataFromServerThen(updatingUIFunction) {
  await fetch('http://localhost:9000/getUserData')
    .then(serializedData => serializedData.json())
    .then(data => {
      console.log('getTripDataFromServer returning readable data', data);
      updatingUIFunction(data);
      return data;
    })
}

async function createNewTravelInfoCard() {
  // TODO the server calls are happenening before we finish queryAll
  generateTravelInfoCardTemplate();
  let dateStats = createJSONDateStatsFromUserInputDate(getTodaysDate(), getUserInputDate(), isDateSupported());
  try {
    let rawTripData = await queryAll3APIBuildJSONOfUserData(getUserPlacename(), dateStats);
    await sendTripDataToServer(rawTripData);
    await getTripDataFromServerThen(updateUI);
    await incrementSuffix();
    // TODO REMOVE
    //console.log(await `informationcardlogic serverTripData ${serverTripData}`, serverTripData);
  } catch (error) {
    console.log(`Error creating new travel information card: ${error}`);
  }
}

async function generateTravelInfoCardTemplate() {
  console.log('gen TravelInfo Template called');
  // Save values locally
  let dateJSON = createJSONDateStatsFromUserInputDate( getTodaysDate(), getUserInputDate(),isDateSupported());

  // Create travelCard container
  let travelCard = document.createElement('div');
  travelCard.classList.add("travel_card");

  // Destination Image Cretaion
  let imageStack = createImageStack();

  // Information stack
  let informationStack = createInformationStack();

  travelCard.appendChild(imageStack);
  travelCard.appendChild(informationStack);

  // Show and get a target for the Add Travel Leg Button
  let addLegButton = document.getElementById('addTravelLegButton');
  addLegButton.style.display = 'block';

  // Insert travel card into DOM
  let cardContainer = document.getElementById('listcontainer');
  cardContainer.insertBefore(travelCard, addLegButton);
  console.log('finished add elements to dom');

}

function createImageStack() {
  let figureStack = document.createElement('figure');
  let figure_caption = document.createElement('figurecaption');
  figure_caption.id = 'figcaption' + suffix.toString();
  figure_caption.innerHTML = 'fetching image';
  let update_Image_Target = document.createElement('img');
  update_Image_Target.id = 'imgsrc' + suffix.toString();
  update_Image_Target.src = 'not-found.png';
  figureStack.appendChild(update_Image_Target);
  figureStack.appendChild(figure_caption);
  return figureStack;
}


function createInformationStack() {

  // TODO REMOVE
  // mytrip_div
  // depart_div
  // daysaway_div
  // forecastlabel_div
  // temperature_div
  // weather_description_div

  let dateStats = createJSONDateStatsFromUserInputDate( getTodaysDate(), getUserInputDate(), isDateSupported());

  let stack = document.createElement('div');
  stack.classList.add("information_stack");

  // My trip div
  let mytrip_div = document.createElement('div');
  mytrip_div.innerHTML = `<div id=${'mytrip' + suffix.toString()}>
  My Trip to: ${getUserPlacename()}</div>`;

  // depart_div
  let depart_div = document.createElement('div');
  depart_div.innerHTML = `Departing:
  ${convertUserInputDateToJavascriptDate().toDateString()}`;

  // button_div
  let button_div = document.createElement('div');
  button_div.innerHTML = `<button class='inline_button'
  onclick='Client.removeInformationCard(this)'>
  &minus; Remove Trip</button>`;

  // daysaway_div
  let daysaway_div = document.createElement('div');
  daysaway_div.id = 'daysaway' + suffix.toString();
  daysaway_div.innerHTML = `${getUserPlacename()} is ${dateStats.daysAway}
  ${dateStats.daysLabel} away`;

  // forecastlabel_div
  let forecastlabel_div = document.createElement('div');
  forecastlabel_div.id = 'forecastlabel' + suffix.toString() 
  forecastlabel_div.innerHTML = `Getting Forecast`;

  // temperature_div
  let temperature_div = document.createElement('div');
  temperature_div.id = 'temperatures' + suffix.toString();
  temperature_div.innerHTML = 'Getting Temperature';

  // weather_description_div
  let weather_description_div = document.createElement('div');
  weather_description_div.id = 'weatherdescription' + suffix.toString();
  weather_description_div.innerHTML = 'Getting Weather';

  stack.appendChild(mytrip_div);
  stack.appendChild(depart_div);
  stack.appendChild(button_div);
  stack.appendChild(daysaway_div);
  stack.appendChild(forecastlabel_div);
  stack.appendChild(temperature_div);
  stack.appendChild(weather_description_div);
  return stack;
}


function convertUserInputDateToJavascriptDate() {
  if (isDateSupported()) {
    return new Date((document.getElementById('travelDay').value).replace(/-/g, '\/'));
  } else {
    return dateFromGenericInputString(document.getElementById('travelDay').value);
  }
}


async function queryAll3APIBuildJSONOfUserData(from_placename, dateStats) {
  console.log('queryAll3 called');

  // TODO Should I be asking for weather when greater than 14 days away?
  // TODO When greater than 16 days away it says temp is undefined
  // TODO When greater than 16 days awa it says 'Error Calling Weatherbit' in description


  console.log(`Query all3 received these dateStats:$`, dateStats);
  try {
    let USEROUTPUTDATA = {};
    USEROUTPUTDATA.departDate = dateStats.departDate;
    USEROUTPUTDATA.daysAway = dateStats.daysAway;
    USEROUTPUTDATA.daysLabel = dateStats.daysLabel;
    USEROUTPUTDATA.typeOfWeathercast = dateStats.typeOfWeathercast;

    let serializedJSON = await getLatLongLocationPromise(from_placename);
    let temp = await serializedJSON.json();
    let json_Location = await temp;
    console.log(`json_Location: ${await json_Location}`, json_Location);
    
    if (json_Location.exists == false || json_Location.exists == null) throw 'Unknown Location';

    USEROUTPUTDATA.placename = await `${json_Location.toponym}, ${json_Location.admincode}`;

    // TODO REMOVE
    console.log(`the weathertype is ${dateStats.typeOfWeathercast}`);
  
    // TODO THIS WHOLE SECTION IS POPULATING DATA TO SEND TO THE SERVER
    if (dateStats.typeOfWeathercast == CLIMATE) {
    
      // TODO REMOVE
      // TODO is this section redundant, decide on replacing data here or replacing it in updateUI
      console.log('Climate section');
      USEROUTPUTDATA.forecastlabel_div = '-->This is the wrong forecast data';
      USEROUTPUTDATA.temperature_label = '-->No temperature available';
      USEROUTPUTDATA.description = '-->Travel date is too far to forecast weather';
      console.log('Exited Climate section');
    
    } else {
    
      temp = await getWeatherPromise(json_Location, 
                                     dateStats.typeOfWeathercast, 
                                     dateStats.daysAway , 
                                     dateStats.departDate,
                                     dateStats.month_day);
      let weatherData = await temp;
      console.log(`weather data from server ${await weatherData}`, weatherData);
      USEROUTPUTDATA.weatherDescription = await weatherData.description;
      if (weatherData.hasOwnProperty('hitemp')) {
        USEROUTPUTDATA.temperature_label = `High: ${weatherData.hitemp} Low: ${weatherData.lowtemp}`;
      } else {
        USEROUTPUTDATA.temperature_label = `Temp: ${weatherData.temp}`;
      }
      USEROUTPUTDATA.description = weatherData.description;
      console.log('exiting querry 3 maybe?');
    
    }

    temp = await fetchPixabayImageURLFromServer(from_placename);
    let imageURL = await temp;
    console.log(`imageURL: ${await imageURL}`, imageURL);
    if (imageURL != null) {
      USEROUTPUTDATA.imageURL = imageURL;
      USEROUTPUTDATA.caption = USEROUTPUTDATA.placename;
    } else {
      USEROUTPUTDATA.caption = 'No Image Available';
    }
    return USEROUTPUTDATA;
  } catch (error) {
    console.log('Sorry error with getting location or weather', error);
    return createErrorUserData();
  }
  // let USEROUTPUTDATA = {};

  // getLatLongLocationPromise(from_placename) // Query 1
  // .then( res => res.json() )
  // .then( json_Location => {
  //   //TODO Remove
  //   console.log('Getting Weather promise');
  //   if (json_Location.exists == false || json_Location.exists == null ) {
  //     USEROUTPUTDATA = createErrorUserData();
  //     throw 'Unknown location';
  //   }
  //   // convert latitude and longitude to get weather
  //   return await getWeatherPromise(json_Location, dateStats.typeOfWeathercast, dateStats.month_day); //Query 2
  // })
  // .then( weather_data => {
  //   // TODO Store weather data and labels
  //   console.log('Received weather data from getWeatherPromise');
  //   if (!(dateStats.typeOfWeathercast == CURRENT ||
  //     dateStats.typeOfWeathercast == FORECAST)) {
  //       USEROUTPUTDATA.forecastlabel_div = 'No forecast for greater than 14 days away';
  //       USEROUTPUTDATA.temperature_div = 'No temperature available';
  //       USEROUTPUTDATA.weather_description_div = 'Travel date is too far to forecast weather';
  //     }
  // })
  // .then( () => {
  //   // Get image
  //   // TODO REMOVE
  //   console.log('Getting Pixabay Image URL ');
  //   return fetchPixabayImageURLFromServer(from_placename); // Query 3
  // })
  // .then( imageURL => {
  //   // store image data
  //   // TODO REMOVE
  //   console.log('populating useroutdata');
  //   if (imageURL != null) {
  //     USEROUTPUTDATA.imageURL = imageURL;
  //   } else {
  //     USEROUTPUTDATA.caption = 'No Image Available';
  //   }
  // })
  // .catch( function(error) {
  //   console.log('Sorry error with getting location or weather',error);
  // });
  // return USEROUTPUTDATA;
}


function createErrorUserData() {
  // TODO Remove
  console.log('createErrorUserData called');
  // save the data and put the update in the update step
  let USEROUTPUTDATA = {};
  USEROUTPUTDATA.mytrip_div = `You've entered a nonexistent place`;
  USEROUTPUTDATA.depart_div = 'Cannot depart to nowhere';
  // TODO do you need this?
  USEROUTPUTDATA.forecastlabel_div = '';
  USEROUTPUTDATA.daysaway_div =
    `You've entered a nonexistent place: ` +
    `${from_placename}`;
  USEROUTPUTDATA.temperature_div = 'Temperature impossible to know!';
  USEROUTPUTDATA.weather_description_div = 'Weather impossitle to know';
  USEROUTPUTDATA.figure_caption = 'No Image Available';
  return USEROUTPUTDATA;
}

// TODO REMOVE DEADCODE
// THIS FUNCTION IS NEVER USED ANYMORE 
async function fillinWeatherAsynchronously(weather_Type,
  from_placename,
  uiupdate_temperature,
  uiupdate_weather_description,
  month_day,
  output_placename_div) {

}

// This corrects the name of the ocation based on what geonames returned
function replacePlacenameInDiv(output_placename_div, json_Location) {
  // JUST USE This
  // `<div>${place_Name} is ${dateJSON.daysAway}
  //                           ${dateJSON.daysLabel} away </div>`
  let original = output_placename_div.innerHTML;
  let indexOfIs = original.indexOf('is');
  let indexOfcarat = original.indexOf('>');
  let old = original.substring(indexOfcarat + 1, indexOfIs);
  let replacement = `${json_Location.toponym}, ${json_Location.admincode} `;
  let newString = original.replace(old, replacement);
  output_placename_div.innerHTML = newString;
}


function updateUI(serverData) {
  console.log('You are trying to update the UI with', serverData);
  // Update the UI Weather elements
  // updateUIElementsBasedOn(weather_Type,
  //                         weather_data,
  //                         uiupdate_temperature,
  //                         uiupdate_weather_description);
  document.getElementById('imgsrc' + suffix.toString()).src = serverData.imageURL;
  document.getElementById('figcaption' + suffix.toString()).innerHTML = serverData.caption;
  document.getElementById('mytrip' + suffix.toString()).innerHTML = `My Trip to: ${serverData.placename}`;
  // TOOD Safe to remove
  //document.getElementById('departing' + suffix.toString()).innerHTML = `Departing: ${serverData.departDate}`;
  document.getElementById('daysaway' + suffix.toString()).innerHTML = `${serverData.placename} is ${serverData.daysAway} ${serverData.daysLabel} away`;
  document.getElementById('forecastlabel' + suffix.toString()).innerHTML = weatherForecastLabel(serverData.typeOfWeathercast);
  if (serverData.typeOfWeathercast == CURRENT || serverData.typeOfWeathercast == FORECAST) {
  
    document.getElementById('temperatures' + suffix.toString()).innerHTML = serverData.temperature_label;
    document.getElementById('weatherdescription' + suffix.toString()).innerHTML = `${serverData.weatherDescription}`;
  
  } else { // CLIMATE
    // TODO REMOVE
    console.log('updating climate portion in updateui');
    //USEROUTPUTDATA.forecastlabel_div = 'No forecast for greater than 14 days away';
    //SEROUTPUTDATA.temperature_div = 'No temperature available';
    //USEROUTPUTDATA.weather_description_div = 'Travel date is too far to forecast weather';
    // TODO I can move this next line to the server
    // The server doesn't currently return any string i used the other serverData.typeOfWeatherCast and manipualted it
    document.getElementById('forecastlabel' + suffix.toString()).innerHTML = 
    'No forecast for greater than 14 days away';
    document.getElementById('temperatures' + suffix.toString()).innerHTML = serverData.temperature_label;
    document.getElementById('weatherdescription' + suffix.toString()).innerHTML = serverData.description;
  }

  // TODO SAFE to remove
  //document.getElementById('temperatures0').innerHTML = 'masterOverride';
  //document.getElementById('weatherdescription0').innerHTML = 'Travel date override';
  
  // TODO update these Elements
  // USEROUTPUTDATA.output_placename_div =
  // `You've entered a nonexistent place: `+
  //                                  `${from_placename}`;
  // USEROUTPUTDATA.uiupdate_temperature = 'impossible to know!';
  // USEROUTPUTDATA.uiupdate_weather_description = '';
  // Populate the image
  // if (dateJSON.typeOfWeathercast == CURRENT ||
  //     dateJSON.typeOfWeathercast == FORECAST) {
  //   // TODO this is the call the get weather and fill it in
  //   fillinWeatherAsynchronously(dateJSON.typeOfWeathercast,
  //                               place_Name,
  //                               temperature_div,
  //                               weather_description_div,
  //                               dateJSON.month_day,
  //                               output_placename_div);
  // } else {
  //   temperature_div.innerHTML = '';
  //   weather_description_div.innerHTML = 'Travel date is too far to forecast weather';
  // }
}


function updateUIElementsBasedOn(typeOfWeathercast,
  data,
  uiupdate_temperature,
  uiupdate_weather_description) {

  if (typeOfWeathercast == CURRENT) {

    uiupdate_temperature.innerHTML = `Temperature: ${data.temp}`;
    uiupdate_weather_description.innerHTML = data.description;

  } else if (typeOfWeathercast == FORECAST) {

    uiupdate_temperature.innerHTML = `High: ${data.hitemp} Low: ${data.lowtemp}`;
    uiupdate_weather_description.innerHTML = data.description;

  } else if (typeOfWeathercast == CLIMATE) {
    uiupdate_weather_description =
    'No forecast for greater than 14 days away'
  }
}


// Processes the date so that we know which type of forecast to display
function createJSONDateStatsFromUserInputDate(todaysDate, inputTravelDate, isDateSupported) {
  // Process date entry logic.
  console.log(`-> Received todaysDate: ${todaysDate} TravelDate: ${inputTravelDate.value}`);
  //let todaysDate = new Date(Date.now());
  //let sixteenDaysFromToday = getFutureDateFrom(new Date(Date.now()), 16);
  let seventeenDaysFromToday = getFutureDateFrom(todaysDate, 17);

  // Reset date to midnight of the day.
  seventeenDaysFromToday.setHours(0);
  seventeenDaysFromToday.setMinutes(0);
  seventeenDaysFromToday.setSeconds(0);
  seventeenDaysFromToday.setMilliseconds(0);
  console.log(`--> 16days from today: ${seventeenDaysFromToday}`);
  //let inputDate = document.getElementById('travelDay');

  // TODO Change the name of this function to isDateInputTypeSupportedInTheBrowser()
  let travelDate;

  if (isDateSupported) {
    // Create date in format YYYY/MM/DD
    travelDate = new Date((inputTravelDate.value).replace(/-/g, '\/'));
    console.log(`--> travelDate now looks like ${travelDate}`);
  } else {
    travelDate = dateFromGenericInputString(inputTravelDate.value);
  }

  let dateDiff = dateDifference(todaysDate, travelDate);

  // Default value for type of weathercase
  let typeOfWeathercast = CURRENT;

  // TODO Break this down into a function

  console.log('--->Our traveldate:',travelDate);
  console.log("--->Sixteen days from today",sixteenDaysFromToday);
  
  if (travelDate.getFullYear() == todaysDate.getFullYear() &&
    travelDate.getMonth() == todaysDate.getMonth() &&
    travelDate.getDate() == todaysDate.getDate()) {
    // If today retrieve current weatherURL
    typeOfWeathercast = CURRENT;

  } else if (travelDate < seventeenDaysFromToday) {
    // If tomorrow till 16 days later use forecast
    console.log(`------>Why is this date being called 
    forecast when travelDate: ${travelDate} is clearly 
    equal to sixteenDaysFromToday ${sixteenDaysFromToday}`);
    typeOfWeathercast = FORECAST;
  } else {
    console.log('---> We have a CLIMATE');
    // We can't forcast that far
    typeOfWeathercast = CLIMATE;
  }

  let daysLabel = (dateDiff == 1) ? 'day' : 'days';

  let month_day = { month: travelDate.getMonth(), day: travelDate.getDate() };

  return {
    departDate: travelDate,
    daysAway: dateDiff, 
    typeOfWeathercast: typeOfWeathercast,
    daysLabel: daysLabel, 
    month_day: month_day
  };
}


// Return the content for the weather Forecast Label
function weatherForecastLabel(typeOfWeathercast) {
  if (typeOfWeathercast == CURRENT) {
    return 'The current weather is:';
  } else if (typeOfWeathercast == FORECAST) {
    return 'The forecast for then is:';
  } else if (typeOfWeathercast == CLIMATE) {
    return '';
  } else {
    throw new Error("Type of Weather forecast type is unrecogized");
  }
}


async function fetchPixabayImageURLFromServer(input) {
  try {
    const jsonText = { data: input };
    let temp = await fetch('http://localhost:9000/pixabay', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonText)
    });
    let jsonSerialized = await temp;
    let unserialized = await jsonSerialized.json();
    let data = await unserialized;
    return ((data.data == 'No hits') ? null : data.data);
  } catch (error) {
    console.log('Sorry error with getting pixabay image', error);
  }
}


// Get the lat long of placename from Geonmaes API
function getLatLongLocationPromise(input) {
  const jsonText = { data: input };
  return fetch('http://localhost:9000/location', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonText)
  });
}


/*
*
* Helper functions
*
*/

function getTodaysDate() {
  let todaysDate = new Date(Date.now())
  return  todaysDate;
}

function getUserInputDate() {
  return document.getElementById('travelDay');
}

function getUserPlacename() {
  return document.getElementById('placename').value;
}


function incrementSuffix() {
  console.log('Increment Suffix called');
  suffix += 1;
}

export { createNewTravelInfoCard,
// TODO REMOVE PRIVATE METHODS
createJSONDateStatsFromUserInputDate  
   };
