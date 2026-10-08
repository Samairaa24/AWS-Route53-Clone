'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user && pathname !== '/login') {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  // On login page: always render children (no redirect needed)
  if (pathname === '/login') return <>{children}</>;

  // On other pages: wait until auth check is done
  if (!ready) return <div style={{padding: '20px'}}>Loading...</div>;

  return <>{children}</>;
}
