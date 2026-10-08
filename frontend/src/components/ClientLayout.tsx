'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="layout">
      <TopNav />
      <div className="main-container">
        <Sidebar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
