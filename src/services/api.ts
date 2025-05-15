
import { SearchResults, OffHireResponse } from "@/types/contract";
import { 
  fetchContracts, 
  fetchContractItems, 
  offHireItem as apiOffHireItem, 
  updateItemStatus, 
  fetchCustomerByKennitala 
} from "@/api/inspHireService";
import { validateKennitala } from "./validation";

/**
 * Search for contracts by kennitala.
 * Uses the real inspHire API
 */
export async function searchByKennitala(kennitala: string): Promise<SearchResults> {
  if (!validateKennitala(kennitala)) {
    throw new Error("Ógilt kennitölusnið. Vinsamlegast sláðu inn 10 stafa tölu.");
  }

  try {
    // Try to fetch customer info first
    let customerName = "Óþekktur";
    let customerInfo;
    
    try {
      customerInfo = await fetchCustomerByKennitala(kennitala);
      if (customerInfo && customerInfo.length > 0) {
        customerName = customerInfo[0]?.Name || "Óþekktur";
      }
    } catch (error) {
      console.error("Error fetching customer info:", error);
      // Continue with contracts lookup even if customer info fails
    }

    // Fetch all contracts
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
        name: contracts[0].Customer?.Name || customerName,
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
 * Off-hire an item - uses the real API implementation
 */
export async function offHireItem(itemId: string, noCharge: boolean = false): Promise<OffHireResponse> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const reason = noCharge ? "Off-hired without charge" : "Off-hired from Tiltektarkerfi";
    
    const result = await apiOffHireItem(itemId, today, reason);
    
    return {
      success: true,
      message: `Hlutur var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
      itemId
    };
  } catch (error) {
    console.error("Error off-hiring item:", error);
    throw error;
  }
}
