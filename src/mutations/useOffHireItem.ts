
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { offHireItem } from "@/api/inspHireService";
import { OffHireResponse } from "@/types/contract";

export function useOffHireItem(contractId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, date, reason }: { itemId: string; date: string; reason?: string }) =>
      offHireItem(itemId, date, reason),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ["contract-items", contractId] });
      }
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      
      return data as OffHireResponse;
    }
  });
}
