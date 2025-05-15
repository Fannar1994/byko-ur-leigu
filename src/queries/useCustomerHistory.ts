
import { useQuery } from "@tanstack/react-query";
import { fetchContracts } from "@/api/inspHireService";
import { Contract } from "@/types/contract";

export function useCustomerHistory(kennitala: string) {
  return useQuery<Contract[]>({
    queryKey: ["customer-history", kennitala],
    queryFn: async () => {
      const allContracts = await fetchContracts();
      // Filter contracts by customer kennitala
      return allContracts.filter((contract: any) => 
        contract.Customer?.Kennitala?.replace("-", "") === kennitala.replace("-", "")
      );
    },
    enabled: !!kennitala,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
}
