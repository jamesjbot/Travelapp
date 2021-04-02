
/*jshint esversion:8*/

const pixabayBaseURL = 'https://pixabay.com/api/';

// Allow fetch
const fetch = require("node-fetch");


function fetchPixabayImage(input) {
  // Replace commas and blank spaces
  let regExp = /[^a-z]+/gi; // Non characters like blanks commas
  let searchText = input.replace(regExp, '+');
  let pixabayURL = `${pixabayBaseURL}?key=${process.env.PIXABAY_API_KEY}&q=${searchText}&image_type=photo`;
  return fetch(pixabayURL);
}

module.exports = {
  fetchPixabayImage
};
