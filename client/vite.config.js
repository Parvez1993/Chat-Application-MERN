import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:5000", // Use the port your backend runs on
        ws: true,
      },
    },
  },
});
