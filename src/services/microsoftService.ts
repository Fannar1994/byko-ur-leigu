
import { PublicClientApplication, AuthenticationResult } from "@azure/msal-browser";
import { MS_AUTH_CONFIG, EMAIL_CONFIG } from "@/config/appConfig";
import { RentalItem } from "@/types/contract";

let msalInstance: PublicClientApplication | null = null;

export function initializeMicrosoftAuth() {
  // Only initialize if configuration is available
  if (!MS_AUTH_CONFIG.clientId || !MS_AUTH_CONFIG.tenantId) {
    console.warn("Microsoft Authentication cannot be initialized: Missing configuration");
    return;
  }

  try {
    msalInstance = new PublicClientApplication({
      auth: {
        clientId: MS_AUTH_CONFIG.clientId,
        authority: `https://login.microsoftonline.com/${MS_AUTH_CONFIG.tenantId}`,
        redirectUri: MS_AUTH_CONFIG.redirectUri,
      },
      cache: {
        cacheLocation: "localStorage",
      },
    });
  } catch (error) {
    console.error("Failed to initialize MSAL:", error);
    throw error;
  }
}

export async function signInWithMicrosoft(): Promise<AuthenticationResult | null> {
  if (!msalInstance) {
    console.error("Microsoft Authentication is not initialized");
    return null;
  }
  
  try {
    const response = await msalInstance.loginPopup({
      scopes: ["User.Read"],
    });
    return response;
  } catch (error) {
    console.error("Error during Microsoft sign-in:", error);
    return null;
  }
}

export async function signOutFromMicrosoft(): Promise<void> {
  if (!msalInstance) {
    console.error("Microsoft Authentication is not initialized");
    return;
  }
  
  try {
    await msalInstance.logoutPopup();
  } catch (error) {
    console.error("Error during Microsoft sign-out:", error);
  }
}

/**
 * Send a report via email using Microsoft Graph API or fallback method
 * This is a simplified implementation that simulates sending reports
 * 
 * @param items - The rental items included in the report
 * @param contractId - The ID of the contract
 * @param operation - The type of operation (e.g., 'tiltekt', 'offhire')
 * @param excelBuffer - The Excel file as a buffer
 * @param fileName - The name to use for the file
 * @param htmlContent - HTML content of the report
 * @returns Promise resolving to a boolean indicating success
 */
export async function sendReport(
  items: RentalItem[],
  contractId: string,
  operation: 'tiltekt' | 'offhire',
  excelBuffer: Buffer,
  fileName: string,
  htmlContent: string
): Promise<boolean> {
  console.log(`Sending ${operation} report for contract ${contractId} with ${items.length} items`);
  
  if (!MS_AUTH_CONFIG.clientId || !MS_AUTH_CONFIG.tenantId) {
    console.warn("Microsoft services not fully configured - using fallback method for sending reports");
    return simulateSendReport(items, contractId, operation, fileName, EMAIL_CONFIG.recipient);
  }
  
  try {
    // Check if user is signed in
    if (!msalInstance?.getActiveAccount()) {
      console.log("User not signed in, attempting to sign in...");
      const authResult = await signInWithMicrosoft();
      if (!authResult) {
        console.warn("Could not authenticate with Microsoft, using fallback method");
        return simulateSendReport(items, contractId, operation, fileName, EMAIL_CONFIG.recipient);
      }
    }
    
    // This is a simplified implementation
    // In a production environment, you would use Microsoft Graph API to send the email with attachment
    console.log(`Report would be sent to ${EMAIL_CONFIG.recipient} with file ${fileName}`);
    console.log(`Operation: ${operation}, Contract ID: ${contractId}`);
    
    // Simulate API call success
    return true;
  } catch (error) {
    console.error("Error sending report:", error);
    return false;
  }
}

/**
 * Simulate sending a report (for development/demo purposes)
 */
function simulateSendReport(
  items: RentalItem[],
  contractId: string,
  operation: 'tiltekt' | 'offhire',
  fileName: string,
  recipient: string
): Promise<boolean> {
  return new Promise(resolve => {
    console.log(`SIMULATED: Sending ${operation} report for contract ${contractId} to ${recipient}`);
    console.log(`SIMULATED: Report contains ${items.length} items`);
    console.log(`SIMULATED: File name: ${fileName}`);
    
    // Simulate network delay
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() < 0.95;
      if (success) {
        console.log("SIMULATED: Report sent successfully");
      } else {
        console.error("SIMULATED: Failed to send report");
      }
      resolve(success);
    }, 1500);
  });
}
