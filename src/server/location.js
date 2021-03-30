
/*jshint esversion:8*/
// Allow fetch
const fetch = require("node-fetch");

function retrieveLatLonLocationOf(placename,geonameskey) {
  console.log('Location looking for location:',placename);
  const latlongURL = `http://api.geonames.org/searchJSON?formatted=true&q=`+
  `${placename}&maxRows=1&lang=es&username=${geonameskey}&style=full`;
  console.log('latlong',latlongURL);
  return fetch(latlongURL).then(response => response.json())
                          .then(jsonData => {
    return extractLatLong(jsonData);
  });
}

function extractLatLong(jsonData) {
  return {lat: jsonData.geonames[0].lat, long: jsonData.geonames[0].lng};
}
module.exports = {
  retrieveLatLonLocationOf,
  extractLatLong
};
