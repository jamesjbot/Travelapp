/*jshint esversion: 8*/


// Setup empty JS object to act as endpoint for all routes
projectData = {};


// Require Express to run server and routes
const express = require('express');


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
const port = 8888;
const server = app.listen(port,() => {console.log(`running on port ${port}`);});

// Create Get Route for the last recorded entry
app.get('/lastStoredData',getProjectData);

function getProjectData(req, res) {
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
