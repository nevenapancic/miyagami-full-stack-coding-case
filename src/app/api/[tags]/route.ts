const API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const BASE_URL = "https://api.pexels.com/v1";

type ImageSearchResponse = Promise<any>; // Replace 'any' with a more specific type based on the API response structure

/**
 * Searches images on Pexels API with added orderBy parameter for sorting.
 * Note: The response includes fields such as 'photographer_url' and 'title'.
 * @param query - The search query.
 * @param page - The page number for pagination.
 * @param perPage - The number of items per page.
 * @param orderBy - The order by parameter (optional, defaults to 'latest').
 * @returns The promise that resolves to the JSON response.
 */
function searchImages(
  query: string,
  page: number = 1,
  perPage: number = 30,
  orderBy: string = "latest"
): ImageSearchResponse {
  if (!API_KEY) {
    throw new Error("Pexels API key is not defined in environment variables.");
  }

  const url = `${BASE_URL}/search?query=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${perPage}&order_by=${orderBy}`;

  return fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Failed to fetch images:", error);
      throw error;
    });
}

export { searchImages };
