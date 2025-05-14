
import React from 'react';
import { CustomTab } from "@/components/ui/custom-tabs";
import ItemTable from "@/components/ItemTable";
import { RentalItem } from '@/types/contract';

interface TabContentProps {
  title: string;
  items: RentalItem[];
  contractNumbers?: Record<string, string>;
  showActions?: boolean;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onTogglePicked?: (itemId: string) => void;
  pickedItems?: Record<string, boolean>;
  showContractColumn?: boolean;
  showCountColumn?: boolean;
  showLocationColumn?: boolean;
  showDepartmentColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusClick?: (item: RentalItem, count: number) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  title,
  items,
  contractNumbers,
  showActions = false,
  onOffHireClick,
  processingItemId,
  onTogglePicked,
  pickedItems,
  showContractColumn = true,
  showCountColumn = false,
  showLocationColumn = true,
  showDepartmentColumn = true,
  onCountChange,
  onStatusClick,
}) => {
  return (
    <CustomTab title={title}>
      <ItemTable 
        items={items} 
        contractNumbers={contractNumbers}
        showActions={showActions}
        onOffHireClick={onOffHireClick}
        processingItemId={processingItemId}
        onTogglePicked={onTogglePicked}
        pickedItems={pickedItems}
        showContractColumn={showContractColumn}
        showCountColumn={showCountColumn}
        showLocationColumn={showLocationColumn}
        showDepartmentColumn={showDepartmentColumn}
        onCountChange={onCountChange}
        onStatusClick={onStatusClick}
      />
    </CustomTab>
  );
};

export default TabContent;
