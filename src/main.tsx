
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Application initializing...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  createRoot(rootElement).render(<App />);
  console.log('Application rendered successfully');
}
