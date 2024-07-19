import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const BASE_URL = "https://api.pexels.com/v1";
/**
 * Searches images on Pexels API with added orderBy parameter for sorting.
 * Note: The response includes fields such as 'photographer_url' and 'title'.
 * @param query - The search query.
 * @param page - The page number for pagination.
 * @param perPage - The number of items per page.
 * @param orderBy - The order by parameter (optional, defaults to 'latest').
 * @returns The promise that resolves to the JSON response.
 */
async function searchImages(
  query: string,
  page: number = 1,
  perPage: number = 30,
  orderBy: string = "latest"
) {
  if (!API_KEY) {
    throw new Error("Pexels API key is not defined in environment variables.");
  }

  const url = `${BASE_URL}/search?query=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${perPage}&order_by=${orderBy}`;

  const response = await fetch(url, {
    headers: {
      Authorization: API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed with status: ${response.status}`);
  }

  return response.json();
}

/**
 * API route handler for searching images.
 * @param req - The Next.js API request object.
 * @returns The Next.js API response object.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { query: string } }
) {
  const { searchParams } = new URL(req.url);
  const query = params.query;
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");
  const orderBy = searchParams.get("orderBy");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const images = await searchImages(
      query,
      page ? parseInt(page, 10) : 1,
      perPage ? parseInt(perPage, 10) : 30,
      orderBy || "latest"
    );
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: "Error, could not search images" },
      { status: 500 }
    );
  }
}
