// This should match what your API returns
interface Contract {
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

export async function fetchContracts(): Promise<Contract[]> {
  const response = await fetch(`${baseUrl}/api/contracts`, {
    headers: defaultHeaders()
  });
  if (!response.ok) throw new Error("Failed to fetch contracts");
  return response.json();
}
