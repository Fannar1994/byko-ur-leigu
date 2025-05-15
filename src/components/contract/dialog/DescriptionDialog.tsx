
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RentalItem } from "@/types/contract";

interface DescriptionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentItem: RentalItem | null;
  description: string;
  setDescription: (description: string) => void;
  onSave: () => void;
}

const DescriptionDialog: React.FC<DescriptionDialogProps> = ({
  isOpen,
  onOpenChange,
  currentItem,
  description,
  setDescription,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Athugasemd um vöru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {currentItem && (
            <div className="space-y-2">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="item-name">Vara</Label>
                <Input id="item-name" value={`${currentItem.itemName} (${currentItem.serialNumber})`} readOnly />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="item-description">Athugasemd</Label>
                <Textarea
                  id="item-description"
                  placeholder="Skrifaðu athugasemd hér..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hætta við
          </Button>
          <Button type="button" onClick={onSave}>
            Vista athugasemd
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DescriptionDialog;
