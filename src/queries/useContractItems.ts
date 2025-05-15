
import { useQuery } from "@tanstack/react-query";
import { fetchContractItems } from "@/api/inspHireService";
import { RentalItem } from "@/types/contract";

export function useContractItems(contractId: string) {
  return useQuery<RentalItem[]>({
    queryKey: ["contract-items", contractId],
    queryFn: () => fetchContractItems(contractId),
    enabled: !!contractId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
}
