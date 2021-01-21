
/*jshint esversion:8*/

const pixabayBaseURL = 'https://pixabay.com/api/';

function fetchPixabayImage(input) {
  console.log(`WeatherBit APIKEY:${process.env.WEATHERBIT_API_KEY}`);
  // Replace commas and blank spaces
  let regExp = /[^a-z]+/gi; // Non characters like blanks commas
  let searchText = input.replace(regExp, '+');

  console.log(`SearchText ${searchText}`);
  let pixabayURL = `${pixabayBaseURL}?key=${process.env.WEATHERBIT_API_KEY}&q=${searchText}&image_type=photo`;
  console.log('Searching pixabay @',pixabayURL);
}

async function getImages(inputText) {
    const jsonText = {data: inputText};
    console.log(`Your trying to get images with ${inputText}`);
    return fetch('http://localhost:8889/weather', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(jsonText)
    })
    .then(res => res.json()) // Receive JSON String, convert to JSON
    .then(json => {return json;})
    .catch(function(error) {
      console.log('Sorry error with getting sentiment',error);
    });

}

function test() {
  console.log('Test from pixabay');
}

module.exports = {
  test,
  fetchPixabayImage
};
//exports.test = test;
