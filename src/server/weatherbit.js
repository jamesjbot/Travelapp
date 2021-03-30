
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
                                           month_day,
                                           key) {
  return fetch(constructWeatherbitURL(lat,lon, weatherType, month_day, key))
          .then( response => response.json() )
          .then(json => {
            console.log('-->Response from weatherbit:', json);
            if (weatherType == CURRENT){
              return {temp:json.data[0].temp,
                      description: json.data[0].weather.description,
                      icon: json.data[0].weather.icon};
            } else if (weatherType == FORECAST ) {
              return {hitemp:json.data[0].high_temp,
                      lowtemp:json.data[0].low_temp,
                      description: json.data[0].weather.description,
                      icon: json.data[0].weather.icon};
            } else if (weatherType == CLIMATE){
              return{avgtemp:json.data[0].temp,
                     maxtemp:json.data[0].max_temp,
                     mintemp:json.data[0].min_temp};
            }
              throw new Error(`Unrecogized weathertype ${weatherType}`);
          });
}

function constructWeatherbitURL(lat, lon, weatherType, month_day, key) {
  if (weatherType == CURRENT) {
    console.log(`${weatherbitCurrentURL}&lat=${lat}&lon=${lon}&key=${key}`);
    return `${weatherbitCurrentURL}&lat=${lat}&lon=${lon}&key=${key}`;
  } else if (weatherType == FORECAST) {
    console.log(`${weatherbitForecastURL}&lat=${lat}&lon=${lon}&key=${key}`);
    return `${weatherbitForecastURL}&lat=${lat}&lon=${lon}&key=${key}`;
  } else if (weatherType == CLIMATE) {
    //let start_date = `${minTwoDigits((date.getMonth() + 1))}-${minTwoDigits(date.getDate())}`;
    let start_date = `${minTwoDigits((month_day.month + 1))}-${minTwoDigits(month_day.day)}`;
    console.log('climate date',start_date);
    console.log(`${weatherbitClimateNormalsDailyURL}&start_day=${start_date}
    &end_day=${start_date}&lat=${lat}&lon=${lon}&key=${key}`);
    return `${weatherbitClimateNormalsDailyURL}&start_day=${start_date}
    &end_day=${start_date}&lat=${lat}&lon=${lon}&key=${key}`;
  }
}

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

function fetchCurrent(input) {
    console.log('Fetching Current Weather');
    const address = `${weatherbitCurrentURL}`;
    //&key=${weatherbitApikey}`;
    console.log(address);
    //return fetch(address);
}

function fetchWeatherForecast(input) {
    console.log('Fetching Forecast Weather');
    const address = `${weatherbitForecastURL}`;
    //`&key=${weatherbitApikey}`;
    console.log(address);
    //return fetch(address);
}

function fetchClimateNormals(input) {
    console.log('Fetching Climate Normals Weather');
    const address = `${weatherbitClimateNormalsDailyURL}`;
    //`&key=${weatherbitApikey}`;
    console.log(address);
    //return fetch(address);
}


module.exports = {
  retrieveWeatherDataFromWeatherBit
};
