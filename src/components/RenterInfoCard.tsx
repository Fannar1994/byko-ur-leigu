
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Renter } from '@/types/contract';

interface RenterInfoCardProps {
  renter: Renter;
}

const RenterInfoCard: React.FC<RenterInfoCardProps> = ({ renter }) => {
  return (
    <Card className="bg-[#221F26] border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">Upplýsingar um leigutaka</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-white/70">Nafn</div>
            <div className="text-lg font-semibold text-white">{renter.name}</div>
          </div>
          <div>
            <div className="text-sm text-white/70">Kennitala</div>
            <div className="text-lg text-white">{renter.kennitala}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RenterInfoCard;
