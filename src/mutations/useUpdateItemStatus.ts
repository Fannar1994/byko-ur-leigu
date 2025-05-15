
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateItemStatus } from "@/api/inspHireService";

export function useUpdateItemStatus(contractId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, status, memo }: { itemId: string; status: string; memo?: string }) =>
      updateItemStatus(itemId, status, memo),
    onSuccess: () => {
      // Invalidate relevant queries
      if (contractId) {
        queryClient.invalidateQueries({ queryKey: ["contract-items", contractId] });
      }
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    }
  });
}
