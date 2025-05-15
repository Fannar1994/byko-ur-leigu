
import React from "react";
import { FileText } from "lucide-react";
import { RentalItem } from "@/types/contract";

interface ItemDescription {
  id: string;
  text: string;
}

interface ItemDescriptionsListProps {
  itemDescriptions: ItemDescription[];
  displayedItems: RentalItem[];
  onEditDescription: (item: RentalItem) => void;
}

const ItemDescriptionsList: React.FC<ItemDescriptionsListProps> = ({
  itemDescriptions,
  displayedItems,
  onEditDescription,
}) => {
  // Filter out descriptions that don't have text or aren't for displayed items
  const visibleDescriptions = itemDescriptions.filter(
    (d) => displayedItems.some((item) => item.id === d.id) && d.text.trim() !== ""
  );

  if (visibleDescriptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border border-gray-700 rounded-md p-4">
      <h4 className="text-white font-medium mb-3">Athugasemdir um vörur</h4>
      <div className="space-y-3">
        {visibleDescriptions.map((d) => {
          const item = displayedItems.find((item) => item.id === d.id);
          return item ? (
            <div key={d.id} className="bg-gray-800/50 p-3 rounded-md">
              <div className="font-medium text-white mb-1">
                {item.itemName} ({item.serialNumber})
              </div>
              <div className="text-gray-300 text-sm whitespace-pre-wrap">{d.text}</div>
              <button
                className="text-xs text-blue-400 mt-2 hover:underline flex items-center"
                onClick={() => onEditDescription(item)}
              >
                <FileText className="h-3 w-3 mr-1" /> Breyta athugasemd
              </button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default ItemDescriptionsList;
