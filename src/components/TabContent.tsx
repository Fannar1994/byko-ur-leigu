
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default TabContent;
