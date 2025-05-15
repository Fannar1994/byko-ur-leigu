
import React from "react";
import { MapPin } from "lucide-react";

interface ItemLocationProps {
  location?: string;
  isSelected: boolean;
}

const ItemLocation: React.FC<ItemLocationProps> = ({ location, isSelected }) => {
  return (
    <div className="flex items-center gap-1">
      <MapPin size={14} className={isSelected ? "text-black" : "text-gray-400"} />
      <span>{location || "Óþekktur staður"}</span>
    </div>
  );
};

export default ItemLocation;
