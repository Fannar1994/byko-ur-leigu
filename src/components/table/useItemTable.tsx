
import { useState, useEffect } from "react";
import { RentalItem } from "@/types/contract";
import { toast } from "sonner";
import { updateItemCount } from "@/services/contractService";

export function useItemTable(items: RentalItem[], onItemCountChange?: (itemId: string, count: number) => void) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [updatingCount, setUpdatingCount] = useState<string | null>(null);

  // Initialize counts from items
  useEffect(() => {
    const initialCounts: Record<string, number> = {};
    items.forEach(item => {
      initialCounts[item.id] = item.count || 1;
    });
    setItemCounts(initialCounts);
  }, [items]);

  const handleRowClick = (itemId: string) => {
    setSelectedRowId(prevId => prevId === itemId ? null : itemId);
  };

  const handleCountChange = async (itemId: string, newCount: number) => {
    if (updatingCount === itemId) return;

    // Update local state immediately for UI responsiveness
    setItemCounts(prev => ({
      ...prev,
      [itemId]: newCount
    }));

    // If there's a handler provided by parent, call it
    if (onItemCountChange) {
      onItemCountChange(itemId, newCount);
      return;
    }

    try {
      setUpdatingCount(itemId);
      const result = await updateItemCount(itemId, newCount);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        // Revert on failure
        setItemCounts(prev => ({
          ...prev,
          [itemId]: prev[itemId] || 1
        }));
        toast.error("Villa við að uppfæra talningu");
      }
    } catch (error) {
      toast.error("Villa kom upp", {
        description: error instanceof Error ? error.message : "Óþekkt villa"
      });
      
      // Revert on error
      setItemCounts(prev => ({
        ...prev,
        [itemId]: prev[itemId] || 1
      }));
    } finally {
      setUpdatingCount(null);
    }
  };

  return {
    selectedRowId,
    itemCounts,
    updatingCount,
    handleRowClick,
    handleCountChange
  };
}
