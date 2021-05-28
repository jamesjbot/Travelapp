
/*jshint esversion:8*/
import { isDateSupported } from './userinputcardlogic';
import { dateFromGenericInputString } from './buttonpress';
import { dateDifference, getFutureDateFrom } from './datelogic';
import { getWeatherPromise } from './getWeather';

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

  generateTravelInfoCardTemplate();
  
  // Fill in actual information
  let placename = getUserPlacename();
  let dateStats = createJSONDateStatsFromUserInputDate(getTodaysDate(), getUserInputDate(), isDateSupported());
  try {
    let rawTripData = await queryAll3APIBuildJSONOfUserData(placename, dateStats);
    
    // Pass User Data to server 
    await sendTripDataToServer(createUserDataForDisplay(rawTripData));

    // Get User Data from server
    await getTripDataFromServerThen(updateUI);
    
    // TODO would another name be better for this
    await incrementSuffix();
  
  } catch (error) {
    
    console.log(`Error creating new travel information card: ${error}`);
    
    updateUI(createErrorUserData(placename));

    await incrementSuffix();

  }

}


async function generateTravelInfoCardTemplate() {
  console.log('gen TravelInfo Template called');
  
  // Save weather based decision values locally
  let dateJSON = createJSONDateStatsFromUserInputDate( getTodaysDate(), getUserInputDate(),isDateSupported());

  // Create travelCard html container
  let travelCard = document.createElement('div');
  travelCard.classList.add("travel_card");

  // Create Image of Destination html block
  let imageStack = createImageStack();

  // Create information stack html block
  let informationStack = createInformationStackFrom(dateJSON);

  travelCard.appendChild(imageStack);
  travelCard.appendChild(informationStack);

  // Get the Add Travel leg button and decorate it
  let addLegButton = document.getElementById('addTravelLegButton');
  addLegButton.style.display = 'block';

  // Insert travel card into DOM before the Add Travel Leg button
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


function createInformationStackFrom(dateStats) {

  let stack = document.createElement('div');
  stack.classList.add("information_stack");

  // My trip div
  let mytrip_div = document.createElement('div');
  mytrip_div.id = 'mytrip' + suffix.toString();
  mytrip_div.innerHTML = `My Trip to: ${getUserPlacename()}`;

  // depart_div
  let depart_div = document.createElement('div');
  depart_div.id = 'depart' + suffix.toString();
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

  console.log(`Query all 3 received these dateStats:$`, dateStats);
  
  try {
    let USEROUTPUTDATA = {};
    USEROUTPUTDATA.departDate = dateStats.departDate;
    USEROUTPUTDATA.daysAway = dateStats.daysAway;
    USEROUTPUTDATA.daysLabel = dateStats.daysLabel;
    USEROUTPUTDATA.typeOfWeathercast = dateStats.typeOfWeathercast;

    let serializedJSON = await getLatLongLocationPromise(from_placename);
    let temp = await serializedJSON.json();
    let json_Location = await temp;
    
    //console.log(`json_Location: ${await json_Location}`, json_Location);
    
    if (json_Location.exists == false || json_Location.exists == null) throw 'Unknown Location';

    USEROUTPUTDATA.placename = await `${json_Location.toponym}, ${json_Location.admincode}`;

    // TODO REMOVE
    //console.log(`the weathertype is ${dateStats.typeOfWeathercast}`);
  
    // TODO THIS WHOLE SECTION IS POPULATING DATA TO SEND TO THE SERVER
    if (dateStats.typeOfWeathercast == CLIMATE) { // If it's a climate prediction never call weather data

      USEROUTPUTDATA.temperature_label = 'No temperature available';
      USEROUTPUTDATA.weatherDescription = 'Travel date is too far to forecast weather';
    
    } else {
    
      temp = await getWeatherPromise(json_Location, 
                                     dateStats.typeOfWeathercast, 
                                     dateStats.daysAway , 
                                     dateStats.departDate,
                                     dateStats.month_day);
      let weatherData = await temp;
      console.log(`weather data from server ${await weatherData}`, weatherData);
      
      // TODO Which of these weather descriptions is being used
      USEROUTPUTDATA.weatherDescription = await weatherData.description;
      
      if (weatherData.hasOwnProperty('hitemp')) {
        USEROUTPUTDATA.temperature_label = `High: ${weatherData.hitemp} Low: ${weatherData.lowtemp}`;
      } else {
        USEROUTPUTDATA.temperature_label = `Temp: ${weatherData.temp}`;
      }
      // TODO REMOVE The following deadcode
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

    throw new Error(error.message,createErrorUserData);

    }
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

// TODO REMOVE DEADCODE
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


function createErrorUserData(from_placename) {
  // TODO Remove
  console.log('createErrorUserData called');
  // save the data and put the update in the update step
  /* Elements needded
  * imageURL
  * caption
  * placename
  * daysAway
  * daysLabel
  * typeOfWeathercast
  * temperature_label
  * weatherDescription
  */
  let USEROUTPUTDATA = {};
  USEROUTPUTDATA.caption = 'No Image Available';
  USEROUTPUTDATA.mytrip_div = `You've entered a nonexistent place`;
  USEROUTPUTDATA.depart_div = 'Cannot depart to nonexistent place';
  // TODO do you need this?
  USEROUTPUTDATA.forecastlabel_div = '';
  USEROUTPUTDATA.daysaway_div =
    `You've entered a nonexistent place: ` +
    `${from_placename}`;
  USEROUTPUTDATA.temperature_div = 'Temperature impossible to know';
  USEROUTPUTDATA.weather_description_div = 'Weather impossible to know';
  return USEROUTPUTDATA;
}

function createUserDataForDisplay(serverData) {
    // save the data and put the update in the update step
  /* Elements needded
  * imageURL
  * caption
  * placename
  * daysAway
  * daysLabel
  * typeOfWeathercast
  * temperature_label
  * weatherDescription
  */
  let USEROUTPUTDATA = {};

  USEROUTPUTDATA.imageURL = serverData.imageURL;
  USEROUTPUTDATA.caption = `${serverData.placename}`;

  USEROUTPUTDATA.mytrip_div = `My Trip to: ${serverData.placename}`;

  // TODO The Page already has this no need to redo
  ///USEROUTPUTDATA.depart_div = `Departing: ${serverData.departDate}`;
  
  USEROUTPUTDATA.daysaway_div = `${serverData.placename} is ${serverData.daysAway} ${serverData.daysLabel} away`
  
  USEROUTPUTDATA.forecastlabel_div = weatherForecastLabel(serverData.typeOfWeathercast);
  USEROUTPUTDATA.temperature_div = serverData.temperature_label;
  USEROUTPUTDATA.weather_description_div = serverData.weatherDescription;
  
  return USEROUTPUTDATA;
}

function updateUI(serverData) {
  /*
  * Elements needded
  * imageURL
  * caption
  * placename
  * daysAway
  * daysLabel
  * typeOfWeathercast
  * temperature_label
  * weatherDescription
  */
  console.log('You are trying to update the UI with', serverData);

  if (serverData.hasOwnProperty('imageURL')) document.getElementById('imgsrc' + suffix.toString()).src = serverData.imageURL;
  
  document.getElementById('figcaption' + suffix.toString()).innerHTML = serverData.caption;

  document.getElementById('mytrip' + suffix.toString()).innerHTML = serverData.mytrip_div;

  if (serverData.hasOwnProperty('depart_div')) document.getElementById('depart' + suffix.toString()).innerHTML = serverData.depart_div;

  document.getElementById('daysaway' + suffix.toString()).innerHTML = serverData.daysaway_div;
  document.getElementById('forecastlabel' + suffix.toString()).innerHTML = serverData.forecastlabel_div;
  document.getElementById('temperatures' + suffix.toString()).innerHTML = serverData.temperature_div;
  document.getElementById('weatherdescription' + suffix.toString()).innerHTML = serverData.weather_description_div;

}



// Processes the date so that we know which type of forecast to call for display
function createJSONDateStatsFromUserInputDate(todaysDate, inputTravelDate, isDateSupported) {
  // Process date entry logic.
  console.log(`-> Received todaysDate: ${todaysDate} TravelDate: ${inputTravelDate.value}`);

  let sixteenDaysFromToday = getFutureDateFrom(todaysDate, 16);

  // Reset date to midnight of the day.
  sixteenDaysFromToday.setHours(0);
  sixteenDaysFromToday.setMinutes(0);
  sixteenDaysFromToday.setSeconds(0);
  sixteenDaysFromToday.setMilliseconds(0);

  let travelDate;

  // TODO Break this into a function?
  if (isDateSupported) {
    // Create date in format YYYY/MM/DD
    travelDate = new Date((inputTravelDate.value).replace(/-/g, '\/'));
  } else {
    travelDate = dateFromGenericInputString(inputTravelDate.value);
  }

  let dateDiff = dateDifference(todaysDate, travelDate);

  // Default value for type of weathercase
  let typeOfWeathercast = CURRENT;

  // TODO Break this down into a function
  if (travelDate.getFullYear() == todaysDate.getFullYear() &&
    travelDate.getMonth() == todaysDate.getMonth() &&
    travelDate.getDate() == todaysDate.getDate()) {
    // If today retrieve current weatherURL
    console.log('Current is the type of weather');
    typeOfWeathercast = CURRENT;

  } else if (travelDate < sixteenDaysFromToday) {
    // If tomorrow till 16 days later use forecast
    console.log(`------>Why is this date being called 
    forecast when travelDate: ${travelDate} is clearly 
    equal to sixteenDaysFromToday ${sixteenDaysFromToday} \nForecast is the type of Weather`);
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
    return 'No forecast for greater than 15 days away';
  } else {
    return 'No forecast available';
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

export {createNewTravelInfoCard,
        createJSONDateStatsFromUserInputDate  // exposed for testing
   };
