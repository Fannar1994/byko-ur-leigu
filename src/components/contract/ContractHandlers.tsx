
import React from "react";
import { RentalItem } from "@/types/contract";
import { OffHireHandler } from "@/components/contract/OffHireHandler";
import { PickupHandler } from "@/components/contract/PickupHandler";
import ContractTabs from "@/components/contract/ContractTabs";

interface ContractHandlersProps {
  contractId: string;
  localRentalItems: RentalItem[];
  activeItems: RentalItem[];
  readyForPickItems: RentalItem[];
  tiltektItems: RentalItem[];
  offHiredItems: RentalItem[];
  handleItemStatusUpdate: (itemId: string | string[], newStatus: string) => void;
  handleItemStatusUpdateWithCount: (itemId: string, newStatus: string, count: number) => void;
  handleCountChange: (itemId: string, count: number) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
}

const ContractHandlers: React.FC<ContractHandlersProps> = ({
  contractId,
  activeItems,
  readyForPickItems,
  tiltektItems,
  offHiredItems,
  handleItemStatusUpdate,
  handleItemStatusUpdateWithCount,
  handleCountChange,
  sortField,
  sortDirection,
  handleSort,
}) => {
  return (
    <OffHireHandler onItemStatusUpdate={handleItemStatusUpdate}>
      {({ 
        handleOffHireClick, 
        handleBatchOffHire, 
        processingItemId, 
        processedItems, 
        pickedItems: offHirePickedItems, 
        toggleItemPicked: toggleOffHireItemPicked, 
        anyItemsPicked: anyOffHireItemsPicked 
      }) => (
        <PickupHandler 
          contractId={contractId} 
          onItemStatusUpdate={handleItemStatusUpdate}
        >
          {({ pickedItems, toggleItemPicked, handleCompletePickup, isTiltektCompleted }) => (
            <div className="w-full">
              <ContractTabs 
                contracts={[]} // This prop is only used for reference, not functionality
                activeItems={activeItems}
                readyForPickItems={readyForPickItems}
                tiltektItems={tiltektItems}
                offHiredItems={offHiredItems}
                pickedItems={pickedItems}
                processingItemId={processingItemId}
                processedItems={processedItems}
                sortField={sortField}
                sortDirection={sortDirection}
                onTogglePicked={toggleItemPicked}
                onCompletePickup={handleCompletePickup}
                onOffHireClick={handleOffHireClick}
                onBatchOffHire={handleBatchOffHire}
                handleSort={handleSort}
                onCountChange={handleCountChange}
                onItemStatusUpdate={handleItemStatusUpdateWithCount}
                isTiltektCompleted={isTiltektCompleted}
                offHirePickedItems={offHirePickedItems}
                onToggleOffHirePicked={toggleOffHireItemPicked}
                anyOffHireItemsPicked={anyOffHireItemsPicked}
              />
            </div>
          )}
        </PickupHandler>
      )}
    </OffHireHandler>
  );
};

export default ContractHandlers;
