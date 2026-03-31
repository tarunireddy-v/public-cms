import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { adminLinks } from './AdminDashboard';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintTable from '../components/ComplaintTable';

export default function AdminComplaints() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = '/login';
        return null;
    }
    const { complaints, filterComplaintsBySearch, searchQuery, setSearchQuery, fetchComplaints } = useComplaints();
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const searched = filterComplaintsBySearch(complaints);
    const filtered = searched.filter((c) => {
        if (filter !== 'All' && c.status !== filter) return false;
        return true;
    });

    return (
        <Layout links={adminLinks} user={user} mainStyle={{ padding: '2rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>All Complaints</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage and oversee all complaints across the city.</p>
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <input 
                    type="text" 
                    placeholder="Search by ID or Title..." 
                    className="form-control" 
                    style={{ flex: 1 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select className="form-control" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: '200px' }}>
                    <option value="All">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </div>

            <div className="card">
                <ComplaintTable complaints={filtered} showCitizen={true} isAdmin={true} />
            </div>
        </Layout>
    );
}
