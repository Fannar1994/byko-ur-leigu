
import React from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PhotoButtonProps {
  onClick?: (e: React.MouseEvent) => void;
}

const PhotoButton: React.FC<PhotoButtonProps> = ({ onClick }) => {
  const handlePhotoButtonClick = (e: React.MouseEvent) => {
    // Ensure we prevent the default behavior and stop event propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Always show the camera action toast, regardless of item status or count
    toast.success("Mynd", {
      description: "Aðgerð til að bæta við mynd í skýrsluna verður virk fljótlega.",
    });
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      className="p-1 h-7 bg-blue-600 hover:bg-blue-700 text-white"
      onClick={handlePhotoButtonClick}
      title="Bæta við mynd í skýrslu"
    >
      <Camera className="h-4 w-4" />
    </Button>
  );
};

export default PhotoButton;
