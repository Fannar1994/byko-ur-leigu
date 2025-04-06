
import React from 'react';

interface CountComponentProps {
  count?: number;
}

const CountComponent: React.FC<CountComponentProps> = ({ count = 0 }) => {
  return (
    <div>
      <div className="text-sm text-gray-500">Talningar</div>
      <div className="text-lg font-medium text-white text-center">
        {count}
      </div>
    </div>
  );
};

export default CountComponent;
