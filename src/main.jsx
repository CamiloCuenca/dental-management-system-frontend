import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react'; // ⬅️ Agregado
import './index.css';
import App from './App.jsx';

// Inicializar Sentry
Sentry.init({
  dsn: 'https://0b51314f1fe8e6fe3fb154a7e231b2fa@o4509380596465664.ingest.us.sentry.io/4509380639719424',
  sendDefaultPii: true,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Ha ocurrido un error.</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>
);
