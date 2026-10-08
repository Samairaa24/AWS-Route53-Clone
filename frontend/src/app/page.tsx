import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Route 53 Dashboard</h1>
      <div className="card">
        <h3>Welcome to Amazon Route 53</h3>
        <p style={{marginTop: '10px', marginBottom: '20px'}}>Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service.</p>
        <Link href="/hostedzones" className="btn btn-primary">Go to Hosted zones</Link>
      </div>
      
      <div className="card">
        <h3>Other Features</h3>
        <p style={{marginTop: '10px'}}>Traffic Policies, Health Checks, Resolver, and Profiles are <b>Coming Soon</b>.</p>
      </div>
    </div>
  );
}
