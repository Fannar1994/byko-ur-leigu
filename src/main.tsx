
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MS_AUTH_CONFIG } from './config/appConfig.ts'

// Initialize Microsoft Authentication only if configuration exists
if (MS_AUTH_CONFIG.clientId && MS_AUTH_CONFIG.tenantId) {
  console.log("Microsoft Authentication configuration found");
}

createRoot(document.getElementById("root")!).render(<App />);
