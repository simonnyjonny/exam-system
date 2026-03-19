'use client';

import { BilingualProvider } from '@/contexts/BilingualContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <BilingualProvider>{children}</BilingualProvider>;
}
