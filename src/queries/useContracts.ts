
import { useQuery } from "@tanstack/react-query";
import { fetchContracts } from "@/api/inspHireService";
import { Contract } from "@/types/contract";

export function useContracts() {
  return useQuery<Contract[]>({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1
  });
}
