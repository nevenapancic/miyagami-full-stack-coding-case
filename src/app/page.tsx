"use client";
import { useState, useEffect } from "react";
import { fetchPublicFeed } from "@/app/api/route";
import { searchImages } from "@/app/api/[tags]/route";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface PexelsImage {
  id: number;
  src: {
    medium: string;
    large: string;
  };
  photographer: string;
  photographer_url: string;
  title?: string;
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [images, setImages] = useState<PexelsImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchMode, setSearchMode] = useState(false);
  const randomTags = [
    "dog",
    "Amsterdam",
    "space",
    "nature",
    "mountains",
    "elephant",
  ];

  const getRandomTag = () =>
    randomTags[Math.floor(Math.random() * randomTags.length)];

  useEffect(() => {
    if (!searchMode) {
      loadPublicFeed(page);
    } else {
      handleSearch();
    }
  }, [page]);

  const loadPublicFeed = async (newPage: number) => {
    setLoading(true);
    const randomTag = getRandomTag();
    try {
      const data = await fetchPublicFeed(randomTag, newPage);
      if (newPage === 1) {
        setImages(data.photos);
      } else {
        setImages((prevImages) => [...prevImages, ...data.photos]);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setError("You have to write a tag for which I should search for images.");
      return;
    }
    setLoading(true);
    setError("");
    setSearchMode(true);
    if (e) setPage(1);
    try {
      const data = await searchImages(searchTerm, e ? 1 : page);
      if (page === 1) {
        setImages(data.photos);
      } else {
        setImages((prevImages) => [...prevImages, ...data.photos]);
      }
    } catch (err) {
      setError("Failed to search for images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full">
      <div className="container px-24">
        <header className="flex items-center justify-between pt-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mr-4">
              The Miyagami Pexels Image Finder
            </h1>
          </div>
        </header>
        <div className="container mx-auto p-4">
          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-2xl mt-4 items-center space-x-2"
          >
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search images..."
              className="rounded-lg shadow-lg grow py-2 pl-4"
            />
            <Button type="submit">Search</Button>
          </form>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <Image
                  src={img.src.large}
                  alt={img.photographer}
                  width={400}
                  height={400}
                  className="rounded-t-lg"
                />
                {img.title && (
                  <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {img.title}
                  </p>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href={img.photographer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                          {img.photographer}
                        </p>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <a
                        href={img.photographer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p>Visit profile</p>
                      </a>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
            <button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
