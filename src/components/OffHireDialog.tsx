
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
          <AlertDialogTitle>Off-Hire Item</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to off-hire <strong>{item.itemName}</strong> with serial number{" "}
            <strong>{item.serialNumber}</strong>. Do you want to proceed with no charge (N/C)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => onConfirm(item.id, false)}
          >
            Off-Hire with Charge
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => onConfirm(item.id, true)}
          >
            Off-Hire N/C
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OffHireDialog;
