import next from "next";
const { NextConfig } = next;

/** @type {NextConfig} */
const nextConfig = {
  images: {
    domains: ["live.staticflickr.com"],
  },
};

export default nextConfig;
