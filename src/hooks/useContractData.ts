
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Contract, RentalItem } from "@/types/contract";
import { searchByKennitala } from "@/services/api";

export function useContractData(contractNumber: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<any | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  const lastKennitala = localStorage.getItem('lastSearchedKennitala') || '';

  useEffect(() => {
    const fetchContractData = async () => {
      setLoading(true);
      try {
        const kennitala = lastKennitala || "1234567890";
        const data = await searchByKennitala(kennitala);
        setContractData(data);
        
        if (data) {
          const contract = data.contracts.find(c => c.contractNumber === contractNumber);
          
          if (contract) {
            const contractItems = data.rentalItems.filter(item => 
              item.contractId === contract.id
            );
            setLocalRentalItems(contractItems);
          } else {
            toast.error("Samningur fannst ekki", {
              description: `Samningur ${contractNumber} finnst ekki í kerfinu.`,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching contract data:", error);
        toast.error("Villa kom upp", {
          description: "Ekki tókst að sækja gögn um samning.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [contractNumber, lastKennitala]);

  return { 
    loading, 
    contractData, 
    localRentalItems, 
    setLocalRentalItems, 
    lastKennitala 
  };
}
