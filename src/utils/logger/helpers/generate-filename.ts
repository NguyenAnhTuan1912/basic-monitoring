/**
 * Generate filename for logs
 * @param destination
 * @param level
 * @returns
 */
export default function generateFilename(destination: string, level: string) {
  const now = new Date();

  now.setMinutes(0);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const timestamp = `${year}-${month}-${date}_${hours}-${minutes}`;

  if (!level || level === "info") {
    return `${destination}_${timestamp}.log`;
  }
  return `${destination}_${timestamp}.${level}.log`;
}
