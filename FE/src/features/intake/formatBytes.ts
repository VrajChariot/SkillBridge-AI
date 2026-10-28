import { MEGABYTE } from "./limits";

const KILOBYTE = 1024;

/** "512 bytes", "482 KB", "1.2 MB", "10 MB". */
export function formatBytes(bytes: number): string {
  if (bytes < KILOBYTE) return bytes === 1 ? "1 byte" : `${bytes} bytes`;
  const kilobytes = Math.round(bytes / KILOBYTE);
  // 1023.6 KB rounds to 1024 KB; show it as megabytes instead.
  if (kilobytes < KILOBYTE) return `${kilobytes} KB`;
  const megabytes = (bytes / MEGABYTE).toFixed(1).replace(/\.0$/, "");
  return `${megabytes} MB`;
}
