/**
 * Utility function to retry async operations with exponential backoff
 *
 * @param fn - The async function to retry
 * @param maxAttempts - Maximum number of retry attempts (default: 3)
 * @param baseDelay - Base delay in milliseconds between retries (default: 1000)
 * @returns Promise with the result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 500;

      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}

/**
 * Fetch with timeout support
 *
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds (default: 10000)
 * @returns Promise with the fetch response
 */
export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * RadioJar API Integration
 */

const RADIOJAR_STATION_ID = process.env.NEXT_PUBLIC_RADIOJAR_STATION_ID;
const RADIOJAR_API_KEY = process.env.NEXT_PUBLIC_RADIOJAR_API_KEY;
const RADIOJAR_BASE_URL = "https://www.radiojar.com/api";

interface RadioJarResponse {
  listeners?: number;
  current_listeners?: number;
  stats?: {
    listeners?: number;
  };
}

/**
 * Fetch current listener count from RadioJar API
 *
 * @returns {Promise<number | null>} Current listener count or null on failure
 *
 * This function attempts to fetch real-time listener data from RadioJar.
 * If RADIOJAR_STATION_ID is not configured, it returns null immediately.
 * On API errors, it logs the error and returns null for fallback handling.
 */
export async function fetchListenerCount(): Promise<number | null> {
  if (!RADIOJAR_STATION_ID) {
    console.info(
      "RadioJar Station ID not configured. Add NEXT_PUBLIC_RADIOJAR_STATION_ID to .env.local"
    );
    return null;
  }

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (RADIOJAR_API_KEY) {
      headers["Authorization"] = `Bearer ${RADIOJAR_API_KEY}`;
    }

    // RadioJar public API endpoint for station stats
    const response = await fetchWithTimeout(
      `${RADIOJAR_BASE_URL}/stations/${RADIOJAR_STATION_ID}/now_playing`,
      {
        method: "GET",
        headers,
        cache: "no-store",
        next: { revalidate: 0 },
      },
      8000 // 8 second timeout
    );

    if (!response.ok) {
      throw new Error(
        `RadioJar API error: ${response.status} ${response.statusText}`
      );
    }

    const data: RadioJarResponse = await response.json();

    // RadioJar API may return listeners in different fields
    const listenerCount =
      data.listeners ?? data.current_listeners ?? data.stats?.listeners ?? null;

    if (typeof listenerCount === "number") {
      return Math.max(0, Math.floor(listenerCount));
    }

    console.warn("RadioJar API response missing listener count", data);
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Failed to fetch listener count from RadioJar:",
        error.message
      );
    } else {
      console.error("Unknown error fetching listener count", error);
    }
    return null;
  }
}

/**
 * Format large numbers with K/M suffixes for compact display
 *
 * @param {number} count - The number to format
 * @returns {string} Formatted number (e.g., "5.2K", "1.3M")
 */
export function formatListenerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
