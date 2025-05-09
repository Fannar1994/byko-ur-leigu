
import { useState } from "react";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";
import { offHireItem } from "@/services/api";
import OffHireDialog from "@/components/OffHireDialog";

interface OffHireHandlerProps {
  children: (props: {
    handleOffHireClick: (item: RentalItem) => void;
    processingItemId: string | null;
  }) => React.ReactNode;
  onItemStatusUpdate: (itemId: string, newStatus: string) => void;
}

export function OffHireHandler({ children, onItemStatusUpdate }: OffHireHandlerProps) {
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  const handleOffHireClick = (item: RentalItem) => {
    setSelectedItem(item);
    setOffHireDialogOpen(true);
  };

  const handleOffHireConfirm = async (itemId: string, noCharge: boolean) => {
    setOffHireDialogOpen(false);
    setProcessingItemId(itemId);
    
    try {
      const response = await offHireItem(itemId, noCharge);
      
      if (response.success) {
        onItemStatusUpdate(itemId, "Úr leiga");
        
        toast.success("Aðgerð tókst", {
          description: response.message,
        });
      } else {
        toast.error("Villa", {
          description: response.message || "Ekki tókst að skila vöru.",
        });
      }
    } catch (error) {
      let errorMessage = "Óþekkt villa kom upp.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Villa", {
        description: errorMessage,
      });
    } finally {
      setProcessingItemId(null);
    }
  };

  return (
    <>
      {children({
        handleOffHireClick,
        processingItemId
      })}
      
      <OffHireDialog
        isOpen={offHireDialogOpen}
        item={selectedItem}
        onClose={() => setOffHireDialogOpen(false)}
        onConfirm={handleOffHireConfirm}
      />
    </>
  );
}

export default OffHireHandler;
