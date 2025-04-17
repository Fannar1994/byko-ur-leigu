
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [localCount, setLocalCount] = React.useState<string>(count.toString());

  React.useEffect(() => {
    setLocalCount(count.toString());
  }, [count]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalCount(value);
  };

  const handleInputBlur = () => {
    const newCount = parseInt(localCount, 10);
    if (!isNaN(newCount) && newCount >= 1 && onCountChange) {
      onCountChange(newCount);
    } else {
      // Reset to previous valid count
      setLocalCount(count.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-500 mb-1">Talningar</div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0" 
          onClick={handleDecrement}
          disabled={isUpdating || count <= 1 || !onCountChange}
        >
          <Minus size={14} />
        </Button>
        <Input
          className="w-16 h-8 text-center"
          value={localCount}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={isUpdating || !onCountChange}
          type="number"
          min="1"
          step="1"
          placeholder="0"
        />
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0" 
          onClick={handleIncrement}
          disabled={isUpdating || !onCountChange}
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
};

export default CountComponent;
