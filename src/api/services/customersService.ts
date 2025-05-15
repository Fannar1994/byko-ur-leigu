
// src/api/services/customersService.ts
import { baseUrl, defaultHeaders, fetchWithErrorHandling } from "../core/apiClient";

// Fetch customer information by kennitala
export async function fetchCustomerByKennitala(kennitala: string) {
  return fetchWithErrorHandling(`${baseUrl}/api/customers?kennitala=${kennitala}`, {
    headers: defaultHeaders()
  });
}
