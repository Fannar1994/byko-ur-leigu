
import { SearchResults, OffHireResponse } from "@/types/contract";

// This is a mock API service - in a real application, this would connect to the InspHire API
export async function searchByKennitala(kennitala: string): Promise<SearchResults> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate API error for invalid format
  if (kennitala.length !== 10 || !/^\d+$/.test(kennitala)) {
    throw new Error("Invalid kennitala format. Please enter a 10-digit number.");
  }

  // Simulate no results found
  if (kennitala === "0000000000") {
    throw new Error("No contracts found for this kennitala.");
  }

  // Mock data for demonstration
  return {
    renter: {
      name: `Jón Jónsson ${kennitala.substring(0, 2)}`,
      kennitala
    },
    contracts: [
      {
        id: "c1",
        contractNumber: `C-${kennitala.substring(0, 6)}`,
        status: "Active",
        startDate: "2023-06-15",
        endDate: "2023-12-15",
        totalValue: 150000
      },
      {
        id: "c2",
        contractNumber: `C-${kennitala.substring(0, 4)}-B`,
        status: "Completed",
        startDate: "2022-11-01",
        endDate: "2023-02-01",
        totalValue: 75000
      }
    ],
    rentalItems: [
      {
        id: "i1",
        contractId: "c1",
        itemName: "Excavator XL2000",
        category: "Heavy Machinery",
        serialNumber: "EX-2023-001",
        dueDate: "2023-12-15",
        rentalRate: 25000,
        status: "On Rent"
      },
      {
        id: "i2",
        contractId: "c1",
        itemName: "Concrete Mixer",
        category: "Construction Equipment",
        serialNumber: "CM-2023-042",
        dueDate: "2023-12-15",
        rentalRate: 8000,
        status: "On Rent"
      },
      {
        id: "i3",
        contractId: "c1",
        itemName: "Safety Helmet (5 units)",
        category: "Safety Equipment",
        serialNumber: "SH-2023-105",
        dueDate: "2023-12-15",
        rentalRate: 500,
        status: "On Rent"
      }
    ]
  };
}

export function validateKennitala(kennitala: string): boolean {
  // Basic validation - should be 10 digits
  if (kennitala.length !== 10 || !/^\d+$/.test(kennitala)) {
    return false;
  }
  
  // More sophisticated validation could be added here
  return true;
}

// New function to handle off-hiring an item
export async function offHireItem(itemId: string, noCharge: boolean = false): Promise<OffHireResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would call the InspHire API
  console.log(`Off-hiring item ${itemId} with no charge: ${noCharge}`);
  
  // Simulate success
  return {
    success: true,
    message: `Item successfully off-hired${noCharge ? ' with no charge' : ''}.`,
    itemId
  };
}
