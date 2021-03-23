
/*jshint esversion: 8*/

const weatherbitCurrentURL = 'https://api.weatherbit.io/v2.0/current?units=I';
const weatherbitForecastURL ='https://api.weatherbit.io/v2.0/forecast/daily?units=I';
const weatherbitClimateNormalsDailyURL = 'https://api.weatherbit.io/v2.0/normals?units=I&tp=daily'; // get

const regularExpression = new RegExp('/[^A-Za-z]+/');

function retrieveWeatherDataFromWeatherBit(lat, lon, weatherType) {
  return fetch(constructWeatherbitURL(lat,lon)).then(response => response);
}

function constructWeatherbitURL(lat, lon) {
  return `${weatherbitURL}?lat=${lat}&lon=${lon}&key=${weatherbitApikey}`;
}

function fetchCurrent(input) {
    console.log('Fetching Current Weather');
    const address = `${weatherbitCurrentURL}&key=${weatherbitApikey}`;
    console.log(address);
    //return fetch(address);
}

function fetchWeatherForecast(input) {
    console.log('Fetching Forecast Weather');
    const address = `${weatherbitForecastURL}&key=${weatherbitApikey}`;
    console.log(address);
    //return fetch(address);
}

function fetchClimateNormals(input) {
    console.log('Fetching Climate Normals Weather');
    const address = `${weatherbitClimateNormalsDailyURL}&key=${weatherbitApikey}`;
    console.log(address);
    //return fetch(address);
}


module.exports = {
  retrieveWeatherDataFromWeatherBit
};
