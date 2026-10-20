import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CommerceProvider } from './context/CommerceContext';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <CommerceProvider>
        <App />
      </CommerceProvider>
    </BrowserRouter>
  </StrictMode>,
);
