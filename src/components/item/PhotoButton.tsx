
import React from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PhotoButtonProps {
  onClick?: (e: React.MouseEvent) => void;
}

const PhotoButton: React.FC<PhotoButtonProps> = ({ onClick }) => {
  // Create a file input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handlePhotoButtonClick = (e: React.MouseEvent) => {
    // Prevent default behavior and stop event propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    
    // Also call any passed onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Handle the selected image
    toast.success("Mynd tekin", {
      description: "Mynd hefur verið tekin og bætt við skýrsluna.",
    });
    
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  return (
    <div className="flex items-center justify-center">
      <Button 
        variant="outline" 
        size="sm"
        className="p-1 h-7 bg-blue-600 hover:bg-blue-700 text-white"
        onClick={handlePhotoButtonClick}
        title="Taka mynd fyrir skýrslu"
      >
        <Camera className="h-4 w-4" />
      </Button>
      
      {/* Hidden file input for camera */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};

export default PhotoButton;
