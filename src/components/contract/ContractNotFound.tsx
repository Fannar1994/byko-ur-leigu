
import React from "react";
import { Button } from "@/components/ui/button";

interface ContractNotFoundProps {
  contractNumber?: string;
  onGoBack: () => void;
}

const ContractNotFound: React.FC<ContractNotFoundProps> = ({ contractNumber, onGoBack }) => {
  return (
    <div className="text-center py-12 text-white">
      <p>Samningur með númer {contractNumber} fannst ekki.</p>
      <Button onClick={onGoBack} className="mt-4">
        Til baka
      </Button>
    </div>
  );
};

export default ContractNotFound;
