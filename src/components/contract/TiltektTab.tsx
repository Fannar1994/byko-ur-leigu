
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, NoteText } from "lucide-react";
import ItemTable from "../ItemTable";
import { RentalItem } from "@/types/contract";
import { toast } from "sonner";
import { getItemCount } from "@/utils/countUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TiltektTabProps {
  readyForPickItems: RentalItem[];
  tiltektItems: RentalItem[];
  pickedItems: Record<string, boolean>;
  onTogglePicked: (itemId: string) => void;
  onCompletePickup: () => void;
  showCountColumn?: boolean;
  onCountChange?: (itemId: string, count: number) => void;
  onStatusUpdate?: (item: RentalItem, count: number) => void;
  isTiltektCompleted?: boolean;
}

interface ItemDescription {
  id: string;
  text: string;
}

const TiltektTab: React.FC<TiltektTabProps> = ({ 
  readyForPickItems, 
  tiltektItems, 
  pickedItems, 
  onTogglePicked,
  onCompletePickup,
  showCountColumn = true,
  onCountChange,
  onStatusUpdate,
  isTiltektCompleted = false
}) => {
  const hasPickedItems = Object.values(pickedItems).some(Boolean);
  
  // Keep track of item counts to know which ones to update
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});
  
  // Track items that have been marked as delivered (to remove them from the display)
  const [deliveredItems, setDeliveredItems] = useState<string[]>([]);
  
  // State for description dialog
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RentalItem | null>(null);
  const [description, setDescription] = useState("");
  const [itemDescriptions, setItemDescriptions] = useState<ItemDescription[]>([]);
  
  // Filter out delivered items from display
  const displayedTiltektItems = tiltektItems.filter(item => !deliveredItems.includes(item.id));
  
  // Get description for an item
  const getItemDescription = (itemId: string): string => {
    const desc = itemDescriptions.find(d => d.id === itemId);
    return desc ? desc.text : "";
  };
  
  const handleStatusClick = (item: RentalItem, count: number) => {
    if (count <= 0) {
      toast.error("Villa", {
        description: "Þú verður að setja inn talningar áður en þú setur vöruna í leigu.",
      });
      return;
    }
    
    if (onStatusUpdate) {
      console.log(`TiltektTab: Calling onStatusUpdate for item ${item.id} with count ${count}`);
      onStatusUpdate(item, count);
      
      // Add the item to the delivered items list (to remove from display)
      setDeliveredItems(prev => [...prev, item.id]);
      
      // Show a more prominent toast notification
      toast.success("Vara uppfærð í 'Tilbúið til afhendingar'", {
        description: `${item.itemName} (${item.serialNumber}) hefur verið merkt sem tilbúin til afhendingar og skýrsla send.`,
        duration: 5000,
      });
    }
  };
  
  // New function to handle batch update of items with counts > 0
  const handleBatchStatusUpdate = () => {
    let updatedCount = 0;
    const newDeliveredItems: string[] = [];
    
    tiltektItems.forEach(item => {
      const count = getItemCount(item.id);
      if (count > 0 && onStatusUpdate && !deliveredItems.includes(item.id)) {
        onStatusUpdate(item, count);
        updatedCount++;
        newDeliveredItems.push(item.id);
      }
    });
    
    if (updatedCount > 0) {
      // Add all newly delivered items to the list
      setDeliveredItems(prev => [...prev, ...newDeliveredItems]);
      
      toast.success(`${updatedCount} vörur uppfærðar`, {
        description: `${updatedCount} vörur hafa verið merktar sem "Vara afhent" og skýrslur sendar.`,
        duration: 5000,
      });
    } else {
      toast.error("Engar vörur uppfærðar", {
        description: "Þú verður að setja inn talningar fyrir vörur áður en þú getur merkt þær sem afhentar.",
      });
    }
  };
  
  // Handler for opening the description dialog
  const handleOpenDescriptionDialog = (item: RentalItem) => {
    setCurrentItem(item);
    // Load existing description if any
    const existingDescription = getItemDescription(item.id);
    setDescription(existingDescription);
    setIsDescriptionDialogOpen(true);
  };
  
  // Handler for saving the description
  const handleSaveDescription = () => {
    if (!currentItem) return;
    
    // Update or add new description
    setItemDescriptions(prev => {
      const existingIndex = prev.findIndex(d => d.id === currentItem.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { id: currentItem.id, text: description };
        return updated;
      } else {
        return [...prev, { id: currentItem.id, text: description }];
      }
    });
    
    setIsDescriptionDialogOpen(false);
    
    // Show success toast
    if (description.trim()) {
      toast.success("Athugasemd vistuð", {
        description: `Athugasemdin fyrir ${currentItem.itemName} hefur verið vistuð.`,
      });
    } else {
      toast.info("Athugasemd fjarlægð", {
        description: `Athugasemdin fyrir ${currentItem.itemName} hefur verið fjarlægð.`,
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex justify-between items-center">
          <span>Tiltekt</span>
          {isTiltektCompleted && (
            <div className="flex items-center text-green-500 text-sm">
              <Check className="h-4 w-4 mr-1" />
              <span>Tiltekt lokið</span>
            </div>
          )}
          {readyForPickItems.length > 0 && !isTiltektCompleted && (
            <Button 
              className="ml-auto" 
              onClick={onCompletePickup}
              disabled={!hasPickedItems || isTiltektCompleted}
            >
              <Check className="h-4 w-4 mr-2" /> Staðfesta tiltekt
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isTiltektCompleted && (
          <div className="mb-4 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            <span className="text-sm text-yellow-500">Tiltekt hefur þegar verið lokið fyrir þennan samning.</span>
          </div>
        )}
      
        {readyForPickItems.length === 0 && displayedTiltektItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">Engar vörur eru tilbúnar fyrir tiltekt</div>
        ) : (
          <div className="space-y-8">
            {readyForPickItems.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Vörur sem þarf að taka til</h3>
                <ItemTable 
                  items={readyForPickItems} 
                  showContractColumn={false}
                  onTogglePicked={!isTiltektCompleted ? onTogglePicked : undefined}
                  pickedItems={pickedItems}
                  showCountColumn={showCountColumn}
                  onCountChange={!isTiltektCompleted ? onCountChange : undefined}
                />
              </div>
            )}

            {displayedTiltektItems.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Vörur tilbúnar til afhendingar</h3>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => {
                        const item = displayedTiltektItems[0];
                        handleOpenDescriptionDialog(item);
                      }}
                      variant="outline"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <NoteText className="h-4 w-4 mr-2" /> Bæta við athugasemd
                    </Button>
                    <Button 
                      onClick={handleBatchStatusUpdate}
                      variant="secondary"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-2" /> Merkja taldar vörur afhentar
                    </Button>
                  </div>
                </div>
                <div className="mb-2 p-2 bg-gray-700 rounded flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-gray-300" />
                  <span className="text-sm text-gray-300">
                    Smelltu á "Taktu mynd" til að færa vöru í "Tilbúið til afhendingar". 
                    Settu inn talningu fyrst og smelltu svo á merkið.
                  </span>
                </div>
                <ItemTable 
                  items={displayedTiltektItems} 
                  showContractColumn={false}
                  showCountColumn={showCountColumn}
                  onCountChange={onCountChange}
                  onStatusClick={handleStatusClick}
                />
                
                {/* Item descriptions display */}
                {itemDescriptions.some(d => displayedTiltektItems.some(item => item.id === d.id && d.text.trim() !== '')) && (
                  <div className="mt-6 border border-gray-700 rounded-md p-4">
                    <h4 className="text-white font-medium mb-3">Athugasemdir um vörur</h4>
                    <div className="space-y-3">
                      {itemDescriptions
                        .filter(d => displayedTiltektItems.some(item => item.id === d.id) && d.text.trim() !== '')
                        .map(d => {
                          const item = displayedTiltektItems.find(item => item.id === d.id);
                          return item ? (
                            <div key={d.id} className="bg-gray-800/50 p-3 rounded-md">
                              <div className="font-medium text-white mb-1">{item.itemName} ({item.serialNumber})</div>
                              <div className="text-gray-300 text-sm whitespace-pre-wrap">{d.text}</div>
                              <button 
                                className="text-xs text-blue-400 mt-2 hover:underline flex items-center"
                                onClick={() => handleOpenDescriptionDialog(item)}
                              >
                                <NoteText className="h-3 w-3 mr-1" /> Breyta athugasemd
                              </button>
                            </div>
                          ) : null;
                        })
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Description Dialog */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
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
              onClick={() => setIsDescriptionDialogOpen(false)}
            >
              Hætta við
            </Button>
            <Button type="button" onClick={handleSaveDescription}>
              Vista athugasemd
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TiltektTab;
