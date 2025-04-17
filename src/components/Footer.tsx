
import React from "react";

interface FooterProps {
  companyName?: string;
}

const Footer: React.FC<FooterProps> = ({ companyName = "BYKO Leiga" }) => {
  return (
    <footer className="bg-[#2A2A2A] text-white py-4 px-4">
      <div className="container mx-auto text-center text-sm">
        <p>{companyName}</p>
      </div>
    </footer>
  );
};

export default Footer;
