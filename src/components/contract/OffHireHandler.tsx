
import { useState } from "react";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";
import OffHireDialog from "@/components/OffHireDialog";
import { prepareReportData } from "@/services/reportService";
import { sendReport } from "@/services/microsoftService";

interface OffHireHandlerProps {
  children: (props: {
    handleOffHireClick: (item: RentalItem) => void;
    handleBatchOffHire: (items: RentalItem[]) => void;
    processingItemId: string | null;
    processedItems: string[];
    pickedItems: Record<string, boolean>;
    toggleItemPicked: (itemId: string) => void;
    anyItemsPicked: boolean;
  }) => React.ReactNode;
  onItemStatusUpdate: (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar") => void;
}

export function OffHireHandler({ children, onItemStatusUpdate }: OffHireHandlerProps) {
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const [processedItems, setProcessedItems] = useState<string[]>([]);
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});

  const toggleItemPicked = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const anyItemsPicked = Object.values(pickedItems).some(Boolean);

  const handleOffHireClick = (item: RentalItem) => {
    // Skip if the item has already been processed
    if (processedItems.includes(item.id)) {
      return;
    }
    
    setSelectedItem(item);
    setOffHireDialogOpen(true);
  };

  const handleBatchOffHire = async (items: RentalItem[]) => {
    if (items.length === 0) return;
    
    try {
      setProcessingItemId("batch"); // Using "batch" to indicate batch processing
      
      // Get list of picked items
      const selectedItems = items.filter(item => pickedItems[item.id]);
      if (selectedItems.length === 0) {
        toast.error("Engar vörur valdar", {
          description: "Þú verður að velja vörur til að skila.",
        });
        return;
      }
      
      // Get the contract ID from the first item (they should all share the same contract)
      const contractId = selectedItems[0].contractId;
      
      // Generate and send a batch report for all the items
      const { htmlReport, excelBuffer, fileName } = await prepareReportData(
        selectedItems, 
        contractId, 
        'offhire'
      );
      
      const success = await sendReport(
        selectedItems,
        contractId,
        'offhire',
        excelBuffer,
        fileName,
        htmlReport
      );
      
      if (success) {
        // Update the local state for all processed items
        selectedItems.forEach(item => {
          onItemStatusUpdate(item.id, "Úr leiga");
          // Add the item to processed items
          setProcessedItems(prev => [...prev, item.id]);
        });
        
        // Reset picked items
        setPickedItems({});
        
        toast.success("Skýrsla send", {
          description: `${selectedItems.length} vörur merktar úr leigu og skýrsla send.`
        });
      } else {
        toast.error("Villa", {
          description: "Ekki tókst að senda skýrslu. Reyndu aftur eða hafðu samband við kerfisstjóra.",
        });
      }
    } catch (error) {
      console.error("Error in batch off-hire process:", error);
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

  const handleOffHireConfirm = async (itemId: string, noCharge: boolean) => {
    setOffHireDialogOpen(false);
    setProcessingItemId(itemId);
    
    try {
      // Generate and send a report for the off-hire operation
      if (selectedItem) {
        const contractId = selectedItem.contractId;
        const items = [selectedItem]; // We're off-hiring just one item
        
        const { htmlReport, excelBuffer, fileName } = await prepareReportData(
          items, 
          contractId, 
          'offhire'
        );
        
        const success = await sendReport(
          items,
          contractId,
          'offhire',
          excelBuffer,
          fileName,
          htmlReport
        );
        
        if (success) {
          // Update the local state to show the item as off-hired
          onItemStatusUpdate(itemId, "Úr leiga");
          
          // Add the item to processed items so it won't appear in the UI
          setProcessedItems(prev => [...prev, itemId]);
          
          toast.success("Skýrsla send", {
            description: "Úr leigu skýrsla var send."
          });
        } else {
          toast.error("Villa", {
            description: "Ekki tókst að senda skýrslu. Reyndu aftur eða hafðu samband við kerfisstjóra.",
          });
        }
      }
    } catch (error) {
      console.error("Error in off-hire process:", error);
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
        handleBatchOffHire,
        processingItemId,
        processedItems,
        pickedItems,
        toggleItemPicked,
        anyItemsPicked
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
