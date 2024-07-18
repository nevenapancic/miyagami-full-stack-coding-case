// utils/pexels.js

const API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const BASE_URL = "https://api.pexels.com/v1";

// Function to fetch the public feed
function fetchPublicFeed(tags = "") {
  // Pexels does not directly support fetching by tags in a public feed manner,
  // so we use the search endpoint with a query instead.
  const url = `${BASE_URL}/search?query=${encodeURIComponent(
    tags
  )}&per_page=10`;
  return fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  }).then((response) => response.json());
}

// Function to search images
function searchImages(query, page = 1, perPage = 10) {
  const url = `${BASE_URL}/search?query=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${perPage}`;
  return fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  }).then((response) => response.json());
}

// Export the functions for use in other parts of the application
export { fetchPublicFeed, searchImages };
