import path from "path";
import { fileURLToPath } from "url";

export const getRootPath = () => {
  // __filename - path to dist/index.js
  const __filename = fileURLToPath(import.meta.url);

  // __dirname - path to dist
  const distPath = path.dirname(__filename);

  // return path to root
  return path.join(distPath, "../");
};
