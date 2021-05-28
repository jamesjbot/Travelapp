
/*jshint esversion: 8*/

// Allow fetch
const fetch = require("node-fetch");

const CURRENT = 'CURRENT';
const FORECAST = 'FORECAST';
const CLIMATE = 'CLIMATE';

const weatherbitCurrentURL = 'https://api.weatherbit.io/v2.0/current?units=I';
const weatherbitForecastURL = 'https://api.weatherbit.io/v2.0/forecast/daily?units=I';
const weatherbitClimateNormalsDailyURL = 'https://api.weatherbit.io/v2.0/normals?units=I&tp=daily'; // get

const regularExpression = new RegExp('/[^A-Za-z]+/');


function retrieveWeatherDataFromWeatherBit(
  lat,
  lon,
  weatherType,
  daysAway,
  travelDate,
  month_day,
  key) {
  console.log(`\n!!!!daysAway: ${daysAway.value} and forecast: ${weatherType}`);
  return fetch(constructWeatherbitURL(lat, lon, weatherType, month_day, key))
    .then(response => response.json())
    .then(json => {

 

      if (weatherType == CURRENT) {
      
        return {
          temp: json.data[0].temp,
          description: json.data[0].weather.description,
          icon: json.data[0].weather.icon
        };
      
      } else if (weatherType == FORECAST) {
        
        // There are only 0-15 forecast dates in the array
        let exactTravelDate = travelDate.substring(0, 10);
        if (daysAway == 17 ) throw new ('Date is too far in the future to test array only has 16 elements daysAway:',daysAway);
        if (exactTravelDate == json.data[daysAway].valid_date) { // There server is on UTC Time 
          return { // Use current entry
            hitemp: json.data[daysAway].high_temp,
            lowtemp: json.data[daysAway].low_temp,
            description: json.data[daysAway].weather.description,
            icon: json.data[daysAway].weather.icon
          };
        }
        return { // Use previous entry
          hitemp: json.data[daysAway - 1].high_temp,
          lowtemp: json.data[daysAway - 1].low_temp,
          description: json.data[daysAway - 1].weather.description,
          icon: json.data[daysAway - 1].weather.icon
        };

      } else if (weatherType == CLIMATE) {
        return {
          avgtemp: 'Not available',
          maxtemp: 'Not available',
          mintemp: 'Not available'
        };
      }
      throw new Error(`Unrecogized weathertype ${weatherType}`);
    });
}


function constructWeatherbitURL(lat, lon, weatherType, month_day, key) {
  console.log('constructWeatherbitURL', key);
  console.log('weatherType', weatherType)
  if (weatherType == CURRENT) {
    return `${weatherbitCurrentURL}&lat=${lat}&lon=${lon}&key=${key}`;
  } else if (weatherType == FORECAST) {
    return `${weatherbitForecastURL}&lat=${lat}&lon=${lon}&key=${key}`;
  } else if (weatherType == CLIMATE) {
    throw 'Weatherbit climate unsupported';
  }
}


function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}


module.exports = {
  retrieveWeatherDataFromWeatherBit
};
