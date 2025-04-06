
import { SearchResults, OffHireResponse } from "@/types/contract";

// This is a mock API service - in a real application, this would connect to the InspHire API
export async function searchByKennitala(kennitala: string): Promise<SearchResults> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate API error for invalid format
  if (kennitala.length !== 10 || !/^\d+$/.test(kennitala)) {
    throw new Error("Ógilt kennitölusnið. Vinsamlegast sláðu inn 10 stafa tölu.");
  }

  // Simulate no results found
  if (kennitala === "0000000000") {
    throw new Error("Engir samningar fundust fyrir þessa kennitölu.");
  }

  // Generate contract ids and numbers based on kennitala to ensure consistency
  const contractId1 = `c1-${kennitala.substring(0, 4)}`;
  const contractId2 = `c2-${kennitala.substring(0, 4)}`;
  const contractNumber1 = `C-${kennitala.substring(0, 6)}`;
  const contractNumber2 = `C-${kennitala.substring(0, 4)}-B`;

  // Mock data for demonstration
  return {
    renter: {
      name: `Jón Jónsson ${kennitala.substring(0, 2)}`,
      kennitala
    },
    contracts: [
      {
        id: contractId1,
        contractNumber: contractNumber1,
        status: "Virkur",
        startDate: "2023-06-15",
        endDate: "2023-12-15",
        totalValue: 150000,
        location: "Hafnarfjörður"
      },
      {
        id: contractId2,
        contractNumber: contractNumber2,
        status: "Lokið",
        startDate: "2022-11-01",
        endDate: "2023-02-01",
        totalValue: 75000,
        location: "Reykjavík"
      }
    ],
    rentalItems: [
      {
        id: `i1-${kennitala.substring(0, 4)}`,
        contractId: contractId1,
        itemName: "Gröfuvél XL2000",
        category: "Þungar vinnuvélar",
        serialNumber: "EX-2023-001",
        dueDate: "2023-12-15",
        rentalRate: 25000,
        status: "Í leigu"
      },
      {
        id: `i2-${kennitala.substring(0, 4)}`,
        contractId: contractId1,
        itemName: "Steypuhrærivél",
        category: "Byggingartæki",
        serialNumber: "CM-2023-042",
        dueDate: "2023-12-15",
        rentalRate: 8000,
        status: "Í leigu"
      },
      {
        id: `i3-${kennitala.substring(0, 4)}`,
        contractId: contractId1,
        itemName: "Öryggishjálmar (5 stk)",
        category: "Öryggisbúnaður",
        serialNumber: "SH-2023-105",
        dueDate: "2023-12-15",
        rentalRate: 500,
        status: "Í leigu"
      },
      // Add example items with Tiltekt status
      {
        id: `i4-${kennitala.substring(0, 4)}`,
        contractId: contractId1,
        itemName: "Rafmagnsborvél",
        category: "Handverkfæri",
        serialNumber: "ED-2023-201",
        dueDate: "2023-12-10",
        rentalRate: 3000,
        status: "Tiltekt"
      },
      {
        id: `i5-${kennitala.substring(0, 4)}`,
        contractId: contractId2,
        itemName: "Slípivél",
        category: "Handverkfæri",
        serialNumber: "SL-2023-056",
        dueDate: "2023-02-01",
        rentalRate: 2500,
        status: "Tiltekt"
      },
      // Add example items with Úr leiga status
      {
        id: `i6-${kennitala.substring(0, 4)}`,
        contractId: contractId2,
        itemName: "Hillukerfi",
        category: "Innréttingar",
        serialNumber: "SH-2022-312",
        dueDate: "2023-01-15",
        rentalRate: 15000,
        status: "Úr leiga"
      },
      {
        id: `i7-${kennitala.substring(0, 4)}`,
        contractId: contractId2,
        itemName: "Byggingarkrani",
        category: "Þungar vinnuvélar",
        serialNumber: "CR-2022-008",
        dueDate: "2023-01-20",
        rentalRate: 50000,
        status: "Úr leiga"
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
    message: `Hlutur var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
    itemId
  };
}
