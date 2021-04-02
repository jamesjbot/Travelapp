
/*jshint esversion:8*/
// Allow fetch
const fetch = require("node-fetch");

function retrieveLatLonLocationOf(placename,geonameskey) {
  const latlongURL = `http://api.geonames.org/searchJSON?formatted=true&q=`+
  `${placename}&maxRows=1&lang=es&username=${geonameskey}&style=full`;
  //console.log('latlongURL',latlongURL);
  return fetch(latlongURL).then(response => response.json())
                          .then(jsonData => {
                            return extractLatLong(jsonData);})
                          .catch(function(error) {
                              console.log('Sorry error with location, nonexistent',error);
                              return { exists:false, lat: null, long: null };
                            });
}

function extractLatLong(jsonData) {
  return {exists: true,
          lat: jsonData.geonames[0].lat,
          long: jsonData.geonames[0].lng,
          toponym: jsonData.geonames[0].toponymName,
          admincode: jsonData.geonames[0].countryCode == 'US' ?
                          jsonData.geonames[0].adminCode1 : jsonData.geonames[0].countryCode};
}

module.exports = {
  retrieveLatLonLocationOf,
  extractLatLong
};
