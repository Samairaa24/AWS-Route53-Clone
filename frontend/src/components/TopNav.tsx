import React from 'react';
import Link from 'next/link';

export default function TopNav() {
  return (
    <div className="top-nav">
      <div className="logo">
        <div style={{color: '#ff9900', fontWeight: 900, marginRight: '5px'}}>AWS</div>
        <Link href="/" className="logo-text">Route 53</Link>
      </div>
    </div>
  );
}
