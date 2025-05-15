
import React from "react";
import ItemTableContainer from "./table";
import { RentalItem } from "@/types/contract";

interface ItemTableProps {
  items: RentalItem[];
  contractNumbers?: Record<string, string>;
  showActions?: boolean;
  showContractColumn?: boolean;
  showCountColumn?: boolean;
  showLocationColumn?: boolean;
  showDepartmentColumn?: boolean;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onTogglePicked?: (itemId: string) => void;
  pickedItems?: Record<string, boolean>;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusClick?: (item: RentalItem, count: number) => void;
}

// This is an adapter component that maintains backward compatibility
// It forwards all props to the new ItemTableContainer component
const ItemTable: React.FC<ItemTableProps> = (props) => {
  return <ItemTableContainer {...props} />;
};

export default ItemTable;
