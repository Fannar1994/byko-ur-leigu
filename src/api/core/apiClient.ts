
// src/api/core/apiClient.ts
import { API_CONFIG } from "@/config/appConfig";

const baseUrl = API_CONFIG.inspHireApi;

// Get session ID from localStorage or return a default value
export function getSessionId(): string {
  const session = localStorage.getItem("inspSession");
  return session || "auto-session";
}

export const defaultHeaders = () => ({
  "EnableString": API_CONFIG.enableString,
  "SessionID": getSessionId(),
  "Content-Type": "application/json"
});

// Helper function to handle fetch errors consistently
export async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("API request timed out. The server may be experiencing issues.");
    }
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(`Could not connect to inspHire API at ${baseUrl}. Please check your network connection or API configuration.`);
    }
    throw error;
  }
}

export { baseUrl };
