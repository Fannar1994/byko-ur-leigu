
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CountComponentProps {
  count: number;
  onCountChange?: (count: number) => void;
  isUpdating?: boolean;
}

const CountComponent: React.FC<CountComponentProps> = ({ 
  count = 1, 
  onCountChange,
  isUpdating = false
}) => {
  const handleIncrement = () => {
    if (onCountChange) {
      onCountChange(count + 1);
    }
  };

  const handleDecrement = () => {
    if (onCountChange && count > 1) {
      onCountChange(count - 1);
    }
  };

  return (
    <div>
      <div className="text-sm text-gray-500">Talningar</div>
      <div className="flex items-center justify-center gap-2 mt-1">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 w-6 p-0" 
          onClick={handleDecrement}
          disabled={isUpdating || count <= 1 || !onCountChange}
        >
          <Minus size={12} />
        </Button>
        <div className="text-lg font-medium text-white text-center min-w-[24px]">
          {count}
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 w-6 p-0" 
          onClick={handleIncrement}
          disabled={isUpdating || !onCountChange}
        >
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );
};

export default CountComponent;
