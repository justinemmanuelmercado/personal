import { defineConfig } from "vite";
import { prismjsPlugin } from "vite-plugin-prismjs";

export default defineConfig({
  plugins: [
    prismjsPlugin({
      languages: ["javascript", "css", "markup", "sh"],
      theme: "tomorrow",
      css: true,
    }),
  ],
});
