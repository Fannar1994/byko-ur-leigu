
import { Contract, RentalItem, SearchResults, OffHireResponse } from "@/types/contract";

// Mock data for testing without API connection
const mockContracts: Contract[] = [
  {
    id: "C-12345",
    contractNumber: "12345",
    status: "Active",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    totalValue: 45000,
    location: "KOPA",
    department: "KOPA"
  },
  {
    id: "C-67890",
    contractNumber: "67890",
    status: "Í leigu",
    startDate: "2023-02-15",
    endDate: "2024-02-14",
    totalValue: 60000,
    location: "KOPA",
    department: "KOPA"
  },
  {
    id: "C-34567",
    contractNumber: "34567",
    status: "Úr leiga",
    startDate: "2023-03-01",
    endDate: "2024-02-29",
    totalValue: 52000,
    location: "GRAN",
    department: "GRAN"
  },
  {
    id: "C-89012",
    contractNumber: "89012",
    status: "Active",
    startDate: "2023-04-10",
    endDate: "2024-04-09",
    totalValue: 48000,
    location: "GRAN",
    department: "GRAN"
  },
  {
    id: "C-54321",
    contractNumber: "54321",
    status: "Í leigu",
    startDate: "2023-05-01",
    endDate: "2024-04-30",
    totalValue: 55000,
    location: "KOPA",
    department: "KOPA"
  }
];

// Mock rental items
const mockRentalItems: RentalItem[] = [
  {
    id: "I-001",
    contractId: "C-12345",
    itemName: "Borvél",
    category: "Handverkfæri",
    serialNumber: "SN-12345",
    dueDate: "2023-12-31",
    rentalRate: 1500,
    status: "Í leigu",
    location: "KOPA",
    department: "KOPA"
  },
  {
    id: "I-002",
    contractId: "C-12345",
    itemName: "Slípivél",
    category: "Handverkfæri",
    serialNumber: "SN-67890",
    dueDate: "2023-12-31",
    rentalRate: 1200,
    status: "Tilbúið til afhendingar",
    location: "GRAN",
    department: "GRAN"
  },
  {
    id: "I-003",
    contractId: "C-67890",
    itemName: "Hjólaskófla",
    category: "Stórtæki",
    serialNumber: "SN-11223",
    dueDate: "2024-02-14",
    rentalRate: 2000,
    status: "Í leigu",
    location: "GRAN",
    department: "GRAN"
  },
  {
    id: "I-004",
    contractId: "C-67890",
    itemName: "Jarðýta",
    category: "Stórtæki",
    serialNumber: "SN-44556",
    dueDate: "2024-02-14",
    rentalRate: 2500,
    status: "Tilbúið til afhendingar",
    location: "KEFL",
    department: "KEFL"
  },
  {
    id: "I-005",
    contractId: "C-34567",
    itemName: "Veghefill",
    category: "Stórtæki",
    serialNumber: "SN-77889",
    dueDate: "2024-02-29",
    rentalRate: 1800,
    status: "Úr leiga",
    location: "KOPA",
    department: "KOPA"
  },
  {
    id: "I-006",
    contractId: "C-34567",
    itemName: "Malbikari",
    category: "Stórtæki",
    serialNumber: "SN-99001",
    dueDate: "2024-02-29",
    rentalRate: 2200,
    status: "Úr leiga",
    location: "GRAN",
    department: "GRAN"
  },
  {
    id: "I-007",
    contractId: "C-89012",
    itemName: "Pípulögn",
    category: "Verkfæri",
    serialNumber: "SN-22334",
    dueDate: "2024-04-09",
    rentalRate: 1600,
    status: "Í leigu",
    location: "KEFL",
    department: "KEFL"
  },
  {
    id: "I-008",
    contractId: "C-89012",
    itemName: "Rafmagnsvél",
    category: "Verkfæri",
    serialNumber: "SN-55667",
    dueDate: "2024-04-09",
    rentalRate: 1900,
    status: "Í leigu",
    location: "KOPA",
    department: "KOPA"
  },
  {
    id: "I-009",
    contractId: "C-54321",
    itemName: "Steinsög",
    category: "Verkfæri",
    serialNumber: "SN-88990",
    dueDate: "2024-04-30",
    rentalRate: 1700,
    status: "Í leigu",
    location: "GRAN",
    department: "GRAN"
  },
  {
    id: "I-010",
    contractId: "C-54321",
    itemName: "Múrbrjótur",
    category: "Verkfæri",
    serialNumber: "SN-11223",
    dueDate: "2024-04-30",
    rentalRate: 2100,
    status: "Í leigu",
    location: "KEFL",
    department: "KEFL"
  }
];

// Function to simulate fetching contracts from an API
export const fetchContracts = async (): Promise<Contract[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockContracts);
    }, 500); // Simulate network delay
  });
};

// Function to simulate fetching a single contract by contractNumber
export const fetchContractByNumber = async (contractNumber: string): Promise<Contract | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const contract = mockContracts.find(c => c.contractNumber === contractNumber);
      resolve(contract);
    }, 300); // Simulate network delay
  });
};

// Add these missing exports that are used in api.ts
export const mockSearchByKennitala = (kennitala: string): Promise<SearchResults> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Pretend we're finding contracts for this kennitala
      const renter = {
        name: kennitala === "1234567890" ? "Jón Jónsson" : "Testviðskiptavinur",
        kennitala: kennitala,
        address: "Aðalgata 123",
        city: "Reykjavík",
        postalCode: "101",
        contactPerson: "Jón Jónsson",
        phone: "555-1234"
      };
      
      // Filter contracts based on kennitala
      // In a real implementation, we would filter based on the customer's kennitala
      const contracts = kennitala === "1234567890" 
        ? mockContracts.slice(0, 2) 
        : mockContracts.slice(2, 4);
      
      // Get items for these contracts
      const rentalItems = mockRentalItems.filter(item => 
        contracts.some(contract => contract.id === item.contractId)
      );
      
      resolve({
        renter,
        contracts,
        rentalItems
      });
    }, 800);
  });
};

// Mock function for off-hiring items
export const mockOffHireItem = (itemId: string, noCharge: boolean = false): Promise<OffHireResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real implementation, we would update the status of the item in the database
      // Here we're just pretending we did that
      
      resolve({
        success: true,
        message: `Hlutur ${itemId} var skráður af leigu${noCharge ? ' án gjalds' : ''}.`,
        itemId
      });
    }, 500);
  });
};

// Mock function to update item status
export const updateItemStatusMock = async (itemId: string, newStatus: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = mockRentalItems.find(item => item.id === itemId);
      if (item) {
        item.status = newStatus as any;
      }
      resolve();
    }, 200); // Simulate delay
  });
};

// Mock data for off-hired items
const mockOffHiredItems: RentalItem[] = [
  {
    id: "I-003",
    contractId: "C-12345",
    itemName: "Háþrýstidæla",
    category: "Verkfæri",
    serialNumber: "SN-24680",
    dueDate: "2023-01-20",
    rentalRate: 3500,
    status: "Úr leiga",
    location: "KOPA",
    department: "KOPA"
  },
  {
    id: "I-004",
    contractId: "C-67890",
    itemName: "Stigapallur",
    category: "Verkfæri",
    serialNumber: "SN-98765",
    dueDate: "2023-03-10",
    rentalRate: 1800,
    status: "Úr leiga",
    location: "KEFL",
    department: "KEFL"
  }
];

// Function to simulate fetching off-hired items from an API
export const fetchOffHiredItems = async (): Promise<RentalItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOffHiredItems);
    }, 500); // Simulate network delay
  });
};
