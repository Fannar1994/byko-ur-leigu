
import { SearchResults, OffHireResponse } from "@/types/contract";
import { fetchContracts, fetchContractItems, offHireItem as realOffHireItem } from "@/api/inspHireService";
import { mockSearchByKennitala, mockOffHireItem } from "./mockApi";
import { validateKennitala } from "./validation";

/**
 * Search for contracts by kennitala.
 * Will attempt to use the real API service first, with fallback to mock data.
 */
export async function searchByKennitala(kennitala: string): Promise<SearchResults> {
  if (!validateKennitala(kennitala)) {
    throw new Error("Ógilt kennitölusnið. Vinsamlegast sláðu inn 10 stafa tölu.");
  }

  try {
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
    console.error("Error searching by kennitala:", error);
    
    // Fallback to mock data for development/testing
    return mockSearchByKennitala(kennitala);
  }
}

// Re-export validation function for convenience
export { validateKennitala } from "./validation";

/**
 * Off-hire an item using the real service with fallback to mock.
 * @param itemId The ID of the item to off-hire
 * @param noCharge Whether this is a no-charge off-hire
 */
export async function offHireItem(itemId: string, noCharge: boolean = false): Promise<OffHireResponse> {
  try {
    const today = new Date().toISOString().split("T")[0];
    await realOffHireItem(itemId, today, noCharge ? "No charge" : undefined);

    return {
      success: true,
      message: `Hlutur var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
      itemId
    };
  } catch (error) {
    console.error("Error using real off-hire service:", error);
    
    // Fallback to mock implementation
    return mockOffHireItem(itemId, noCharge);
  }
}
