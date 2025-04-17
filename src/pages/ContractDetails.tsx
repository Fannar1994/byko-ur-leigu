
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RentalItem } from "@/types/contract";
import { fetchContractData } from "@/services/contractService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContractDetailsContent from "@/components/ContractDetailsContent";

const ContractDetails = () => {
  const { contractNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<any | null>(null);
  const [localRentalItems, setLocalRentalItems] = useState<RentalItem[]>([]);
  
  const lastKennitala = localStorage.getItem('lastSearchedKennitala') || '';

  useEffect(() => {
    const loadContractData = async () => {
      setLoading(true);
      try {
        const kennitala = lastKennitala || "1234567890";
        const data = await fetchContractData(kennitala);
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

    loadContractData();
  }, [contractNumber, lastKennitala]);

  const handleGoBack = () => {
    navigate('/?kennitala=' + lastKennitala);
  };

  const handleRentalItemsChange = (newItems: RentalItem[]) => {
    setLocalRentalItems(newItems);
  };

  const contract = contractData?.contracts.find(c => c.contractNumber === contractNumber);
  const renter = contractData?.renter;

  return (
    <div className="min-h-screen bg-background dark">
      <Header onBackClick={handleGoBack} />
      
      <main className="container px-4 pb-12 max-w-7xl mx-auto space-y-8">
        <ContractDetailsContent 
          loading={loading}
          contract={contract || null}
          renter={renter || null}
          rentalItems={localRentalItems}
          onRentalItemsChange={handleRentalItemsChange}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default ContractDetails;
