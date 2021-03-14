
/*jshint esversion:8*/

const pixabayBaseURL = 'https://pixabay.com/api/';

// Allow fetch
const fetch = require("node-fetch");


function fetchPixabayImage(input) {
  console.log('pixabay.js fetchPixabayImage called');
  // Replace commas and blank spaces
  let regExp = /[^a-z]+/gi; // Non characters like blanks commas
  let searchText = input.replace(regExp, '+');
  console.log(`Pixabay server SearchText ${searchText}`);
  let pixabayURL = `${pixabayBaseURL}?key=${process.env.PIXABAY_API_KEY}&q=${searchText}&image_type=photo`;
  console.log('Searching pixabay @',pixabayURL);
  return fetch(pixabayURL);
  //   .then(data => data.json())
  //   .then(response => {
  //   console.log("parsed hello received response from pixabay");
  //   console.log(response);
  //   if (response.total != 0) {
  //     console.log(response.hits[0].previewURL);
  //   } else {
  //     console.log('The response had zero hits');
  //   }
    //return response;
  //});
}

// async function getImages(inputText, response) {
//     console.log('pixabay.js getImages called');
//     const jsonText = {data: inputText};
//     console.log(`Your trying to get images with ${inputText}`);
//     return fetch('http://localhost:8889/weather', {
//       method: 'POST',
//       credentials: 'same-origin',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(jsonText)
//     })
//     .then(res => res.json()) // Receive JSON String, convert to JSON
//     .then(json => {response.send(json);})
//     .catch(function(error) {
//       console.log('Sorry error with getting sentiment',error);
//     });
// }

// function test() {
//   console.log('Test from pixabay');
// }

module.exports = {
  test,
  fetchPixabayImage
};
//exports.test = test;
