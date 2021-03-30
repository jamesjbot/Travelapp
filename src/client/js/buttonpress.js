/*jshint esversion:8*/

import createUserInputCard from './userinputcardlogic';
import { createNewTravelInfoCard, dateDifference } from './informationcardlogic';
//import getWeather from './getWeather';

// icons for weatherbitApikey
let base_icon_addr = 'https://www.weatherbit.io/static/img/icons/';
//t01n.png


// Get weather from our server
// function getWeather(latlongJSON, weatherType){
//    console.log('buttonpress getLatLongLocation recevied:',input);
//    const jsonText = {data: input};
//     fetch('http://localhost:9000/location', {
//      method: 'POST',
//      credentials: 'same-origin',
//      headers: {'Content-Type': 'application/json'},
//      body: JSON.stringify(jsonText)
//    })
//    .then( res => res.json() )
//    .then( data => {
//      console.log('buttonpress Received JSON', typeof data);
//      console.log(data);
//      //console.log(data.data);
//      //console.log(data.stuff);
//      return data;
//    })
//    .catch(function(error) {
//      console.log('Sorry error with getting location',error);
//    });
// }

function addTravelCard() {
  console.log('Add travel card presed ');
  createNewTravelInfoCard();
}

function addUserInputCard() {
  console.log('Add User Input card Called');
  createUserInputCard();
}

function replaceWithInfoCard() {
  console.log('You want to replace with Information Card');

  // Get placename and latitude and longitude
  const placename = document.getElementById('placename');
  // Make call to get lat long from geonames

  //TODO Call the server for location data

  if (userInputIsValid()) {
    // Pull user data parse for use with creating new TravelInfoCard;
    //let userData = gatherDataFromUserToJSON();
    let placeName = document.getElementById('placename').value;
    console.log('button press userData:',placeName);

    //let latlong = getLatLongLocation(placeName);
    let travelDate = document.getElementById('travelDay').value;
    //let weather = getWeather(latlong,travelDate);


    //console.log('buttonpress getLatLongLocation latlong:', latlong);
    //console.log(`We received location:${userData.latlong.lat},${userData.latlong.long}`);
    //createNewTravelInfoCard(userData);
    createNewTravelInfoCard();
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



export { addUserInputCard, replaceWithInfoCard };
