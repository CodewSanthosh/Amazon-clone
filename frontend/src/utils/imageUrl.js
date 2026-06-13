import { backend_url } from "../server";

/**
 * Returns the correct image URL - handles both full URLs and local file paths
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/200";
  if (imagePath.startsWith("http")) return imagePath;
  return `${backend_url}${imagePath}`;
};
