
import React from "react";
import { Link } from "react-router-dom";

interface ContractLinkProps {
  contractNumber?: string;
  isSelected: boolean;
}

const ContractLink: React.FC<ContractLinkProps> = ({ contractNumber, isSelected }) => {
  if (!contractNumber) {
    return <span>-</span>;
  }

  return (
    <Link 
      to={`/contract/${contractNumber}`}
      className={isSelected ? "text-black hover:underline" : "text-primary hover:underline"}
      onClick={(e) => e.stopPropagation()}
    >
      {contractNumber}
    </Link>
  );
};

export default ContractLink;
