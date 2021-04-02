/*jshint esversion: 8*/
const location = require('./location');
const weatherbit = require('./weatherbit');
const pixabay = require('./pixabay');

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Setup environment variables to hide apikeys
const dotEnv = require('dotenv'); // Used to get apikey from the environment
const result = dotEnv.config();
if (result.error) {
  console.log('Error reading .env file:',result.error);
} else {
  console.log('No error reading .env file');
}

// Require Express to run server and routes
const express = require('express');

// Allow access to see current directory.
const path = require('path');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 9000;
const server = app.listen(port,() => {console.log(`running on port ${port}`);});

// Routes
app.post('/location', function(req, res) {
    console.log('server.js /location request');
    let placename = req.body.data;
    let key = process.env.GEONAMES_API_KEY;
    location.retrieveLatLonLocationOf(placename,key).then(jsonLatLong => {
      res.send(jsonLatLong);
    });
});

// Getting Pixabay Images without exposing our API_KEY
app.post('/pixabay', function (req, res) {
    console.log('server.js /pixabay request');
    let input = req.body.data;
    let regExp = /[^a-z]+/gi; // Non characters like blanks commas
    let searchText = input.replace(regExp, '+');

    pixabay.fetchPixabayImage(searchText)
      .then(data => data.json())
      .then(json => {
        // Pick the first Preview Image URL or Return with nothings
        if (json.total != 0) {
            //console.log(`pixabay respondeded with ${json.hits[0].previewURL}`);
            res.send({'data':json.hits[0].previewURL});
          } else {
            console.log('The response had zero hits');
            res.send({data:'No hits'});
          }
      });
});

// Get weather from weatherbit
app.post('/weather', function (req, res) {
    console.log('server.js /weather request');
    let key = process.env.WEATHERBIT_API_KEY;
    weatherbit.retrieveWeatherDataFromWeatherBit(req.body.latLong.lat,
                                                 req.body.latLong.long,
                                                 req.body.weatherType,
                                                 req.body.month_day,
                                                 key)
    .then( data => {
      res.send(data);
    })
    .catch( function(error) {
      console.log('Error calling weather',error);
      res.send({high:99, low:66, description: 'Error Calling Weatherbit'});
    });
});
