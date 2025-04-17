
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
import { performOffHire, filterActiveItems, filterTiltektItems, filterOffHiredItems } from "@/services/contractService";
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
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  // Initialize counts
  React.useEffect(() => {
    const initialCounts: Record<string, number> = {};
    rentalItems.forEach(item => {
      initialCounts[item.id] = item.count || 1;
    });
    setItemCounts(initialCounts);
  }, [rentalItems]);

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
    
    // Update rental items with new status and counts
    onRentalItemsChange(
      rentalItems.map(item => {
        if (pickedItems[item.id]) {
          return { 
            ...item, 
            status: "Tilbúið til afhendingar",
            count: itemCounts[item.id] || 1
          };
        }
        return item;
      })
    );
    
    setPickedItems({});
    
    // Send notification (simulated)
    toast.info("Tilkynning send", {
      description: "Söluaðili hefur verið látinn vita að vörur séu tilbúnar.",
    });
  };

  const handleOffHireClick = (item: RentalItem) => {
    setSelectedItem({
      ...item,
      count: itemCounts[item.id] || 1
    });
    setOffHireDialogOpen(true);
  };

  const handleOffHireConfirm = async (itemId: string, noCharge: boolean) => {
    setOffHireDialogOpen(false);
    setProcessingItemId(itemId);
    
    try {
      const count = itemCounts[itemId] || 1;
      const response = await performOffHire(itemId, noCharge);
      
      if (response.success) {
        // Update the item status and its count
        onRentalItemsChange(
          rentalItems.map(item => 
            item.id === itemId 
              ? { ...item, status: "Úr leiga", count } 
              : item
          )
        );
        
        toast.success("Aðgerð tókst", {
          description: `${count} ${count > 1 ? 'einingar' : 'eining'} ${response.message}`,
        });
        
        // Send notification (simulated)
        toast.info("Tilkynning send", {
          description: "Leiguhugbúnaður hefur verið uppfærður með nýjum talningum.",
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

  const handleItemCountChange = (itemId: string, count: number) => {
    setItemCounts(prev => ({
      ...prev,
      [itemId]: count
    }));
    
    // Optional: Update the count in the rentalItems array if needed
    // This can be useful if you want to persist the count when changing tabs
    onRentalItemsChange(
      rentalItems.map(item => 
        item.id === itemId 
          ? { ...item, count } 
          : item
      )
    );
  };

  // Use our filter functions from contractService
  const activeItems = filterActiveItems(rentalItems);
  const tiltektItems = filterTiltektItems(rentalItems);
  const offHireReadyItems = filterActiveItems(rentalItems); // Show only "Í leigu" items in Úr Leiga tab

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
            showProject={true}
            onItemCountChange={handleItemCountChange}
          />
        </TabsContent>
        
        <TabsContent value="tiltekt">
          <PickableItemsSection
            readyForPickItems={filterActiveItems(rentalItems).filter(i => !tiltektItems.some(t => t.id === i.id))}
            tiltektItems={tiltektItems}
            pickedItems={pickedItems}
            toggleItemPicked={toggleItemPicked}
            handleCompletePickup={handleCompletePickup}
            onItemCountChange={handleItemCountChange}
          />
        </TabsContent>
        
        <TabsContent value="offhired">
          <TabContent 
            title="Vörur úr leigu" 
            items={offHireReadyItems}
            showContractColumn={false}
            showActions={true}
            onOffHireClick={handleOffHireClick}
            processingItemId={processingItemId}
            onItemCountChange={handleItemCountChange}
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
