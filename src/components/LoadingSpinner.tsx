
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md" }) => {
  const sizeClassMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex justify-center py-12">
      <div className={`${sizeClassMap[size]} rounded-full border-4 border-primary border-t-primary/20 animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
