
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RentalItem } from "@/types/contract";
import RentalTabsNavigation from "@/components/RentalTabsNavigation";
import TabContent from "@/components/TabContent";
import { OffHireHandler } from "@/components/contract/OffHireHandler";

interface ActiveContractsViewProps {
  tiltektItems: RentalItem[];
  offHiredItems: RentalItem[];
  contractNumbersMap: Record<string, string>;
  onItemStatusUpdate: (itemId: string, newStatus: "Tiltekt" | "Úr leiga" | "Í leigu" | "On Rent" | "Off-Hired" | "Pending Return" | "Tilbúið til afhendingar") => void;
  onCountChange?: (itemId: string, count: number) => void;
}

const ActiveContractsView: React.FC<ActiveContractsViewProps> = ({
  tiltektItems,
  offHiredItems,
  contractNumbersMap,
  onItemStatusUpdate,
  onCountChange
}) => {
  return (
    <Tabs defaultValue="tiltekt" className="w-full">
      <RentalTabsNavigation />
      
      <TabsContent value="tiltekt" className="animate-fade-in">
        <TabContent 
          title="Vörur í tiltekt" 
          items={tiltektItems} 
          contractNumbers={contractNumbersMap} 
          showLocationColumn={true}
          showCountColumn={true}
          onCountChange={onCountChange}
        />
      </TabsContent>
      
      <TabsContent value="offhired" className="animate-fade-in">
        <OffHireHandler onItemStatusUpdate={onItemStatusUpdate}>
          {({ handleOffHireClick, processingItemId, processedItems }) => (
            <TabContent 
              title="Úr leiga" 
              items={offHiredItems.filter(item => !processedItems.includes(item.id))}
              contractNumbers={contractNumbersMap} 
              showActions={true}
              onOffHireClick={handleOffHireClick}
              processingItemId={processingItemId}
              showLocationColumn={true}
              showCountColumn={true}
              onCountChange={onCountChange}
            />
          )}
        </OffHireHandler>
      </TabsContent>
    </Tabs>
  );
};

export default ActiveContractsView;
