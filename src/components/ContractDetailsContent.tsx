
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Contract, RentalItem, Renter } from "@/types/contract";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ContractInfo from "@/components/ContractInfo";
import TabContent from "@/components/TabContent";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import PickableItemsSection from "@/components/PickableItemsSection";
import OffHireDialog from "@/components/OffHireDialog";
import { performOffHire } from "@/services/contractService";
import LoadingSpinner from "./LoadingSpinner";

interface ContractDetailsContentProps {
  loading: boolean;
  contract: Contract | null;
  renter: Renter | null;
  rentalItems: RentalItem[];
  onRentalItemsChange: (newItems: RentalItem[]) => void;
}

const ContractDetailsContent: React.FC<ContractDetailsContentProps> = ({
  loading,
  contract,
  renter,
  rentalItems,
  onRentalItemsChange
}) => {
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});
  const [offHireDialogOpen, setOffHireDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);

  const toggleItemPicked = (itemId: string) => {
    setPickedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleCompletePickup = () => {
    const pickedCount = Object.values(pickedItems).filter(Boolean).length;
    
    toast.success("Tiltekt lokið", {
      description: `${pickedCount} vörur merktar sem tilbúnar til afhendingar.`,
    });
    
    onRentalItemsChange(
      rentalItems.map(item => 
        pickedItems[item.id] 
          ? { ...item, status: "Tilbúið til afhendingar" } 
          : item
      )
    );
    
    setPickedItems({});
  };

  const handleOffHireClick = (item: RentalItem) => {
    setSelectedItem(item);
    setOffHireDialogOpen(true);
  };

  const handleOffHireConfirm = async (itemId: string, noCharge: boolean) => {
    setOffHireDialogOpen(false);
    setProcessingItemId(itemId);
    
    try {
      const response = await performOffHire(itemId, noCharge);
      
      if (response.success) {
        onRentalItemsChange(
          rentalItems.map(item => 
            item.id === itemId 
              ? { ...item, status: "Úr leiga" } 
              : item
          )
        );
        
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

  const activeItems = rentalItems.filter(item => 
    item.status === "Í leigu" || item.status === "On Rent"
  );
  
  const readyForPickItems = rentalItems.filter(item => 
    item.status !== "Tiltekt" && 
    item.status !== "Úr leiga" && 
    item.status !== "Off-Hired" &&
    item.status !== "Í leigu" &&
    item.status !== "On Rent" &&
    item.status !== "Tilbúið til afhendingar"
  );
  
  const tiltektItems = rentalItems.filter(item => 
    item.status === "Tiltekt" || item.status === "Tilbúið til afhendingar"
  );
  
  const offHiredItems = rentalItems.filter(item => 
    item.status === "Úr leiga" || item.status === "Off-Hired"
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!contract || !renter) {
    return (
      <div className="text-center py-12 text-white">
        <p>Samningur fannst ekki.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ContractInfo contract={contract} renter={renter} />

      <Tabs defaultValue="active" className="w-full">
        <RentalTabsNavigation />
        
        <TabsContent value="active">
          <TabContent 
            title="Vörur í leigu" 
            items={activeItems} 
            showContractColumn={false} 
          />
        </TabsContent>
        
        <TabsContent value="tiltekt">
          <PickableItemsSection
            readyForPickItems={readyForPickItems}
            tiltektItems={tiltektItems}
            pickedItems={pickedItems}
            toggleItemPicked={toggleItemPicked}
            handleCompletePickup={handleCompletePickup}
          />
        </TabsContent>
        
        <TabsContent value="offhired">
          <TabContent 
            title="Vörur úr leigu" 
            items={offHiredItems}
            showContractColumn={false}
            showActions={true}
            onOffHireClick={handleOffHireClick}
            processingItemId={processingItemId}
          />
        </TabsContent>
      </Tabs>

      <OffHireDialog
        isOpen={offHireDialogOpen}
        item={selectedItem}
        onClose={() => setOffHireDialogOpen(false)}
        onConfirm={handleOffHireConfirm}
      />
    </div>
  );
};

export default ContractDetailsContent;
