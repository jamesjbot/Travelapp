
/*jshint esversion: 8*/

/* Global Variables */

const apikey = 'd742a68877e0f57a3de490481784ea94&units=imperial';


// Create a new date instance dynamically with JS
function generateDate(time) {
  const d = new Date(time * 1000);
  const newDate = (d.getMonth()+1).toString().padStart(2,'0')+'/'+d.getDate()+'/'+d.getFullYear()+' '+d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0')+':'+d.getSeconds().toString().padStart(2,'0');
  return newDate;
}


// Attach EventListener to button
const button = document.getElementById('generate');
button.addEventListener("click", generate);


// Asynchronously get last posted data from server endpoint
const getRequestPromise = async () => {
  const response = await fetch('/lastStoredData');
  try {
    const lastData = await response.json();
    return lastData;
  } catch (error) {
    console.log("error",error);
  }
};


// Wrapper function to get last posted data on our server endpoint
function getDataFromServer() {
  const lastData = getRequestPromise();
  return lastData;
}


// Respond to user click on generate button
function generate() {
  const aPromise = retrieveWeatherDataFromApi();
  aPromise.then(data => jsonifyData(data))
          .then(jsonData => extractTempAndDateFrom(jsonData))
          .then(tempAndDate => combineCommentWith(tempAndDate))
          .then(triple => postDataToServer(triple))
          .then(() => getDataFromServer())
          .then(serverData => updateUI(serverData))
          .catch(error => console.log('Error processing data:'+error));
}


// Converts response from OpenWeather API to JSON
function jsonifyData(response) {
  return response.json();
}


// Pull out temperature and date from the OpenWeather API response
function extractTempAndDateFrom(data) {
  return {temp: data.main.temp, date: generateDate(data.dt)};
}


// Combines Data from OpenWeather Api and from our form to a JSON object
function combineCommentWith(tempAndDate) {
  const comment = document.getElementById('feelings');
  const weatherTriple = {date: tempAndDate.date, temp: tempAndDate.temp,
                         content: comment.value};
  return weatherTriple;
}


// Get weather data from OpenWeather api
function retrieveWeatherDataFromApi() {
  const zipcode = document.getElementById('zip');
  const weatherURL = `http://api.openweathermap.org/data/2.5/weather?`+
                     `zip=${zipcode.value},us&appid=${apikey}`;
  // Async send get request to openweatherdata
  return fetch(weatherURL).then(response => response);
}


// Update the ui on successful return
function updateUI(data) {
  const uiDate = document.getElementById('date');
  const uiTemp = document.getElementById('temp');
  const uiContent = document.getElementById('content');
  uiDate.innerHTML = data.date;
  uiTemp.innerHTML = data.temp+'&#8457';
  uiContent.innerHTML = data.content;
}


// Post data to our server endpoint
function postDataToServer(weatherTriple) {
  postData('/addData', weatherTriple);
}

const postData = async (url = '', data = {}) => {
    let postResponse = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    try {
      if (!postResponse.ok) {
        console.error('Post Response was NOT ok!');
      }
      return;
    } catch (error) {
      console.error('Error converting the response',error);
    }
};
