
import { Client } from '@microsoft/microsoft-graph-client';
import { RentalItem } from '@/types/contract';
import { toast } from 'sonner';
import * as msal from '@azure/msal-browser';

// Microsoft Graph API configuration
const RECIPIENT_EMAIL = import.meta.env.VITE_EMAIL_RECIPIENT || 'leiga@byko.is';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MS_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MS_TENANT_ID || ''}`,
    redirectUri: import.meta.env.VITE_MS_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// MSAL scopes required for Microsoft Graph API
const graphScopes = ['User.Read', 'Mail.Send'];

// Create MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

/**
 * Acquire a token for Microsoft Graph API
 */
async function acquireToken(): Promise<string> {
  try {
    // Check if user is already signed in
    const accounts = msalInstance.getAllAccounts();
    
    if (accounts.length === 0) {
      // No users signed in, redirect to Microsoft login
      await msalInstance.loginRedirect({
        scopes: graphScopes,
        prompt: 'select_account',
      });
      return ''; // This will never be reached due to the redirect
    }
    
    // User is signed in, attempt to get token silently
    const silentRequest = {
      scopes: graphScopes,
      account: accounts[0],
      forceRefresh: false,
    };
    
    const response = await msalInstance.acquireTokenSilent(silentRequest);
    return response.accessToken;
    
  } catch (error) {
    console.error('Error acquiring token:', error);
    
    // If silent token acquisition fails, try popup
    if (error instanceof msal.InteractionRequiredAuthError) {
      try {
        const response = await msalInstance.acquireTokenPopup({
          scopes: graphScopes,
        });
        return response.accessToken;
      } catch (popupError) {
        console.error('Error during popup authentication:', popupError);
        toast.error("Authentication Error", {
          description: "Could not authenticate with Microsoft. Please try again.",
        });
        throw new Error('Failed to authenticate with Microsoft');
      }
    }
    throw error;
  }
}

/**
 * Get an authenticated Microsoft Graph client
 */
async function getGraphClient(): Promise<Client> {
  const token = await acquireToken();
  
  return Client.init({
    authProvider: async (done) => {
      try {
        done(null, token);
      } catch (error) {
        console.error("Error in auth provider:", error);
        done(error as any, null);
      }
    }
  });
}

/**
 * Send an email with report data using Microsoft Graph API
 */
export async function sendReportEmail(
  contractId: string,
  htmlContent: string,
  attachments: any[],
  operation: 'tiltekt' | 'offhire'
): Promise<boolean> {
  let retries = 0;
  const maxRetries = 3;
  
  while (retries < maxRetries) {
    try {
      const client = await getGraphClient();
      
      const operationTitle = operation === 'tiltekt' ? 'Tiltekt' : 'Úr Leigu';
      
      console.log(`Attempting to send ${operationTitle} report for contract ${contractId} to ${RECIPIENT_EMAIL}`);
      
      await client.api('/me/sendMail').post({
        message: {
          subject: `BYKO ${operationTitle} Skýrsla - Samningur ${contractId}`,
          body: {
            contentType: 'HTML',
            content: htmlContent
          },
          toRecipients: [
            {
              emailAddress: {
                address: RECIPIENT_EMAIL
              }
            }
          ],
          attachments: attachments.map(attachment => ({
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: attachment.fileName,
            contentType: attachment.contentType,
            contentBytes: attachment.content.toString('base64')
          }))
        }
      });
      
      console.log(`Successfully sent ${operationTitle} report for contract ${contractId} to ${RECIPIENT_EMAIL}`);
      return true;
    } catch (error) {
      retries++;
      console.error(`Error sending email (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries >= maxRetries) {
        let errorMessage = 'Villa við að senda skýrslu eftir nokkrar tilraunir.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast.error("Villa", {
          description: errorMessage,
        });
        
        return false;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }
  
  return false; // This shouldn't be reached due to the return in the if-statement above
}

/**
 * Send a report for tiltekt or offhire operations
 */
export async function sendReport(
  items: RentalItem[],
  contractId: string,
  operation: 'tiltekt' | 'offhire',
  excelBuffer: Buffer,
  fileName: string,
  htmlReport: string
): Promise<boolean> {
  const attachments = [
    {
      fileName,
      content: excelBuffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  ];
  
  const success = await sendReportEmail(contractId, htmlReport, attachments, operation);
  
  if (success) {
    const operationTitle = operation === 'tiltekt' ? 'Tiltekt' : 'Úr Leigu';
    toast.success("Skýrsla send", {
      description: `${operationTitle} skýrsla fyrir samning ${contractId} var send á ${RECIPIENT_EMAIL}.`,
    });
  }
  
  return success;
}

/**
 * Initialize the Microsoft Authentication
 */
export function initializeMicrosoftAuth(): void {
  // Register event callbacks for handling redirect flows
  msalInstance.handleRedirectPromise().catch(error => {
    console.error("Error handling redirect:", error);
  });
}
