import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Elke pagina als map met index.html, zodat de webserver bij Vimexx ze kan tonen
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
