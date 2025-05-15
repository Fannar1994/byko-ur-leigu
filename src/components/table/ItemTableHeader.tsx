
import React from "react";
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

interface ItemTableHeaderProps {
  showContractColumn: boolean;
  showCountColumn: boolean;
  showLocationColumn: boolean;
  showDepartmentColumn: boolean;
  showActions: boolean;
}

const ItemTableHeader: React.FC<ItemTableHeaderProps> = ({
  showContractColumn,
  showCountColumn,
  showLocationColumn,
  showDepartmentColumn,
  showActions
}) => {
  return (
    <TableHeader className="bg-[#333333]">
      <TableRow>
        <TableHead className="text-white">Leigunúmer</TableHead>
        <TableHead className="text-white">Vöruheiti</TableHead>
        
        {showContractColumn && (
          <TableHead className="text-white">Samningur</TableHead>
        )}
        
        {showDepartmentColumn && (
          <TableHead className="text-white">Deild</TableHead>
        )}
        
        {showLocationColumn && (
          <TableHead className="text-white">Staðsetning</TableHead>
        )}
        
        {showCountColumn && (
          <TableHead className="text-center text-white">Talningar</TableHead>
        )}
        
        {/* Photo column header */}
        <TableHead className="text-center text-white">Mynd</TableHead>
        
        {/* Always show comment column */}
        <TableHead className="text-center text-white">Athugasemd</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ItemTableHeader;
