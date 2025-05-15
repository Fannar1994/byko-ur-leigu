
import { useEffect, useState } from 'react';
import { validateSession, loginToInspHire } from '@/api/inspHireService';
import { toast } from 'sonner';

/**
 * Hook to monitor the inspHire session status and automatically reconnect if needed
 */
export function useSessionMonitor(interval: number = 30000) {
  const [isSessionValid, setIsSessionValid] = useState(true);
  
  useEffect(() => {
    // Check session validity immediately
    const checkSession = async () => {
      try {
        const sessionId = localStorage.getItem('inspSession');
        if (!sessionId) {
          console.log('No session found, creating new session...');
          await loginToInspHire('api', '1994');
          setIsSessionValid(true);
          return;
        }
        
        const isValid = await validateSession(sessionId);
        
        if (!isValid) {
          console.log('Session expired, creating new session...');
          await loginToInspHire('api', '1994');
        }
        
        setIsSessionValid(true);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsSessionValid(false);
        toast.error('Tengingarvilla við inspHire', {
          description: 'Reyndu aftur eða hafðu samband við kerfisstjóra.',
        });
      }
    };
    
    // Check immediately on component mount
    checkSession();
    
    // Set up periodic checks
    const sessionCheckInterval = setInterval(checkSession, interval);
    
    return () => {
      clearInterval(sessionCheckInterval);
    };
  }, [interval]);
  
  return isSessionValid;
}
