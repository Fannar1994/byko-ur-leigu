
import React from 'react';
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
    </div>
  );
};

export default CountComponent;
