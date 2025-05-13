import { Contract, RentalItem, ContractStatus, RentalItemStatus, Location } from "@/types/contract";

// Mock data for testing without API connection
const mockContracts: Contract[] = [
  {
    id: "C-12345",
    contractNumber: "12345",
    customerName: "Jón Jónsson",
    customerNumber: "1234567890",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Active",
    total: 45000,
    location: "KOPA", // Using a valid location from the enum
    items: [
      {
        id: "I-001",
        contractId: "C-12345",
        name: "Borvél",
        serialNumber: "SN-12345",
        status: "Í leigu", // Using a valid status from the enum
        location: "KOPA", // Using a valid location from the enum
        imageUrl: "/placeholder.svg",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        rate: 1500,
        quantity: 1
      },
      {
        id: "I-002",
        contractId: "C-12345",
        name: "Slípivél",
        serialNumber: "SN-67890",
        status: "Tilbúið til afhendingar", // Using a valid status from the enum
        location: "GRAN", // Using a valid location from the enum
        imageUrl: "/placeholder.svg",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        rate: 1200,
        quantity: 1
      }
    ]
  },
  {
    id: "C-67890",
    contractNumber: "67890",
    customerName: "Anna Pétursdóttir",
    customerNumber: "9876543210",
    startDate: "2023-02-15",
    endDate: "2024-02-14",
    status: "Pending Return",
    total: 60000,
    location: "KOPA",
    items: [
      {
        id: "I-003",
        contractId: "C-67890",
        name: "Hjólaskófla",
        serialNumber: "SN-11223",
        status: "Í leigu",
        location: "GRAN",
        imageUrl: "/placeholder.svg",
        startDate: "2023-02-15",
        endDate: "2024-02-14",
        rate: 2000,
        quantity: 1
      },
      {
        id: "I-004",
        contractId: "C-67890",
        name: "Jarðýta",
        serialNumber: "SN-44556",
        status: "Tilbúið til afhendingar",
        location: "VOGA",
        imageUrl: "/placeholder.svg",
        startDate: "2023-02-15",
        endDate: "2024-02-14",
        rate: 2500,
        quantity: 1
      }
    ]
  },
  {
    id: "C-34567",
    contractNumber: "34567",
    customerName: "Einar Guðmundsson",
    customerNumber: "5678901234",
    startDate: "2023-03-01",
    endDate: "2024-02-29",
    status: "Off-Hired",
    total: 52000,
    location: "VOGA",
    items: [
      {
        id: "I-005",
        contractId: "C-34567",
        name: "Veghefill",
        serialNumber: "SN-77889",
        status: "Úr leiga",
        location: "KOPA",
        imageUrl: "/placeholder.svg",
        startDate: "2023-03-01",
        endDate: "2024-02-29",
        rate: 1800,
        quantity: 1
      },
      {
        id: "I-006",
        contractId: "C-34567",
        name: "Malbikari",
        serialNumber: "SN-99001",
        status: "Úr leiga",
        location: "GRAN",
        imageUrl: "/placeholder.svg",
        startDate: "2023-03-01",
        endDate: "2024-02-29",
        rate: 2200,
        quantity: 1
      }
    ]
  },
  {
    id: "C-89012",
    contractNumber: "89012",
    customerName: "Guðrún Ólafsdóttir",
    customerNumber: "3456789012",
    startDate: "2023-04-10",
    endDate: "2024-04-09",
    status: "Active",
    total: 48000,
    location: "GRAN",
    items: [
      {
        id: "I-007",
        contractId: "C-89012",
        name: "Pípulögn",
        serialNumber: "SN-22334",
        status: "Í leigu",
        location: "VOGA",
        imageUrl: "/placeholder.svg",
        startDate: "2023-04-10",
        endDate: "2024-04-09",
        rate: 1600,
        quantity: 1
      },
      {
        id: "I-008",
        contractId: "C-89012",
        name: "Rafmagnsvél",
        serialNumber: "SN-55667",
        status: "Í leigu",
        location: "KOPA",
        imageUrl: "/placeholder.svg",
        startDate: "2023-04-10",
        endDate: "2024-04-09",
        rate: 1900,
        quantity: 1
      }
    ]
  },
  {
    id: "C-54321",
    contractNumber: "54321",
    customerName: "Pétur Jónsson",
    customerNumber: "7890123456",
    startDate: "2023-05-01",
    endDate: "2024-04-30",
    status: "On Rent",
    total: 55000,
    location: "KOPA",
    items: [
      {
        id: "I-009",
        contractId: "C-54321",
        name: "Steinsög",
        serialNumber: "SN-88990",
        status: "Í leigu",
        location: "GRAN",
        imageUrl: "/placeholder.svg",
        startDate: "2023-05-01",
        endDate: "2024-04-30",
        rate: 1700,
        quantity: 1
      },
      {
        id: "I-010",
        contractId: "C-54321",
        name: "Múrbrjótur",
        serialNumber: "SN-11223",
        status: "Í leigu",
        location: "VOGA",
        imageUrl: "/placeholder.svg",
        startDate: "2023-05-01",
        endDate: "2024-04-30",
        rate: 2100,
        quantity: 1
      }
    ]
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

// Mock function to update item status
export const updateItemStatusMock = async (itemId: string, newStatus: RentalItemStatus): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockContracts.forEach(contract => {
        contract.items.forEach(item => {
          if (item.id === itemId) {
            item.status = newStatus;
          }
        });
      });
      resolve();
    }, 200); // Simulate delay
  });
};

// Mock data for off-hired items
const mockOffHiredItems: RentalItem[] = [
  {
    id: "I-003",
    contractId: "C-12345",
    name: "Háþrýstidæla",
    serialNumber: "SN-24680",
    status: "Úr leiga", // Using a valid status from the enum
    location: "KOPA", // Using a valid location from the enum
    imageUrl: "/placeholder.svg",
    startDate: "2023-01-05",
    endDate: "2023-01-20",
    rate: 3500,
    quantity: 1
  },
  {
    id: "I-004",
    contractId: "C-67890",
    name: "Stigapallur",
    serialNumber: "SN-98765",
    status: "Úr leiga",
    location: "VOGA",
    imageUrl: "/placeholder.svg",
    startDate: "2023-02-20",
    endDate: "2023-03-10",
    rate: 1800,
    quantity: 1
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
