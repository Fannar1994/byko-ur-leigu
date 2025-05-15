
import React from "react";
import { Badge } from "@/components/ui/badge";
import { getItemStatusColor } from "@/utils/itemStatusUtils";

interface ItemStatusBadgeProps {
  status: string;
  isSelected: boolean;
}

const ItemStatusBadge: React.FC<ItemStatusBadgeProps> = ({ status }) => {
  return (
    <Badge className={getItemStatusColor(status)}>
      {status}
    </Badge>
  );
};

export default ItemStatusBadge;
