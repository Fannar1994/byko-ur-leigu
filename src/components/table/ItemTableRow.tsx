
import React from "react";
import { MapPin, Building, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import { Link } from "react-router-dom";
import CountComponent from "../CountComponent";
import { RentalItem } from "@/types/contract";
import { getItemStatusColor, getDepartmentBadgeColor } from "@/utils/itemStatusUtils";
import ItemActionButton from "../item/ItemActionButton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ItemTableRowProps {
  item: RentalItem;
  isSelected: boolean;
  isPicked: boolean;
  contractNumber?: string;
  onTogglePicked?: (itemId: string) => void;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusClick?: (item: RentalItem, count: number) => void;
  itemCounts: Record<string, number>;
  showContractColumn: boolean;
  showCountColumn: boolean;
  showLocationColumn: boolean;
  showDepartmentColumn: boolean;
  showActions: boolean;
  onRowClick: () => void;
}

const ItemTableRow: React.FC<ItemTableRowProps> = ({
  item,
  isSelected,
  isPicked,
  contractNumber,
  onTogglePicked,
  onOffHireClick,
  processingItemId,
  onCountChange,
  onStatusClick,
  itemCounts,
  showContractColumn,
  showCountColumn,
  showLocationColumn,
  showDepartmentColumn,
  showActions,
  onRowClick
}) => {
  const handleCountChange = (count: number) => {
    if (onCountChange) {
      onCountChange(item.id, count);
    }
  };

  // Handle photo button click - FIX: Properly stopping propagation and NOT triggering status update
  const handlePhotoButtonClick = (e: React.MouseEvent) => {
    // Ensure we prevent the default behavior and stop event propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Check if the item status is Tiltekt
    if (item.status === "Tiltekt" || item.id.includes("mock-tiltekt")) {
      const count = itemCounts[item.id] || 0;
      
      if (count > 0) {
        toast.success("Mynd", {
          description: "Aðgerð til að bæta við mynd í skýrsluna verður virk fljótlega.",
        });
        
        // Important: Removed the onStatusClick call here
        // This was causing the item to be marked as delivered/picked
        // when clicking the camera button
      } else {
        toast.error("Villa", {
          description: "Þú verður að setja inn talningar áður en þú bætir við mynd.",
        });
      }
    }
  };

  // Check if this is a Tiltekt item
  const isTiltektItem = item.status === "Tiltekt" || item.id.includes("mock-tiltekt");
  
  return (
    <TableRow 
      onClick={onRowClick}
      className={isSelected 
        ? "bg-primary text-black hover:bg-primary/90 cursor-pointer" 
        : isPicked 
          ? "bg-green-900/20 hover:bg-green-900/30 cursor-pointer"
          : "hover:bg-primary/90 hover:text-black cursor-pointer"}
    >
      <TableCell className={isSelected ? "text-black" : "text-white"}>
        {item.serialNumber}
      </TableCell>
      <TableCell className={isSelected ? "font-medium text-black" : "font-medium text-white"}>
        {item.itemName}
      </TableCell>
      
      {showContractColumn && (
        <TableCell className={isSelected ? "text-black" : "text-white"}>
          {contractNumber ? (
            <Link 
              to={`/contract/${contractNumber}`}
              className={isSelected ? "text-black hover:underline" : "text-primary hover:underline"}
              onClick={(e) => e.stopPropagation()}
            >
              {contractNumber}
            </Link>
          ) : (
            <span>-</span>
          )}
        </TableCell>
      )}
      
      {showDepartmentColumn && (
        <TableCell className={isSelected ? "text-black" : "text-white"}>
          <div className="flex items-center gap-1">
            <Building size={14} className={isSelected ? "text-black" : "text-gray-400"} />
            {item.department ? (
              <Badge className={getDepartmentBadgeColor(item.department)}>
                {item.department}
              </Badge>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </TableCell>
      )}
      
      {showLocationColumn && (
        <TableCell className={isSelected ? "text-black" : "text-white"}>
          <div className="flex items-center gap-1">
            <MapPin size={14} className={isSelected ? "text-black" : "text-gray-400"} />
            <span>{item.location || "Óþekktur staður"}</span>
          </div>
        </TableCell>
      )}
      
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center gap-2">
          {/* Only show status badge if it's NOT a Tiltekt item */}
          {!isTiltektItem && (
            <Badge className={getItemStatusColor(item.status)}>
              {item.status}
            </Badge>
          )}
          
          {/* Show camera button if it IS a Tiltekt item */}
          {isTiltektItem && (
            <Button 
              variant="outline" 
              size="sm"
              className="p-1 h-7 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handlePhotoButtonClick}
              title="Bæta við mynd í skýrslu"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
      
      {showCountColumn && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <CountComponent 
            itemId={item.id}
            onCountChange={handleCountChange}
            count={itemCounts[item.id]}
          />
        </TableCell>
      )}
      
      {showActions && onOffHireClick && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <ItemActionButton 
            item={item}
            onOffHireClick={onOffHireClick}
            processingItemId={processingItemId}
            actionType="offHire"
          />
        </TableCell>
      )}
      
      {onTogglePicked && (
        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
          <ItemActionButton 
            item={item}
            isPicked={isPicked}
            onTogglePicked={onTogglePicked}
            actionType="pick"
          />
        </TableCell>
      )}
    </TableRow>
  );
};

export default ItemTableRow;
