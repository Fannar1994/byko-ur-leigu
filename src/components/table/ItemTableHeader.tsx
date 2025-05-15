
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
    <TableHeader className="bg-[#2A2A2A]">
      <TableRow>
        <TableHead className="text-white">Leigunúmer</TableHead>
        <TableHead className="text-white">Vöruheiti</TableHead>
        {showContractColumn && (
          <TableHead className="text-white">Samningsnúmer</TableHead>
        )}
        {showDepartmentColumn && (
          <TableHead className="text-white">Deild</TableHead>
        )}
        {showLocationColumn && (
          <TableHead className="text-white">Verkstaður</TableHead>
        )}
        <TableHead className="text-white text-center">Taktu mynd</TableHead>
        {showCountColumn && (
          <TableHead className="text-white text-center">Talningar</TableHead>
        )}
        {showActions && (
          <TableHead className="text-white text-center">Aðgerðir</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default ItemTableHeader;
