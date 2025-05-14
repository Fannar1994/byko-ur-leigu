
import { SearchResults, OffHireResponse } from "@/types/contract";
import { fetchContracts, fetchContractItems } from "@/api/inspHireService";
import { validateKennitala } from "./validation";

/**
 * Search for contracts by kennitala.
 * Uses the real API service without fallback to mock data.
 */
export async function searchByKennitala(kennitala: string): Promise<SearchResults> {
  if (!validateKennitala(kennitala)) {
    throw new Error("Ógilt kennitölusnið. Vinsamlegast sláðu inn 10 stafa tölu.");
  }

  try {
    // Call the real API service - no fallback to mock
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
    throw new Error("Villa kom upp við að sækja gögn frá þjónustu. Vinsamlegast reyndu aftur.");
  }
}

// Re-export validation function for convenience
export { validateKennitala } from "./validation";

/**
 * Off-hire an item - this now only updates the local state and creates a report
 * without actually calling the off-hire API endpoint
 */
export async function offHireItem(itemId: string, noCharge: boolean = false): Promise<OffHireResponse> {
  // We're not making a real API call anymore, just returning success
  // The actual report generation and sending happens in the OffHireHandler component
  
  return {
    success: true,
    message: `Hlutur var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
    itemId
  };
}
