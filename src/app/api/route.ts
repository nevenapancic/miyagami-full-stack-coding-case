import { NextRequest, NextResponse } from "next/server";

type FeedResponse = Promise<any>;

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
  perPage: number = 30,
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

/**
 * API route handler for fetching images.
 * @param req - The Next.js API request object.
 * @returns The Next.js API response object.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");
  const orderBy = searchParams.get("orderBy");

  try {
    const images = await fetchPublicFeed(
      tag || "",
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 30,
      orderBy || "latest"
    );
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: "Error, could not fetch images" },
      { status: 500 }
    );
  }
}
