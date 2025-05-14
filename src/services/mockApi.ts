
import { SearchResults, OffHireResponse } from "@/types/contract";

// Mock implementation for development and testing
export function mockSearchByKennitala(kennitala: string): Promise<SearchResults> {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
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
      resolve({
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
            location: "Hafnarfjörður",
            department: "KOPA"
          },
          {
            id: contractId2,
            contractNumber: contractNumber2,
            status: "Lokið",
            startDate: "2022-11-01",
            endDate: "2023-02-01",
            totalValue: 75000,
            location: "Reykjavík",
            department: "ÞORH"
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
            status: "Í leigu",
            department: "KOPA"
          },
          {
            id: `i2-${kennitala.substring(0, 4)}`,
            contractId: contractId1,
            itemName: "Steypuhrærivél",
            category: "Byggingartæki",
            serialNumber: "CM-2023-042",
            dueDate: "2023-12-15",
            rentalRate: 8000,
            status: "Í leigu",
            department: "GRAN"
          },
          {
            id: `i3-${kennitala.substring(0, 4)}`,
            contractId: contractId1,
            itemName: "Öryggishjálmar (5 stk)",
            category: "Öryggisbúnaður",
            serialNumber: "SH-2023-105",
            dueDate: "2023-12-15",
            rentalRate: 500,
            status: "Í leigu",
            department: "KOPA"
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
            status: "Tiltekt",
            department: "KEFL"
          },
          {
            id: `i5-${kennitala.substring(0, 4)}`,
            contractId: contractId2,
            itemName: "Slípivél",
            category: "Handverkfæri",
            serialNumber: "SL-2023-056",
            dueDate: "2023-02-01",
            rentalRate: 2500,
            status: "Tiltekt",
            department: "SELF"
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
            status: "Úr leiga",
            department: "AKEY"
          },
          {
            id: `i7-${kennitala.substring(0, 4)}`,
            contractId: contractId2,
            itemName: "Byggingarkrani",
            category: "Þungar vinnuvélar",
            serialNumber: "CR-2022-008",
            dueDate: "2023-01-20",
            rentalRate: 50000,
            status: "Úr leiga",
            department: "VER"
          }
        ]
      });
    }, 1000);
  });
}

// Mock implementation for off-hire
export async function mockOffHireItem(itemId: string, noCharge: boolean = false): Promise<OffHireResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log(`Mock off-hiring item ${itemId} with no charge: ${noCharge}`);
  
  return {
    success: true,
    message: `Hlutur var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
    itemId
  };
}
