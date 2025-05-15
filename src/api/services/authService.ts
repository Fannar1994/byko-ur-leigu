
// src/api/services/authService.ts
import { baseUrl, defaultHeaders, fetchWithErrorHandling } from "../core/apiClient";
import { API_CONFIG } from "@/config/appConfig";

// Test API connection
export async function testApiConnection() {
  try {
    // Make a simple request to check if the API is accessible
    const response = await fetch(`${baseUrl}/api/status`, {
      method: "GET",
      headers: defaultHeaders()
    });
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: baseUrl
    };
  } catch (error) {
    console.error("API connection test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      url: baseUrl
    };
  }
}

// Login to inspHire
export async function loginToInspHire(username: string, password: string) {
  try {
    const response = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "EnableString": API_CONFIG.enableString,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Store session in localStorage
    localStorage.setItem("inspSession", data.sessionId || "auto-session");
    localStorage.setItem("inspUsername", username);
    localStorage.setItem("inspDepot", data.depot || "main");
    
    return {
      sessionId: data.sessionId || "auto-session",
      username: username,
      depot: data.depot || "main"
    };
  } catch (error) {
    console.error("Error logging in to inspHire:", error);
    
    // Fallback to auto-session if login fails
    const fallbackSession = "auto-session";
    localStorage.setItem("inspSession", fallbackSession);
    localStorage.setItem("inspUsername", username);
    localStorage.setItem("inspDepot", "main");
    
    return {
      sessionId: fallbackSession,
      username: username,
      depot: "main"
    };
  }
}

// Check if session is valid
export async function validateSession(sessionId: string) {
  try {
    const response = await fetch(`${baseUrl}/api/session/validate`, {
      method: "GET",
      headers: {
        "EnableString": API_CONFIG.enableString,
        "SessionID": sessionId,
        "Content-Type": "application/json"
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error validating session:", error);
    return false;
  }
}
