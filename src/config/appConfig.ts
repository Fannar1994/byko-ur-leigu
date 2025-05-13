
/**
 * Application configuration with environment variables and fallbacks
 */

// API Configuration
export const API_CONFIG = {
  inspHireApi: import.meta.env.VITE_INSPHIRE_API || 'http://172.18.69.125:8080/insphire.office',
  enableString: 'BYKO'
};

// Microsoft Authentication Configuration
export const MS_AUTH_CONFIG = {
  clientId: import.meta.env.VITE_MS_CLIENT_ID || '',
  tenantId: import.meta.env.VITE_MS_TENANT_ID || '',
  redirectUri: import.meta.env.VITE_MS_REDIRECT_URI || 'http://localhost:8080'
};

// Email Configuration
export const EMAIL_CONFIG = {
  recipient: import.meta.env.VITE_EMAIL_RECIPIENT || 'leiga@byko.is'
};

/**
 * Check if all required configuration is present
 * @returns Object containing validation status and missing config items
 */
export function validateConfig() {
  const missingConfig = [];
  
  // Check Microsoft auth config if being used
  if (!MS_AUTH_CONFIG.clientId) missingConfig.push('VITE_MS_CLIENT_ID');
  if (!MS_AUTH_CONFIG.tenantId) missingConfig.push('VITE_MS_TENANT_ID');

  return {
    isValid: missingConfig.length === 0,
    missingConfig
  };
}
