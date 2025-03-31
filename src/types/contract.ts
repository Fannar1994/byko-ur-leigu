
export interface Renter {
  name: string;
  kennitala: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  totalValue: number;
}

export interface RentalItem {
  id: string;
  contractId: string;
  itemName: string;
  category: string;
  serialNumber: string;
  dueDate: string;
  rentalRate: number;
}

export interface SearchResults {
  renter: Renter;
  contracts: Contract[];
  rentalItems: RentalItem[];
}
