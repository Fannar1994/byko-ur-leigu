
import { useEffect, useState } from 'react';
import { loginToInspHire, validateSession } from '@/api/inspHireService';
import { toast } from 'sonner';

/**
 * Hook to automatically log in to inspHire and manage sessions
 */
export function useAutoLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAndLogin = async () => {
      try {
        setIsLoading(true);
        const session = localStorage.getItem("inspSession");
        
        // If no session exists
        if (!session) {
          console.log("No inspHire session found, logging in...");
          await loginToInspHire("api", "1994");
          setIsLoggedIn(true);
          return;
        }
        
        // If session exists, validate it
        const isValid = await validateSession(session);
        
        if (!isValid) {
          console.log("inspHire session expired, logging in again...");
          await loginToInspHire("api", "1994");
        }
        
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to login to inspHire:", error);
        toast.error("Tenging við inspHire kerfið mistókst", {
          description: "Reyndu aftur eða hafðu samband við kerfisstjóra."
        });
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAndLogin();
  }, []);
  
  return { isLoggedIn, isLoading };
}
