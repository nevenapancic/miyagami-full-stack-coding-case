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
import ImageCard from "@/components/ImageCard";

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
  const [isLoading, setIsLoading] = useState(true);
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
      <div className="container px-10 sm:px-24">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold tracking-tighter mt-20">
            The Miyagami Pexels Image Finder
          </h1>
        </div>
        <div className="container mx-auto p-4">
          <div className="flex justify-center">
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
          </div>
          <div className="flex justify-center mt-4 pt-4">
            {loading && <p>Loading...</p>}
          </div>
          <div className="flex justify-center mt-4 pt-4">
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <div className="masonry mt-10 mb-20">
            {images.map((img) => (
              <ImageCard
                key={img.id}
                id={img.id}
                src={img.src}
                photographer={img.photographer}
                photographer_url={img.photographer_url}
                title={img.title}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
