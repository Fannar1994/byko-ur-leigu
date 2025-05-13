// Define the Contract type to match inspHire's response structure
export interface Contract {
  ContractId: string;
  ContractNumber: string;
  Status: string;
  StartDate: string;
  EndDate: string;
  TotalValue: number;
  Location: string;
  Customer: {
    Kennitala: string;
    Name: string;
  };
}

// Get API base URL from environment (.env.local)
const baseUrl = import.meta.env.VITE_INSPHIRE_API;

// Get session ID from localStorage
function getSessionId(): string {
  const session = localStorage.getItem("inspSession");
  if (!session) throw new Error("No inspHire session found. Please log in.");
  return session;
}

// Build default headers with session
function defaultHeaders(): HeadersInit {
  return {
    "EnableString": "BYKO",
    "SessionID": getSessionId(),
    "Content-Type": "application/json"
  };
}

// Fetch contracts from the inspHire API
export async function fetchContracts(): Promise<Contract[]> {
  const response = await fetch(`${baseUrl}/api/contracts`, {
    headers: defaultHeaders()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch contracts: ${errorText}`);
  }

  return response.json();
}
