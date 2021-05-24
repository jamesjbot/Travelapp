
/*jshint esversion:8*/

function getWeatherPromise(lat_long_JSON, weather_Type, daysAway, travelDate, month_day) {
  const jsonText = {latLong: lat_long_JSON,
                      weatherType: weather_Type,
                      daysAway: daysAway,
                      travelDate: travelDate,
                      month_day: month_day};
    return fetch('http://localhost:9000/weather', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonText)
    })
    .then(res => res.json()) // Receive JSON String, convert to JSON
    .then(json => {return json;})
    .catch(function(error) {
      console.log('Sorry error with getting weather',error);
    });
}

export { getWeatherPromise };
