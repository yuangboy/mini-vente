import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Remplace par ton domaine
        port: '',                // Laisse vide sauf si tu utilises un port spécifique
        pathname: '/**',         // Autorise tous les chemins
      },
      {
        protocol: 'https',
        hostname: 'blog-cdn.reedsy.com', // Remplace par ton domaine
        port: '',                // Laisse vide sauf si tu utilises un port spécifique
        pathname: '/**',         // Autorise tous les chemins
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com', // Remplace par ton domaine
        port: '',                // Laisse vide sauf si tu utilises un port spécifique
        pathname: '/**',         // Autorise tous les chemins
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Remplace par ton domaine
        port: '',                // Laisse vide sauf si tu utilises un port spécifique
        pathname: '/**',         // Autorise tous les chemins
      },
    ],
  }

};

export default nextConfig;
