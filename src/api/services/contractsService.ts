
// src/api/services/contractsService.ts
import { baseUrl, defaultHeaders, fetchWithErrorHandling } from "../core/apiClient";

// Fetch all contracts
export async function fetchContracts() {
  return fetchWithErrorHandling(`${baseUrl}/api/contracts`, {
    headers: defaultHeaders()
  });
}

// Fetch contract attachments
export async function fetchContractAttachments(contractId: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/contracts/${contractId}/attachments`, {
    headers: defaultHeaders()
  });
}
