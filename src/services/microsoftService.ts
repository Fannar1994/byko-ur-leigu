
import { Client } from '@microsoft/microsoft-graph-client';
import { RentalItem } from '@/types/contract';
import { toast } from 'sonner';

// Microsoft Graph API configuration
const RECIPIENT_EMAIL = 'leiga@byko.is';

/**
 * Get an authenticated Microsoft Graph client
 */
function getGraphClient(): Client {
  return Client.init({
    authProvider: async (done) => {
      try {
        // In a real implementation, we would get a token using proper auth flow
        // For now, we're using a simpler approach that will work for our needs
        const token = localStorage.getItem("ms_token");
        if (!token) {
          throw new Error("No Microsoft authentication token found");
        }
        done(null, token);
      } catch (error) {
        console.error("Error getting auth token:", error);
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
  try {
    const client = getGraphClient();
    
    const operationTitle = operation === 'tiltekt' ? 'Tiltekt' : 'Úr Leigu';
    
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
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    let errorMessage = 'Villa við að senda skýrslu.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    toast.error("Villa", {
      description: errorMessage,
    });
    
    return false;
  }
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
