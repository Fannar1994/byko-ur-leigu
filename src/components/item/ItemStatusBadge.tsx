
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getItemStatusColor } from "@/utils/itemStatusUtils";

interface ItemStatusBadgeProps {
  status: string;
  isSelected?: boolean;
}

const ItemStatusBadge: React.FC<ItemStatusBadgeProps> = ({ status, isSelected = false }) => {
  const badgeClass = isSelected ? 
    "bg-green-700 text-white hover:bg-green-800" : 
    getItemStatusColor(status);

  return (
    <Badge className={badgeClass}>
      {status}
    </Badge>
  );
};

export default ItemStatusBadge;
