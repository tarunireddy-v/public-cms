import React from 'react';
import Layout from '../components/Layout';
import { officerLinks, officerUser } from './OfficerDashboard';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintTable from '../components/ComplaintTable';

export default function Assigned() {
    const { getComplaintsByDepartment, updateComplaintStatus, filterComplaintsBySearch } = useComplaints();
    const complaints = filterComplaintsBySearch(
        getComplaintsByDepartment('Electricity').filter((c) => c.status !== 'Resolved')
    );
    
    const handleUpdate = (id, newStatus, newPriority, note) => {
        updateComplaintStatus(id, newStatus, newPriority, note);
    };

    return (
        <Layout links={officerLinks} user={officerUser} mainStyle={{ padding: '2rem 3rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Assigned Complaints</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage and resolve complaints assigned to Electricity Department.</p>

            <div className="card">
                <ComplaintTable complaints={complaints} isOfficer={true} onUpdate={handleUpdate} />
            </div>
        </Layout>
    );
}
