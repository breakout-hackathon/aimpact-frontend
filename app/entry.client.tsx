import { init, replayIntegration, browserTracingIntegration } from "@sentry/remix";
import { RemixBrowser, useLocation, useMatches } from '@remix-run/react';
import { startTransition, useEffect } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { AppProvider } from '~/providers';

init({
    dsn: "https://3ce6d32dc3d38efe0423220e0772c4a6@o4509436444278784.ingest.de.sentry.io/4509436451618896",
    tracesSampleRate: 0.1,

    integrations: [browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches
    }), replayIntegration({
        maskAllText: true,
        blockAllMedia: true
    })],

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    sampleRate: 0.1,
    environment: import.meta.env.ENVIRONMENT || 'development',
})

const root = document.getElementById('root')!;

startTransition(() => {
  hydrateRoot(
    root,
    <AppProvider>
      <RemixBrowser />
    </AppProvider>,
  );
});
