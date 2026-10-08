import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/' },
    { name: 'Hosted zones', href: '/hostedzones' },
    { name: 'Health checks', href: '/healthchecks' },
    { name: 'Traffic policies', href: '/trafficpolicies' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">Route 53</div>
      <ul className="sidebar-menu">
        {links.map((link) => (
          <li key={link.href}>
            <Link 
              href={link.href}
              className={pathname === link.href || (pathname.startsWith('/hostedzones') && link.href === '/hostedzones') ? 'active' : ''}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
