
/*jshint esversion: 8*/

// Allow fetch
const fetch = require("node-fetch");

const CURRENT = 'CURRENT';
const FORECAST = 'FORECAST';
const CLIMATE = 'CLIMATE';

const weatherbitCurrentURL = 'https://api.weatherbit.io/v2.0/current?units=I';
const weatherbitForecastURL ='https://api.weatherbit.io/v2.0/forecast/daily?units=I';
const weatherbitClimateNormalsDailyURL = 'https://api.weatherbit.io/v2.0/normals?units=I&tp=daily'; // get

const regularExpression = new RegExp('/[^A-Za-z]+/');

function retrieveWeatherDataFromWeatherBit(lat,
                                           lon,
                                           weatherType,
                                           daysAway,
                                           travelDate,
                                           month_day,
                                           key) {
  console.log('The apikey is', key);
  return fetch(constructWeatherbitURL(lat, lon, weatherType, month_day, key))
          .then( response => response.json() )
          .then( json => {
            // TODO Find the correct weather
            console.log('Repeating The apikey is', key);
            console.log('We need to pick the correct forecast weather');
            console.log('weather',json);
            // There are only 0-15 forecast dates in the array
            // At 6pm ish everyday the 0th day incremented to the next day.
            // TODO this needs a date check
            // The key for checking the date is datetime: '2021-05-24
            // THis is the passed date '2021-06-08T04:00:00.000Z'
            console.log(`TravelDate received by server: ${travelDate}`);
            console.log('weatherbit\'s format is 2021-05-24');
            let justTravelDate = travelDate.substring(0,10);
            console.log('Extracted Traveldate', justTravelDate);

            // TODO Looks Ugly fix!

            if (weatherType == CURRENT){
              return {temp:json.data[0].temp,
                      description: json.data[0].weather.description,
                      icon: json.data[0].weather.icon};
            } else if (weatherType == FORECAST ) {
              console.log(`travelDate: ${justTravelDate} valid_date: ${json.data[daysAway].valid_date}`);
              if ( justTravelDate == json.data[daysAway].valid_date) {
                console.log('taking current entry');
                return {hitemp:json.data[daysAway].high_temp,
                  lowtemp:json.data[daysAway].low_temp,
                  description: json.data[daysAway].weather.description,
                  icon: json.data[daysAway].weather.icon};
              } else {
                console.log('taking previous entry');
                return {hitemp:json.data[daysAway-1].high_temp,
                  lowtemp:json.data[daysAway-1].low_temp,
                  description: json.data[daysAway-1].weather.description,
                  icon: json.data[daysAway-1].weather.icon};
              }

            } else if (weatherType == CLIMATE){
              return{avgtemp: 'Not available',
                     maxtemp: 'Not available',
                     mintemp: 'Not available'};
            }
              throw new Error(`Unrecogized weathertype ${weatherType}`);
          });
}

function constructWeatherbitURL(lat, lon, weatherType, month_day, key) {
  console.log('constructWeatherbitURL',key);
  console.log('weatherType',weatherType)
  if (weatherType == CURRENT) {
    //console.log(`${weatherbitCurrentURL}&lat=${lat}&lon=${lon}&key=${key}`);
    return `${weatherbitCurrentURL}&lat=${lat}&lon=${lon}&key=${key}`;
  } else if (weatherType == FORECAST) {
    //console.log(`${weatherbitForecastURL}&lat=${lat}&lon=${lon}&key=${key}`);
    return `${weatherbitForecastURL}&lat=${lat}&lon=${lon}&key=${key}`;
  } else if (weatherType == CLIMATE) {
    throw 'Weatherbit climate unsupported';
    //let start_date = `${minTwoDigits((date.getMonth() + 1))}-${minTwoDigits(date.getDate())}`;
    //let start_date = `${minTwoDigits((month_day.month + 1))}-${minTwoDigits(month_day.day)}`;
    //console.log(`${weatherbitClimateNormalsDailyURL}&start_day=${start_date}
    //&end_day=${start_date}&lat=${lat}&lon=${lon}&key=${key}`);
    //return `${weatherbitClimateNormalsDailyURL}&start_day=${start_date}
    //&end_day=${start_date}&lat=${lat}&lon=${lon}&key=${key}`;
  }
}

function dateToSimpleString(date) {
  return `${date.getYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}


module.exports = {
  retrieveWeatherDataFromWeatherBit
};
