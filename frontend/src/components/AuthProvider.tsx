'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user && pathname !== '/login') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
