// src/api/inspHireService.ts
import { API_CONFIG } from "@/config/appConfig";

const baseUrl = API_CONFIG.inspHireApi;

function getSessionId(): string {
  const session = localStorage.getItem("inspSession");
  if (!session) throw new Error("Session not found. Please log in.");
  return session;
}

const defaultHeaders = () => ({
  "EnableString": API_CONFIG.enableString,
  "SessionID": getSessionId(),
  "Content-Type": "application/json"
});

export async function loginToInspHire(username: string, password: string) {
  try {
    const response = await fetch(`${baseUrl}/api/session`, {
      method: "POST",
      headers: {
        "EnableString": API_CONFIG.enableString,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error("Login failed: Network response was not ok");
    }

    const data = await response.json();
    
    if (data.STATUS !== 1) {
      throw new Error(data.MESSAGE || "Invalid login credentials");
    }

    return {
      sessionId: data.SESSIONID,
      username: data.USERNAME,
      depot: data.DEPOT
    };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("Could not connect to inspHire API. Please check your network connection or API configuration.");
    }
    throw error;
  }
}

export async function fetchContracts() {
  try {
    const response = await fetch(`${baseUrl}/api/contracts`, {
      headers: defaultHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch contracts");
    return response.json();
  } catch (error) {
    console.error("Error fetching contracts:", error);
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("Could not connect to inspHire API. Please check your network connection or API configuration.");
    }
    throw error;
  }
}

export async function fetchContractItems(contractId: string) {
  try {
    const response = await fetch(`${baseUrl}/api/contractitems?contract=${contractId}`, {
      headers: defaultHeaders()
    });
    if (!response.ok) throw new Error("Could not fetch contract items");
    return response.json();
  } catch (error) {
    console.error("Error fetching contract items:", error);
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error("Could not connect to inspHire API. Please check your network connection or API configuration.");
    }
    throw error;
  }
}

export async function updateItemStatus(itemId: string, status: string, memo?: string) {
  const response = await fetch(`${baseUrl}/api/contractitems/${itemId}`, {
    method: "PUT",
    headers: defaultHeaders(),
    body: JSON.stringify({
      Status: status,
      Memo: memo ?? `Status updated to ${status}`
    })
  });
  if (!response.ok) throw new Error("Failed to update item status");
  return response.json();
}

export async function offHireItem(itemId: string, date: string, reason?: string) {
  const response = await fetch(`${baseUrl}/api/offhireitems`, {
    method: "POST",
    headers: defaultHeaders(),
    body: JSON.stringify({
      ItemId: itemId,
      OffHireDate: date,
      Reason: reason ?? "Auto off-hire from Tiltektarkerfi"
    })
  });
  if (!response.ok) throw new Error("Off-hire request failed");
  return response.json();
}
