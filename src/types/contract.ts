
export interface Renter {
  name: string;
  kennitala: string;
  address?: string;
  city?: string;
  postalCode?: string;
  contactPerson?: string;
  phone?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  status: 'Active' | 'Completed' | 'Cancelled' | 'Virkur' | 'Lokið' | 'Tiltekt' | 'Úr leiga' | 'Í leigu';
  startDate: string;
  endDate: string;
  totalValue: number;
  location?: string;
  department?: 'KOPA' | 'ÞORH' | 'GRAN' | 'KEFL' | 'SELF' | 'AKEY' | 'VER';
}

export interface RentalItem {
  id: string;
  contractId: string;
  itemName: string;
  category: string;
  serialNumber: string;
  dueDate: string;
  rentalRate: number;
  status?: 'On Rent' | 'Off-Hired' | 'Pending Return' | 'Í leigu' | 'Tiltekt' | 'Úr leiga' | 'Tilbúið til afhendingar' | 'Vara afhent';
  location?: string;
  department?: 'KOPA' | 'ÞORH' | 'GRAN' | 'KEFL' | 'SELF' | 'AKEY' | 'VER';
}

export interface SearchResults {
  success: boolean;
  message: string;
  itemId: string;
}

export interface OffHireResponse {
  success: boolean;
  message: string;
  itemId: string;
}
