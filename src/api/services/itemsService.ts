
// src/api/services/itemsService.ts
import { baseUrl, defaultHeaders, fetchWithErrorHandling } from "../core/apiClient";

// Fetch contract items
export async function fetchContractItems(contractId: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contractitems?contract=${contractId}`, {
    headers: defaultHeaders()
  });
}

// Update item status
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

// Off-hire an item
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

// Fetch item comments
export async function fetchItemComments(itemId: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contractitems/${itemId}/comments`, {
    headers: defaultHeaders()
  });
}

// Add a comment to an item
export async function addItemComment(itemId: string, comment: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contractitems/${itemId}/comments`, {
    method: "POST",
    headers: defaultHeaders(),
    body: JSON.stringify({
      Comment: comment
    })
  });
}
