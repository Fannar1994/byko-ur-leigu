
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeMicrosoftAuth } from './services/microsoftService.ts'

// Initialize Microsoft Authentication
initializeMicrosoftAuth();

createRoot(document.getElementById("root")!).render(<App />);
