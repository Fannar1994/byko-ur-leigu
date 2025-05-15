
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { Contract, Renter } from '@/types/contract';

interface ContractInfoProps {
  contract: Contract;
  renter: Renter;
}

const ContractInfo: React.FC<ContractInfoProps> = ({ contract, renter }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
      case "Virkur": 
      case "Í leigu": return "bg-primary text-primary-foreground";
      case "Completed":
      case "Lokið": return "bg-green-500 text-black";
      case "Cancelled":
      case "Tiltekt": return "bg-white text-black";
      case "Tilbúið til afhendingar": return "bg-green-500 text-black";
      case "Úr leiga":
      case "Off-Hired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-white flex items-center justify-between">
          <span>Samningur {contract.contractNumber}</span>
          <Badge className={getStatusColor(contract.status)}>
            {contract.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Upphafsdagsetning</div>
            <div className="text-lg font-medium text-white flex items-center">
              <Calendar size={16} className="mr-2" />
              {formatDate(contract.startDate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Lokadagsetning</div>
            <div className="text-lg font-medium text-white flex items-center">
              <Calendar size={16} className="mr-2" />
              {formatDate(contract.endDate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Verkstaður</div>
            <div className="text-lg font-medium text-white flex items-center">
              <MapPin size={16} className="mr-2" />
              {contract.location || '-'}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500">Samningsdagsetning</div>
            <div className="text-lg font-medium text-white flex items-center">
              <Calendar size={16} className="mr-2" />
              {contract.contractDate ? formatDate(contract.contractDate) : formatDate(contract.startDate)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Afhendingardagur</div>
            <div className="text-lg font-medium text-white flex items-center">
              <Calendar size={16} className="mr-2" />
              {contract.deliveryDate ? formatDate(contract.deliveryDate) : '-'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Áætluð skiladagsetning</div>
            <div className="text-lg font-medium text-white flex items-center">
              <Calendar size={16} className="mr-2" />
              {contract.expectedReturnDate ? formatDate(contract.expectedReturnDate) : formatDate(contract.endDate)}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="text-sm text-gray-500">Leigutaki</div>
            <div className="text-lg font-medium text-white">
              {renter.name} ({renter.kennitala})
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractInfo;
