
export interface Renter {
  name: string;
  kennitala: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Virkur' | 'Lokið' | 'Tiltekt' | 'Úr leiga' | 'Í leigu';
  startDate: string;
  endDate: string;
  totalValue: number;
  location?: string;
}

export interface RentalItem {
  id: string;
  contractId: string;
  itemName: string;
  category: string;
  serialNumber: string;
  dueDate: string;
  rentalRate: number;
  status?: 'On Rent' | 'Off-Hired' | 'Pending Return' | 'Í leigu' | 'Tiltekt' | 'Úr leiga' | 'Tilbúið til afhendingar';
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

/**
 * Domain-specific error type for contract service errors
 */
export interface ContractServiceError {
  code: 'FETCH_ERROR' | 'OFFHIRE_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR';
  message: string;
  originalError?: Error;
}
