'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function HydrationProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore((state) => state._hydrate);
  
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
