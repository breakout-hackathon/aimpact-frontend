'use client';
import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const AppProvider = (props: { children: ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
};
