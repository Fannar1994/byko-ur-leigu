
import React from 'react';
import { Input } from "@/components/ui/input";

interface CountComponentProps {
  count: number;
  onCountChange: (newCount: number) => void;
  isUpdating?: boolean;
}

const CountComponent: React.FC<CountComponentProps> = ({ 
  count, 
  onCountChange, 
  isUpdating = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);
    
    // Only update if the value is a valid number and greater than 0
    if (!isNaN(numericValue) && numericValue >= 0) {
      onCountChange(numericValue);
    }
  };

  return (
    <Input 
      type="number" 
      min="0"
      value={count}
      onChange={handleChange}
      className={`w-20 text-center ${isUpdating ? 'opacity-50' : ''}`}
      disabled={isUpdating}
    />
  );
};

export default CountComponent;
