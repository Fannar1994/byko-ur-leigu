
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeMicrosoftAuth } from './services/microsoftService.ts'
import { validateConfig, MS_AUTH_CONFIG } from './config/appConfig.ts'

// Check configuration
const configStatus = validateConfig();
if (!configStatus.isValid) {
  console.warn(
    `Missing environment variables: ${configStatus.missingConfig.join(', ')}. ` +
    'Some functionality may be limited.'
  );
}

// Initialize Microsoft Authentication only if configuration exists
if (MS_AUTH_CONFIG.clientId && MS_AUTH_CONFIG.tenantId) {
  try {
    initializeMicrosoftAuth();
  } catch (error) {
    console.error("Failed to initialize Microsoft Authentication:", error);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
