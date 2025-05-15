
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";
import { getDepartmentBadgeColor } from "@/utils/itemStatusUtils";

interface ItemDepartmentProps {
  department?: string;
  isSelected: boolean;
}

const ItemDepartment: React.FC<ItemDepartmentProps> = ({ department, isSelected }) => {
  return (
    <div className="flex items-center gap-1">
      <Building size={14} className={isSelected ? "text-black" : "text-gray-400"} />
      {department ? (
        <Badge className={getDepartmentBadgeColor(department)}>
          {department}
        </Badge>
      ) : (
        <span className="text-gray-400">-</span>
      )}
    </div>
  );
};

export default ItemDepartment;
