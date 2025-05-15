
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize app directly without any auth checks
createRoot(document.getElementById("root")!).render(<App />);
