
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RentalItem } from "@/types/contract";

interface OffHireDialogProps {
  isOpen: boolean;
  item: RentalItem | null;
  onClose: () => void;
  onConfirm: (itemId: string, noCharge: boolean) => void;
}

const OffHireDialog: React.FC<OffHireDialogProps> = ({
  isOpen,
  item,
  onClose,
  onConfirm,
}) => {
  if (!item) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Senda Úr Leigu Skýrslu</AlertDialogTitle>
          <AlertDialogDescription>
            Þú ert að fara að senda skýrslu fyrir <strong>{item.itemName}</strong> með raðnúmer{" "}
            <strong>{item.serialNumber}</strong>. Skýrslan verður send á leiga@byko.is. Viltu halda áfram?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Hætta við</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => onConfirm(item.id, false)}
          >
            Skila með gjaldi
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => onConfirm(item.id, true)}
          >
            Skila án gjalds
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OffHireDialog;
