
export interface Renter {
  name: string;
  kennitala: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Virkur' | 'Lokið' | 'Tiltekt';
  startDate: string;
  endDate: string;
  totalValue: number;
  location?: string; // Add location field
}

export interface RentalItem {
  id: string;
  contractId: string;
  itemName: string;
  category: string;
  serialNumber: string;
  dueDate: string;
  rentalRate: number;
  status?: 'On Rent' | 'Off-Hired' | 'Pending Return' | 'Í leigu' | 'Tiltekt';
}

export interface SearchResults {
  renter: Renter;
  contracts: Contract[];
  rentalItems: RentalItem[];
}

export interface OffHireResponse {
  success: boolean;
  message: string;
  itemId: string;
}
