import React, { useState, useEffect } from "react";
import { fetchPublicFeed, searchImages } from "../../utils/flickr";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Image {
  id?: string;
  title: string;
  link: string;
  media: { m: string };
  author: string;
  author_id?: string;
  date_taken?: string;
  description?: string;
  published?: string;
  tags?: string;
}

const HomePage = () => {
  const [images, setImages] = useState<Image[]>([]);
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
      const data = await fetchPublicFeed();
      setImages(data.photos.photo);
    } catch (err) {
      setError("Failed to load images.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Please enter a search term.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const data = await searchImages(searchTerm);
      setImages(data.photos.photo);
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
              The Miyagami Flickr Image Finder
            </h1>
            {/* <Image src='/flickr.png' alt='Flickr logo' width='50' height='50' /> */}
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
                  src={`https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_w.jpg`}
                  alt={img.title}
                  width={400}
                  height={400}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
