import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import './i18n'; // Initialize i18n support
import App from './App.tsx'
import { ApiProvider } from './api/ApiProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
  </StrictMode>,
)
