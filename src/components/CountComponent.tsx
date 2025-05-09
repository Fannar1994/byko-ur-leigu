
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";

interface CountComponentProps {
  count?: number;
  onCountChange?: (count: number) => void;
  itemId?: string;
}

const CountComponent: React.FC<CountComponentProps> = ({ 
  count, 
  onCountChange,
  itemId
}) => {
  const [localCount, setLocalCount] = useState<string>(count ? count.toString() : '');
  
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalCount(newValue);
    
    if (onCountChange && newValue !== '') {
      const numericValue = parseInt(newValue, 10);
      if (!isNaN(numericValue)) {
        onCountChange(numericValue);
      }
    }
  };

  return (
    <div className="w-full">
      <Input
        type="number"
        value={localCount}
        onChange={handleCountChange}
        placeholder=""
        className="w-16 h-8 text-center text-white bg-transparent no-arrows"
        min="0"
        aria-label="Talningar"
        id={`count-${itemId}`}
      />
    </div>
  );
};

export default CountComponent;
