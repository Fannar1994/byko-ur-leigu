
import { useState } from "react";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";
import OffHireDialog from "@/components/OffHireDialog";
import { prepareReportData } from "@/services/reportService";
import { sendReport } from "@/services/microsoftService";

interface OffHireHandlerProps {
  children: (props: {
    handleOffHireClick: (item: RentalItem) => void;
    processingItemId: string | null;
  }) => React.ReactNode;
  onItemStatusUpdate: (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar") => void;
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
          
          toast.success("Skýrsla send", {
            description: `Úr leigu skýrsla var send á ${noCharge ? 'án gjalds' : 'með gjaldi'}.`,
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
