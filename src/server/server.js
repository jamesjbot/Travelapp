/*jshint esversion: 8*/

const pixabay = require('./pixabay');

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Setup environment variables to hide apikeys
const dotEnv = require('dotenv'); // Used to get apikey from the environment
const result = dotEnv.config();
if (result.error) {
  console.log(result.error);
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

// Getting Pixabay Images without exposing our API_KEY
app.post('/pixabay', function (req, res) {
    console.log('server.js /pixabay route called');
    let input = req.body.data;
    let regExp = /[^a-z]+/gi; // Non characters like blanks commas
    let searchText = input.replace(regExp, '+');

    // TODO debuggin code remove
    //searchText = 'buffalo+new+york';
    console.log('Overriding pixabay information');
    //setTimeoout(debugdelay,2000,res);
    res.send({data:'https://www.niagarafallslive.com/wp-content/uploads/2017/08/opt-falls-background-1264x790-176k.jpg'});
    // pixabay.fetchPixabayImage(searchText)
    //   .then(data => data.json())
    //   .then(json => {
    //     // Pick the first Preview Image URL or Return with nothings
    //     if (json.total != 0) {
    //         console.log(`pixabay respondeded with ${json.hits[0].previewURL}`);
    //         res.send({'data':json.hits[0].previewURL});
    //       } else {
    //         console.log('The response had zero hits');
    //         res.send({data:'No hits'});
    //       }
    //   });
});

// Get weather from weatherbit
app.post('/weather', function (req, res) {
    console.log('User request weather data');
    res.send({high:99, low:66});
});

// Return home webpage
app.get('/cute', function (req, res) {
    console.log('server.js /cute route called');
    console.log("Sending index.html");
    console.log(`APIKEY:${process.env.WEATHERBIT_API_KEY}`);
    getImages('Of Chinchillas');
    //res.sendFile('dist/index.html'); TODO REMOVE
    //res.sendFile(path.resolve('src/client/views/index.html'));
    res.send("Chinchillas are cute");
});

// Create Get Route for the last recorded entry
app.get('/lastStoredData',getProjectData);

function getProjectData(req, res) {
  console.log('server.js /lastStoredData route called');
  console.log('a request for last recorded Date, Temperature, Feeling');
  res.send(projectData);
}

// Create Post Route to Store Date Temperature and Feeling
app.post('/addData', receiveProjectData);

function receiveProjectData(req,res) {
  res.status(200).send('Enjoy the weather!');
  projectData.date = req.body.date;
  projectData.temp = req.body.temp;
  projectData.content = req.body.content;
  console.log(`Received ${req.body}`);
  console.log('The current state of projectData is now:');
  console.log(projectData);
}
