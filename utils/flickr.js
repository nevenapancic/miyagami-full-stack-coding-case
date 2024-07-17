// utils/flickr.js

const API_KEY = "0051d1436d54041e4b1518d6b4adedb7"; // Replace with your Flickr API key
const BASE_URL = "https://api.flickr.com/services/rest/";

// Function to fetch the public feed
function fetchPublicFeed(tags = "") {
  const url = `${BASE_URL}?method=flickr.photos.getRecent&api_key=${API_KEY}&tags=${tags}&format=json&nojsoncallback=1`;
  return fetch(url).then((response) => response.json());
}
// fetchPublicFeed().then((data) => console.log(data));
// Function to search images
function searchImages(query, page = 1, perPage = 10) {
  const url = `${BASE_URL}?method=flickr.photos.search&api_key=${API_KEY}&text=${query}&page=${page}&per_page=${perPage}&format=json&nojsoncallback=1`;
  return fetch(url).then((response) => response.json());
}
// searchImages("nature").then((data) => console.log(data));
// Export the functions for use in other parts of the application
export { fetchPublicFeed, searchImages };
