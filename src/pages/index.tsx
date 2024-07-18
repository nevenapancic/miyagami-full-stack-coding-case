import React, { useState, useEffect } from "react";
import { fetchPublicFeed, searchImages } from "../../utils/pexels";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PexelsImage {
  id: number;
  src: {
    medium: string;
    large: string;
  };
  photographer: string;
}

const HomePage = () => {
  const [images, setImages] = useState<PexelsImage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPublicFeed();
  }, []);

  const loadPublicFeed = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchPublicFeed("dog");
      setImages(data.photos);
    } catch (err) {
      setError("Failed to load images.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("You have to write a tag for which I should search for images.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await searchImages(searchTerm);
      setImages(data.photos);
    } catch (err) {
      setError("Failed to search for images.");
    } finally {
      setIsLoading(false);
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
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search images..."
              className="rounded-lg shadow-lg grow py-2 pl-4"
            />
            <Button type="submit">Search</Button>
          </form>
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div key={img.id} className="card">
                <Image
                  src={img.src.large}
                  alt={img.photographer}
                  width={400}
                  height={400}
                />
                <p>{img.photographer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
