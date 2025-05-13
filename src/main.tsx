
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MS_AUTH_CONFIG } from './config/appConfig.ts'

// Initialize Microsoft Authentication only if configuration exists
if (MS_AUTH_CONFIG.clientId && MS_AUTH_CONFIG.tenantId) {
  try {
    // We'll skip initialization to avoid potential errors
    console.log("Microsoft Authentication configuration found");
  } catch (error) {
    console.error("Failed to initialize Microsoft Authentication:", error);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
