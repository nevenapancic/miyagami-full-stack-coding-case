type FeedResponse = Promise<any>; // Replace 'any' with a more specific type based on the API response structure

/**
 * Fetches the public feed from Pexels API with pagination and optional ordering.
 * Note: The response includes fields such as 'photographer_url' and 'title'.
 * @param tag - The tag to search for.
 * @param page - The page number for pagination.
 * @param perPage - The number of items per page.
 * @param orderBy - The order by parameter (optional, defaults to 'latest').
 * @returns The promise that resolves to the JSON response.
 */
function fetchPublicFeed(
  tag: string = "",
  page: number = 1,
  perPage: number = 10,
  orderBy: string = "latest"
): FeedResponse {
  if (!process.env.NEXT_PUBLIC_PEXELS_API_KEY) {
    throw new Error("Pexels API key is not defined in environment variables.");
  }

  const API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  const BASE_URL = "https://api.pexels.com/v1";
  const url = `${BASE_URL}/search?query=${encodeURIComponent(
    tag
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
      console.error("Failed to fetch public feed:", error);
      throw error; // Re-throw the error after logging it
    });
}

export { fetchPublicFeed };
