
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";
import { prepareReportData } from "@/services/reportService";
import { sendReport } from "@/services/microsoftService";
import { hasTiltektBeenCompleted, markTiltektAsCompleted } from "@/utils/contractStatusUtils";

interface PickupHandlerProps {
  contractId: string;
  onItemStatusUpdate: (itemIds: string[], newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar") => void;
  children: (props: {
    pickedItems: Record<string, boolean>;
    toggleItemPicked: (itemId: string) => void;
    handleCompletePickup: () => void;
    isTiltektCompleted: boolean;
  }) => React.ReactNode;
}

export function PickupHandler({ children, onItemStatusUpdate, contractId }: PickupHandlerProps) {
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTiltektCompleted, setIsTiltektCompleted] = useState(false);
  
  // Check if tiltekt has already been completed for this contract
  useEffect(() => {
    if (contractId) {
      const completed = hasTiltektBeenCompleted(contractId);
      setIsTiltektCompleted(completed);
      
      if (completed) {
        // Clear picked items when tiltekt is already completed
        setPickedItems({});
      }
    }
  }, [contractId]);

  const toggleItemPicked = (itemId: string) => {
    if (isTiltektCompleted) {
      toast.error("Tiltekt lokið", {
        description: "Tiltekt hefur þegar verið lokið fyrir þennan samning.",
      });
      return;
    }
    
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCompletePickup = async () => {
    if (isTiltektCompleted) {
      toast.error("Tiltekt lokið", {
        description: "Tiltekt hefur þegar verið lokið fyrir þennan samning.",
      });
      return;
    }
    
    const pickedItemIds = Object.entries(pickedItems)
      .filter(([_, isPicked]) => isPicked)
      .map(([id]) => id);
    
    if (pickedItemIds.length === 0) {
      toast.error("Engar vörur valdar", {
        description: "Þú verður að velja að minnsta kosti eina vöru til að staðfesta tiltekt.",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get the items that were picked
      const items = pickedItemIds.map(id => {
        // This is a placeholder - in a real implementation, you would get the actual item data
        // We're assuming all picked items are from the same contract for simplicity
        const item = { id } as RentalItem;
        return item;
      });
      
      // Generate the report data
      const { htmlReport, excelBuffer, fileName } = await prepareReportData(
        items, 
        contractId, 
        'tiltekt', 
        itemCounts
      );
      
      // Send the report
      const success = await sendReport(
        items,
        contractId,
        'tiltekt',
        excelBuffer,
        fileName,
        htmlReport
      );
      
      if (success) {
        // Update the local state to show the items as ready for pickup
        onItemStatusUpdate(pickedItemIds, "Tilbúið til afhendingar");
        
        // Clear the picked items
        setPickedItems({});
        
        // Mark tiltekt as completed for this contract
        markTiltektAsCompleted(contractId);
        setIsTiltektCompleted(true);
        
        toast.success("Tiltekt lokið", {
          description: `${pickedItemIds.length} vörur merktar sem tilbúnar til afhendingar og skýrsla send.`,
        });
      } else {
        toast.error("Villa", {
          description: "Ekki tókst að senda skýrslu. Reyndu aftur eða hafðu samband við kerfisstjóra.",
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
      setIsProcessing(false);
    }
  };

  return children({
    pickedItems,
    toggleItemPicked,
    handleCompletePickup,
    isTiltektCompleted
  });
}

export default PickupHandler;
