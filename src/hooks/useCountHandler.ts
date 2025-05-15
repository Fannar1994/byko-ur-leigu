
import { setItemCount } from "@/utils/countUtils";

export function useCountHandler() {
  // Handle count change and status update together
  const handleCountChange = (itemId: string, count: number) => {
    console.log(`Item ${itemId} count changed to ${count}`);
    
    // Save the count
    setItemCount(itemId, count);
  };
  
  return { handleCountChange };
}
