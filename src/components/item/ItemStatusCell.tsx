
import React from "react";
import { TableCell } from "@/components/ui/table";
import ItemStatusBadge from "./ItemStatusBadge";
import PhotoButton from "./PhotoButton";

interface ItemStatusCellProps {
  status: string;
  isTiltektItem: boolean;
  isSelected: boolean;
}

const ItemStatusCell: React.FC<ItemStatusCellProps> = ({ 
  status, 
  isTiltektItem, 
  isSelected 
}) => {
  return (
    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-center gap-2">
        {/* Show status badge for non-Tiltekt items */}
        {!isTiltektItem && (
          <ItemStatusBadge status={status} isSelected={isSelected} />
        )}
        
        {/* Show camera button for ALL items */}
        <PhotoButton />
      </div>
    </TableCell>
  );
};

export default ItemStatusCell;
