import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initGA4, initGTM } from './utils/analytics'

// Initialize Analytics (only in production or if explicitly enabled)
const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const gtmContainerId = import.meta.env.VITE_GTM_CONTAINER_ID;

if (enableAnalytics) {
  if (ga4MeasurementId && ga4MeasurementId !== 'G-XXXXXXXXXX') {
    initGA4(ga4MeasurementId);
  }

  if (gtmContainerId && gtmContainerId !== 'GTM-XXXXXX') {
    initGTM(gtmContainerId);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
