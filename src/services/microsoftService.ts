
import { PublicClientApplication, AuthenticationResult } from "@azure/msal-browser";
import { MS_AUTH_CONFIG } from "@/config/appConfig";

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
