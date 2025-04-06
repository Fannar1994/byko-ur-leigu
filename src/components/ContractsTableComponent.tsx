
import React from 'react';
import { Contract } from '@/types/contract';
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { Calendar, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface ContractsTableProps {
  contracts: Contract[];
  sortField: keyof Contract;
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof Contract) => void;
}

const ContractsTableComponent: React.FC<ContractsTableProps> = ({ 
  contracts,
  sortField,
  sortDirection,
  handleSort
}) => {
  const getStatusColor = (status: Contract["status"]) => {
    switch (status) {
      case "Active":
      case "Virkur":
      case "Í leigu": return "bg-primary text-primary-foreground"; // Yellow
      case "Completed":
      case "Lokið": return "bg-green-500 text-black"; // Green with black text
      case "Cancelled":
      case "Tiltekt": return "bg-white text-black"; // White
      case "Úr leiga": return "bg-red-100 text-red-800"; // Red light
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const SortIcon = ({ field, currentField, direction }: { field: string, currentField: string, direction: "asc" | "desc" }) => {
    if (field !== currentField) return null;
    return direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#2A2A2A]">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("contractNumber")}
            >
              <div className="flex items-center gap-1">
                <span>Samningsnúmer</span>
                <SortIcon field="contractNumber" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center gap-1">
                <span>Staða</span>
                <SortIcon field="status" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("location")}
            >
              <div className="flex items-center gap-1">
                <span>Verkstaður</span>
                <SortIcon field="location" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("startDate")}
            >
              <div className="flex items-center gap-1">
                <span>Upphafsdagsetning</span>
                <SortIcon field="startDate" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("endDate")}
            >
              <div className="flex items-center gap-1">
                <span>Lokadagsetning</span>
                <SortIcon field="endDate" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center gap-1 justify-center">
                <span>Núverandi dagsetning</span>
              </div>
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("endDate")}
            >
              <div className="flex items-center gap-1">
                <span>Áætlaður skiladagur</span>
                <SortIcon field="endDate" currentField={sortField} direction={sortDirection} />
              </div>
            </th>
            <th 
              className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
            >
              <span>Talningar</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-[#2A2A2A] divide-y divide-gray-700">
          {contracts.map((contract) => (
            <tr key={contract.id} className="hover:bg-primary/90 hover:text-black cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  to={`/contract/${contract.contractNumber}`}
                  className="font-medium text-primary hover:underline"
                >
                  {contract.contractNumber}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor(contract.status)}>
                  {contract.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-white">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{contract.location || '-'}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-white">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{formatDate(contract.startDate)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-white">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{formatDate(contract.endDate)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="font-medium text-white">{formatDate(new Date().toISOString())}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1 text-white">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{formatDate(contract.endDate)}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="font-medium text-white">0</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractsTableComponent;
