
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ItemTableHeaderProps {
  showContractColumn: boolean;
  showActions: boolean;
  onTogglePicked?: (itemId: string) => void;
  showProject: boolean;
}

const ItemTableHeader: React.FC<ItemTableHeaderProps> = ({
  showContractColumn,
  showActions,
  onTogglePicked,
  showProject
}) => {
  return (
    <TableHeader className="bg-[#2A2A2A]">
      <TableRow>
        <TableHead className="text-white">Leigunúmer</TableHead>
        <TableHead className="text-white">Vöruheiti</TableHead>
        {showContractColumn && (
          <TableHead className="text-white">Samningsnúmer</TableHead>
        )}
        <TableHead className="text-white">Skiladagsetning</TableHead>
        <TableHead className="text-white text-center">Staða</TableHead>
        {showProject && (
          <TableHead className="text-white">Verk</TableHead>
        )}
        <TableHead className="text-white text-center">Talningar</TableHead>
        {(showActions || onTogglePicked) && (
          <TableHead className="text-white text-center">Aðgerðir</TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
};

export default ItemTableHeader;
