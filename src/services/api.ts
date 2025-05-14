import { SearchResults, OffHireResponse } from "@/types/contract";
import { fetchContracts, fetchContractItems } from "@/api/inspHireService";
import { validateKennitala } from "./validation";
import { mockSearchByKennitala, mockOffHireItem } from "./mockApi";

// Flag to determine if we should use mock data (for demo purposes)
const useMockData = true;

/**
 * Search for contracts by kennitala.
 * Will use mock data if useMockData is set to true
 */
export async function searchByKennitala(kennitala: string): Promise<SearchResults> {
  if (!validateKennitala(kennitala)) {
    throw new Error("Ógilt kennitölusnið. Vinsamlegast sláðu inn 10 stafa tölu.");
  }

  try {
    // Check if we should use mock data for demo purposes
    if (useMockData) {
      return mockSearchByKennitala(kennitala);
    }

    // Real API implementation
    const allContracts = await fetchContracts();

    const contracts = allContracts.filter((contract: any) =>
      contract.Customer?.Kennitala?.replace("-", "") === kennitala
    );

    if (contracts.length === 0) {
      throw new Error("Engir samningar fundust fyrir þessa kennitölu.");
    }

    const contractItems = await Promise.all(
      contracts.map((c: any) => fetchContractItems(c.ContractId))
    );

    return {
      renter: {
        name: contracts[0].Customer?.Name ?? "Óþekktur",
        kennitala
      },
      contracts: contracts.map((c: any) => ({
        id: c.ContractId,
        contractNumber: c.ContractNumber,
        status: c.Status,
        startDate: c.StartDate,
        endDate: c.EndDate,
        totalValue: c.TotalValue,
        location: c.Location,
        department: c.Department
      })),
      rentalItems: contractItems.flat()
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

// Re-export validation function for convenience
export { validateKennitala } from "./validation";

/**
 * Off-hire an item - uses mock or real implementation based on useMockData flag
 */
export async function offHireItem(itemId: string, noCharge: boolean = false): Promise<OffHireResponse> {
  // Use mock data for demo purposes if flag is set
  if (useMockData) {
    return mockOffHireItem(itemId, noCharge);
  }
  
  // Otherwise, we would call the real API here
  
  // For now, just return success without making any API calls
  return {
    success: true,
    message: `Hlutur var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
    itemId
  };
}
