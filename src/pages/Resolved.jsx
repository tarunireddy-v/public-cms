import React from 'react';
import Layout from '../components/Layout';
import { officerLinks, officerUser } from './OfficerDashboard';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintTable from '../components/ComplaintTable';

export default function Resolved() {
    const { getComplaintsByDepartment, filterComplaintsBySearch } = useComplaints();
    const resolved = filterComplaintsBySearch(
        getComplaintsByDepartment('Electricity').filter((c) => c.status === 'Resolved')
    );

    return (
        <Layout links={officerLinks} user={officerUser} mainStyle={{ padding: '2rem 3rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Resolved Complaints</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>History of all completed cases handled by your department.</p>
            
            <div className="card">
                <ComplaintTable complaints={resolved} showCitizen={true} isOfficer={true} />
            </div>
        </Layout>
    );
}
