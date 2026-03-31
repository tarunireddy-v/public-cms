import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { citizenLinks } from './CitizenDashboard';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintTable from '../components/ComplaintTable';

export default function MyComplaints() {
    const { getComplaintsByUser, filterComplaintsBySearch, fetchComplaints } = useComplaints();
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!currentUser) {
        window.location.href = '/login';
        return null;
    }
    const complaints = filterComplaintsBySearch(getComplaintsByUser(currentUser.id || ''));

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    return (
        <Layout links={citizenLinks} user={currentUser}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>My Complaints</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>View and track all your submitted issues in one place.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select className="form-control" style={{ fontSize: '0.875rem', padding: '0.5rem 2.5rem 0.5rem 1rem' }}>
                        <option>All Statuses</option>
                        <option>Submitted</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <ComplaintTable complaints={complaints} />
            </div>
        </Layout>
    );
}
