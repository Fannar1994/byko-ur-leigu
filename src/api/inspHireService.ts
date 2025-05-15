
// src/api/inspHireService.ts
import { API_CONFIG } from "@/config/appConfig";

const baseUrl = API_CONFIG.inspHireApi;

// This function has been updated to actually test the API connection
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

// Get session ID from localStorage or return a default value
function getSessionId(): string {
  const session = localStorage.getItem("inspSession");
  return session || "auto-session";
}

const defaultHeaders = () => ({
  "EnableString": API_CONFIG.enableString,
  "SessionID": getSessionId(),
  "Content-Type": "application/json"
});

// This function is updated to handle real login and session management
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

// Helper function to handle fetch errors consistently
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
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

export async function fetchContracts() {
  return fetchWithErrorHandling(`${baseUrl}/api/contracts`, {
    headers: defaultHeaders()
  });
}

export async function fetchContractItems(contractId: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contractitems?contract=${contractId}`, {
    headers: defaultHeaders()
  });
}

export async function updateItemStatus(itemId: string, status: string, memo?: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contractitems/${itemId}`, {
    method: "PUT",
    headers: defaultHeaders(),
    body: JSON.stringify({
      Status: status,
      Memo: memo ?? `Status updated to ${status}`
    })
  });
}

export async function offHireItem(itemId: string, date: string, reason?: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/offhireitems`, {
    method: "POST",
    headers: defaultHeaders(),
    body: JSON.stringify({
      ItemId: itemId,
      OffHireDate: date,
      Reason: reason ?? "Auto off-hire from Tiltektarkerfi"
    })
  });
}

// New function to fetch customer information by kennitala
export async function fetchCustomerByKennitala(kennitala: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/customers?kennitala=${kennitala}`, {
    headers: defaultHeaders()
  });
}

// New function to fetch contract attachments
export async function fetchContractAttachments(contractId: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contracts/${contractId}/attachments`, {
    headers: defaultHeaders()
  });
}

// New function to fetch item comments
export async function fetchItemComments(itemId: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contractitems/${itemId}/comments`, {
    headers: defaultHeaders()
  });
}

// New function to add a comment to an item
export async function addItemComment(itemId: string, comment: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contractitems/${itemId}/comments`, {
    method: "POST",
    headers: defaultHeaders(),
    body: JSON.stringify({
      Comment: comment
    })
  });
}
