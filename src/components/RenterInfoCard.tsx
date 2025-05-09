
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Renter } from '@/types/contract';

interface RenterInfoCardProps {
  renter: Renter;
}

const RenterInfoCard: React.FC<RenterInfoCardProps> = ({ renter }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white">Upplýsingar um leigutaka</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Kennitala</div>
              <div className="text-lg text-white">{renter.kennitala}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Tengiliður</div>
              <div className="text-lg text-white">{renter.contactPerson}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">Fyrirtæki</div>
            <div className="text-lg font-semibold text-white">{renter.name}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">Heimilisfang</div>
            <div className="text-lg text-white">{renter.address}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Staður</div>
              <div className="text-lg text-white">{renter.city}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Póstnúmer</div>
              <div className="text-lg text-white">{renter.postalCode}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">Símanúmer</div>
            <div className="text-lg text-white">{renter.phone}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RenterInfoCard;
