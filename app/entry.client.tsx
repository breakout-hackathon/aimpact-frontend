import { RemixBrowser } from '@remix-run/react';
import { startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { AppProvider } from '~/providers';

const root = document.getElementById('root')!;

startTransition(() => {
  hydrateRoot(
    root,
    <AppProvider>
      <RemixBrowser />
    </AppProvider>,
  );
});
