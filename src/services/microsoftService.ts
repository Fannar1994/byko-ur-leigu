
import { Client } from '@microsoft/microsoft-graph-client';
import { RentalItem } from '@/types/contract';
import { toast } from 'sonner';

// Microsoft Graph API configuration
const RECIPIENT_EMAIL = 'leiga@byko.is';
const SENDER_EMAIL = 'tilkynningar@byko.is'; // This should be replaced with the actual sender email

interface EmailAttachment {
  fileName: string;
  content: Buffer | string;
  contentType: string;
}

/**
 * Get an authenticated Microsoft Graph client
 */
function getGraphClient(): Client {
  // In a real implementation, this would use proper authentication.
  // For now, we're simulating the API calls
  
  return Client.init({
    authProvider: async (done) => {
      // This is a placeholder for actual authentication logic
      // In production, you would get a token from Microsoft identity platform
      const mockToken = 'mock_token';
      done(null, mockToken);
    }
  });
}

/**
 * Send an email with report data using Microsoft Graph API
 */
export async function sendReportEmail(
  contractId: string,
  htmlContent: string,
  attachments: EmailAttachment[],
  operation: 'tiltekt' | 'offhire'
): Promise<boolean> {
  try {
    // For demo purposes, we'll simulate a successful API call
    // In a real implementation, this would use the Graph API to send an email
    console.log(`Sending ${operation} report for contract ${contractId} to ${RECIPIENT_EMAIL}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log what would be sent in a real implementation
    console.log('Email content:', htmlContent);
    console.log('Attachments:', attachments.map(a => a.fileName));
    
    // In a real implementation, you would use the Graph client like this:
    /*
    const client = getGraphClient();
    
    await client.api('/me/sendMail').post({
      message: {
        subject: `BYKO ${operation === 'tiltekt' ? 'Tiltekt' : 'Úr Leigu'} Skýrsla - Samningur ${contractId}`,
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
    */
    
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
  const attachments: EmailAttachment[] = [
    {
      fileName,
      content: excelBuffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  ];
  
  const operationTitle = operation === 'tiltekt' ? 'Tiltekt' : 'Úr Leigu';
  const subject = `BYKO ${operationTitle} Skýrsla - Samningur ${contractId}`;
  
  const success = await sendReportEmail(contractId, htmlReport, attachments, operation);
  
  if (success) {
    toast.success("Skýrsla send", {
      description: `${operationTitle} skýrsla fyrir samning ${contractId} var send á ${RECIPIENT_EMAIL}.`,
    });
  }
  
  return success;
}
