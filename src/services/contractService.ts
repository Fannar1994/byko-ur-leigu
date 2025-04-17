import { searchByKennitala, offHireItem } from "./api";
import { RentalItem, SearchResults, ContractServiceError, OffHireResponse, CountUpdate } from "@/types/contract";

/**
 * Fetches contract data for a given kennitala
 * @param kennitala The ID number to search by
 * @returns Promise with contract data
 * @throws ContractServiceError with code and descriptive message
 */
export async function fetchContractData(kennitala: string): Promise<SearchResults> {
  try {
    // Input validation
    if (!kennitala || kennitala.trim() === "") {
      throw new Error("Kennitala cannot be empty");
    }
    
    const data = await searchByKennitala(kennitala);
    return data;
  } catch (error) {
    // Convert to typed error with additional context
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error fetching contract data: ${errorMessage}`);
    
    // Map to domain-specific error
    const serviceError: ContractServiceError = {
      code: "FETCH_ERROR",
      message: errorMessage,
      originalError: error instanceof Error ? error : new Error(String(error))
    };
    
    throw serviceError;
  }
}

/**
 * Performs off-hire operation on a rental item
 * @param itemId ID of the item to off-hire
 * @param noCharge Whether to charge for the off-hire
 * @returns Promise with off-hire response
 * @throws ContractServiceError with code and descriptive message
 */
export async function performOffHire(itemId: string, noCharge: boolean): Promise<OffHireResponse> {
  try {
    // Input validation
    if (!itemId) {
      throw new Error("Item ID cannot be empty");
    }
    
    const response = await offHireItem(itemId, noCharge);
    return response;
  } catch (error) {
    // Convert to typed error with additional context
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error performing off-hire: ${errorMessage}`);
    
    // Map to domain-specific error
    const serviceError: ContractServiceError = {
      code: "OFFHIRE_ERROR",
      message: errorMessage,
      originalError: error instanceof Error ? error : new Error(String(error))
    };
    
    throw serviceError;
  }
}

/**
 * Updates the count for a specific rental item
 * @param itemId ID of the item to update
 * @param count The new count value
 * @returns Promise with success status
 * @throws ContractServiceError with code and descriptive message
 */
export async function updateItemCount(itemId: string, count: number): Promise<{success: boolean, message: string}> {
  try {
    // Input validation
    if (!itemId) {
      throw new Error("Item ID cannot be empty");
    }
    
    if (count < 0) {
      throw new Error("Count cannot be negative");
    }
    
    // In a real implementation, this would call an API
    // For now, we just simulate a successful update
    console.log(`Updating count for item ${itemId} to ${count}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      message: `Talning uppfærð í ${count}.`
    };
  } catch (error) {
    // Convert to typed error with additional context
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error updating item count: ${errorMessage}`);
    
    // Map to domain-specific error
    const serviceError: ContractServiceError = {
      code: "VALIDATION_ERROR",
      message: errorMessage,
      originalError: error instanceof Error ? error : new Error(String(error))
    };
    
    throw serviceError;
  }
}

/**
 * Filters rental items that are currently on rent
 * @param items Array of rental items to filter
 * @returns Array of active rental items
 */
export function filterActiveItems(items: RentalItem[]): RentalItem[] {
  if (!Array.isArray(items)) return [];
  
  return items.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  );
}

/**
 * Filters items that are ready for picking
 * @param items Array of rental items to filter
 * @returns Array of items ready for picking
 */
export function filterReadyForPickItems(items: RentalItem[]): RentalItem[] {
  if (!Array.isArray(items)) return [];
  
  return items.filter(item => 
    item.status !== "Tiltekt" && 
    item.status !== "Úr leiga" && 
    item.status !== "Off-Hired" &&
    item.status !== "Í leigu" &&
    item.status !== "On Rent" &&
    item.status !== "Tilbúið til afhendingar"
  );
}

/**
 * Filters items that are in setup ("Tiltekt") status
 * @param items Array of rental items to filter
 * @returns Array of items in tiltekt status
 */
export function filterTiltektItems(items: RentalItem[]): RentalItem[] {
  if (!Array.isArray(items)) return [];
  
  return items.filter(item => 
    item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar"
  );
}

/**
 * Filters items that are in active status but ready for off-hire
 * @param items Array of rental items to filter
 * @returns Array of items ready for off-hire
 */
export function filterOffHiredItems(items: RentalItem[]): RentalItem[] {
  if (!Array.isArray(items)) return [];
  
  return items.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  );
}
