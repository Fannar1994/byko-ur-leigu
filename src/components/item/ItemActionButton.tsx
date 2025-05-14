
import React from "react";
import { UserX, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalItem } from "@/types/contract";

interface ItemActionButtonProps {
  item?: RentalItem;
  isPicked?: boolean;
  onTogglePicked?: (itemId: string) => void;
  onOffHireClick?: (item: RentalItem) => void;
  processingItemId?: string | null;
  actionType: "offHire" | "pick";
}

const ItemActionButton: React.FC<ItemActionButtonProps> = ({
  item,
  isPicked,
  onTogglePicked,
  onOffHireClick,
  processingItemId,
  actionType
}) => {
  if (!item) return null;

  if (actionType === "offHire" && onOffHireClick) {
    return (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onOffHireClick(item)}
        disabled={processingItemId === item.id}
        className="flex items-center gap-1"
      >
        <UserX size={14} />
        <span>Skila</span>
      </Button>
    );
  }

  if (actionType === "pick" && onTogglePicked) {
    return (
      <Button
        size="sm"
        variant={isPicked ? "default" : "outline"}
        onClick={() => onTogglePicked(item.id)}
        className="flex items-center gap-1"
      >
        <Package size={14} />
        <span>{isPicked ? "Tilbúið" : "Merkja"}</span>
      </Button>
    );
  }

  return null;
};

export default ItemActionButton;
