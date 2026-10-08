'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchHostedZones, createHostedZone, deleteHostedZone } from '@/lib/api';

export default function HostedZones() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneType, setNewZoneType] = useState('public');

  const loadZones = async () => {
    try {
      const data = await fetchHostedZones();
      setZones(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;
    try {
      await createHostedZone({
        name: newZoneName,
        is_private: newZoneType === 'private',
        comment: ''
      });
      setShowModal(false);
      setNewZoneName('');
      loadZones();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hosted zone?')) {
      try {
        await deleteHostedZone(id);
        loadZones();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 className="page-title" style={{marginBottom: 0}}>Hosted zones</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create hosted zone</button>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="aws-table">
            <thead>
              <tr>
                <th>Hosted zone name</th>
                <th>Type</th>
                <th>Record count</th>
                <th>Caller reference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id}>
                  <td>
                    <Link href={`/hostedzones/${zone.id}`}>{zone.name}</Link>
                  </td>
                  <td>{zone.is_private ? 'Private' : 'Public'}</td>
                  <td>{zone.record_count}</td>
                  <td>{zone.caller_reference}</td>
                  <td>
                    <button className="btn btn-danger" style={{padding: '4px 8px'}} onClick={() => handleDelete(zone.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {zones.length === 0 && (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No hosted zones found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Create hosted zone</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Domain name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="example.com"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select 
                  className="form-control"
                  value={newZoneType}
                  onChange={(e) => setNewZoneType(e.target.value)}
                >
                  <option value="public">Public hosted zone</option>
                  <option value="private">Private hosted zone</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
