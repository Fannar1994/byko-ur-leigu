
import { useQuery } from "@tanstack/react-query";
import { fetchContracts } from "@/api/inspHireService";
import { Contract } from "@/types/contract";

export function useContractHistory(customerId: string) {
  return useQuery<Contract[]>({
    queryKey: ["contract-history", customerId],
    queryFn: async () => {
      const allContracts = await fetchContracts();
      // Filter contracts by customerId
      return allContracts.filter((c: any) => c.Customer?.CustomerId === customerId);
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
}
