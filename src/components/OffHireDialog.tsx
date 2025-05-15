
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
            onClick={() => onConfirm(item.id, false)}
          >
            Senda
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OffHireDialog;
