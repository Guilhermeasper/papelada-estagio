export function getAssetPath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL;
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // If baseUrl ends with /, just append cleanPath
  if (baseUrl.endsWith("/")) {
    return `${baseUrl}${cleanPath}`;
  }

  // Otherwise join with /
  return `${baseUrl}/${cleanPath}`;
}
