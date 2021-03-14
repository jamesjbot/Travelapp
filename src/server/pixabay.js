
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
}

module.exports = {
  fetchPixabayImage
};
