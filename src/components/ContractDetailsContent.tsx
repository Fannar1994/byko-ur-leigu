
import React from "react";
import { Contract, RentalItem, Renter } from "@/types/contract";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ContractInfo from "@/components/ContractInfo";
import TabContent from "@/components/TabContent";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import PickableItemsSection from "@/components/PickableItemsSection";
import OffHireDialog from "@/components/OffHireDialog";
import { filterActiveItems, filterTiltektItems } from "@/services/contractService";
import LoadingSpinner from "./LoadingSpinner";
import { useOffHireHandler } from "./contract-details/useOffHireHandler";
import { useItemCounts } from "./contract-details/useItemCounts";
import { useTiltektHandler } from "./contract-details/useTiltektHandler";

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
  // Use our custom hooks to manage state and handlers
  const { 
    itemCounts, 
    handleItemCountChange 
  } = useItemCounts(rentalItems);

  // Use the offhire handler
  const {
    offHireDialogOpen,
    selectedItem,
    processingItemId,
    handleOffHireClick,
    handleOffHireConfirm,
    setOffHireDialogOpen
  } = useOffHireHandler(rentalItems, onRentalItemsChange);

  // Create a wrapper for handling item count changes from our components
  const handleCountChange = (itemId: string, count: number) => {
    handleItemCountChange(itemId, count);
    
    // Update the rentalItems array with the new count
    onRentalItemsChange(
      rentalItems.map(item => 
        item.id === itemId 
          ? { ...item, count } 
          : item
      )
    );
  };

  // Use the tiltekt handler
  const {
    pickedItems,
    toggleItemPicked,
    handleCompletePickup
  } = useTiltektHandler(rentalItems, onRentalItemsChange, itemCounts);

  // Use our filter functions from contractService
  const activeItems = filterActiveItems(rentalItems);
  const tiltektItems = filterTiltektItems(rentalItems);

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
            onItemCountChange={handleCountChange}
            onOffHireClick={handleOffHireClick}
            processingItemId={processingItemId}
            showActions={true}
          />
        </TabsContent>
        
        <TabsContent value="tiltekt">
          <PickableItemsSection
            readyForPickItems={filterActiveItems(rentalItems).filter(i => !tiltektItems.some(t => t.id === i.id))}
            tiltektItems={tiltektItems}
            pickedItems={pickedItems}
            toggleItemPicked={toggleItemPicked}
            handleCompletePickup={handleCompletePickup}
            onItemCountChange={handleCountChange}
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
