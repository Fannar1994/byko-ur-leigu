
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RentalItem } from "@/types/contract";

interface HistoricalContractViewProps {
  localRentalItems: RentalItem[];
}

const HistoricalContractView: React.FC<HistoricalContractViewProps> = ({ localRentalItems }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          Samningur hefur verið merktur úr leigu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-400 mb-4">
          Þessi samningur er merktur sem "Úr leigu" og er því einungis hægt að skoða upplýsingar um hann.
        </div>
        
        <h3 className="text-lg font-medium text-white mb-4">Vörur í samningi</h3>
        <div className="rounded-md border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-white">Vörunr.</th>
                <th className="py-3 px-4 text-left font-medium text-white">Heiti</th>
                <th className="py-3 px-4 text-left font-medium text-white">Staðsetning</th>
                <th className="py-3 px-4 text-left font-medium text-white">Staða</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {localRentalItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/5">
                  <td className="py-3 px-4 text-white">{item.serialNumber}</td>
                  <td className="py-3 px-4 text-white">{item.itemName}</td>
                  <td className="py-3 px-4 text-white">{item.location || "-"}</td>
                  <td className="py-3 px-4 text-white">{item.status || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalContractView;
