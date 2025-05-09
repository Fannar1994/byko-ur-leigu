
import { useState } from "react";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";

interface PickupHandlerProps {
  onItemStatusUpdate: (itemIds: string[], newStatus: string) => void;
  children: (props: {
    pickedItems: Record<string, boolean>;
    toggleItemPicked: (itemId: string) => void;
    handleCompletePickup: () => void;
  }) => React.ReactNode;
}

export function PickupHandler({ children, onItemStatusUpdate }: PickupHandlerProps) {
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});

  const toggleItemPicked = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCompletePickup = () => {
    const pickedItemIds = Object.entries(pickedItems)
      .filter(([_, isPicked]) => isPicked)
      .map(([id]) => id);
    
    if (pickedItemIds.length === 0) {
      toast.error("Engar vörur valdar", {
        description: "Þú verður að velja að minnsta kosti eina vöru til að staðfesta tiltekt.",
      });
      return;
    }
    
    toast.success("Tiltekt lokið", {
      description: `${pickedItemIds.length} vörur merktar sem tilbúnar til afhendingar.`,
    });
    
    onItemStatusUpdate(pickedItemIds, "Tilbúið til afhendingar");
    setPickedItems({});
  };

  return children({
    pickedItems,
    toggleItemPicked,
    handleCompletePickup
  });
}

export default PickupHandler;
