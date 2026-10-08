'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchHostedZone, fetchRecords, createRecord, deleteRecord } from '@/lib/api';

export default function HostedZoneDetails({ params }: { params: { id: string } }) {
  const [zone, setZone] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [newRecordName, setNewRecordName] = useState('');
  const [newRecordType, setNewRecordType] = useState('A');
  const [newRecordValue, setNewRecordValue] = useState('');
  const [newRecordTtl, setNewRecordTtl] = useState('300');

  const loadData = async () => {
    try {
      const z = await fetchHostedZone(params.id);
      const r = await fetchRecords(params.id);
      setZone(z);
      setRecords(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord(params.id, {
        name: newRecordName ? `${newRecordName}.${zone.name}` : zone.name,
        type: newRecordType,
        value: newRecordValue,
        ttl: parseInt(newRecordTtl),
        routing_policy: 'Simple'
      });
      setShowModal(false);
      setNewRecordName('');
      setNewRecordValue('');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRecord = async (id: string, type: string) => {
    if (type === 'NS' || type === 'SOA') {
      alert('Cannot delete default NS or SOA records.');
      return;
    }
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
        loadData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!zone) return <div>Hosted zone not found</div>;

  return (
    <div>
      <div style={{marginBottom: '10px'}}>
        <Link href="/hostedzones">Hosted zones</Link> &gt; {zone.name}
      </div>
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 className="page-title" style={{marginBottom: 0}}>{zone.name}</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create record</button>
      </div>

      <div className="card">
        <h3>Records</h3>
        <table className="aws-table">
          <thead>
            <tr>
              <th>Record name</th>
              <th>Type</th>
              <th>Routing policy</th>
              <th>TTL (seconds)</th>
              <th>Value/Route traffic to</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.name}</td>
                <td>{record.type}</td>
                <td>{record.routing_policy}</td>
                <td>{record.ttl}</td>
                <td style={{whiteSpace: 'pre-line'}}>{record.value}</td>
                <td>
                  <button 
                    className="btn btn-danger" 
                    style={{padding: '4px 8px'}}
                    disabled={record.type === 'NS' || record.type === 'SOA'}
                    onClick={() => handleDeleteRecord(record.id, record.type)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{width: '600px'}}>
            <h2 className="modal-header">Create record</h2>
            <form onSubmit={handleCreateRecord}>
              <div className="form-group">
                <label>Record name</label>
                <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                  <input 
                    type="text" 
                    className="form-control" 
                    style={{width: '150px'}}
                    value={newRecordName}
                    onChange={(e) => setNewRecordName(e.target.value)}
                  />
                  <span>.{zone.name}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Record type</label>
                <select 
                  className="form-control"
                  value={newRecordType}
                  onChange={(e) => setNewRecordType(e.target.value)}
                >
                  <option value="A">A - Routes traffic to an IPv4 address and some AWS resources</option>
                  <option value="AAAA">AAAA - Routes traffic to an IPv6 address and some AWS resources</option>
                  <option value="CNAME">CNAME - Routes traffic to another domain name</option>
                  <option value="TXT">TXT - Routes traffic to text string</option>
                  <option value="MX">MX - Specifies mail servers</option>
                  <option value="PTR">PTR - Routes traffic to a domain name (reverse DNS)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Value</label>
                <textarea 
                  className="form-control" 
                  rows={4}
                  value={newRecordValue}
                  onChange={(e) => setNewRecordValue(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>TTL (Seconds)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newRecordTtl}
                  onChange={(e) => setNewRecordTtl(e.target.value)}
                  required
                />
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
