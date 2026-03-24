import React from 'react';
import Layout from '../components/Layout';
import { useComplaints } from '../context/ComplaintContext';
import { DashboardStatCard } from '../components/DashboardCards';
import ComplaintTable from '../components/ComplaintTable';
import { Link } from 'react-router-dom';

const citizenLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg> },
    { path: '/my-complaints', label: 'My Complaints', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { path: '/submit', label: 'Submit New', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> }
];

export default function CitizenDashboard() {
    const { getComplaintsByUser, filterComplaintsBySearch } = useComplaints();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userComplaints = getComplaintsByUser(currentUser.id || '');
    const allComplaints = filterComplaintsBySearch(userComplaints);
    
    const total = userComplaints.length;
    const inProgress = userComplaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
    const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

    const IconTotal = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
    const IconProgress = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
    const IconResolved = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

    return (
        <Layout links={citizenLinks}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Citizen Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Welcome back, Marcus. Here's what's happening in your neighborhood.</p>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <DashboardStatCard title="Total Complaints" value={total} badgeText="+12%" badgeBg="rgba(16, 185, 129, 0.1)" badgeColor="var(--status-resolved)" icon={IconTotal} />
                    <DashboardStatCard title="Under Investigation" value={inProgress} badgeText="Active" badgeBg="rgba(245, 158, 11, 0.1)" badgeColor="var(--status-progress)" icon={IconProgress} />
                    <DashboardStatCard title="Resolved Cases" value={resolved} badgeText="87% rate" badgeBg="rgba(16, 185, 129, 0.1)" badgeColor="var(--status-resolved)" icon={IconResolved} />
                </div>

                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                        <h3 style={{ fontSize: '1.125rem' }}>Recent Complaints</h3>
                        <Link to="/my-complaints" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>View all</Link>
                    </div>
                    <ComplaintTable complaints={allComplaints.slice(0, 5)} />
                </div>

                <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(33, 102, 105, 0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ color: 'var(--primary)', padding: '0.5rem', background: 'rgba(33, 102, 105, 0.1)', borderRadius: '50%' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Need help with a submission?</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Our support team is available 24/7 for urgent citizen issues.</p>
                        </div>
                    </div>
                    <button type="button" className="btn btn-outline" style={{ background: 'white' }} onClick={() => window.alert('Contact Support: 9876543210')}>Contact Support</button>
                </div>
            </div>
        </Layout>
    );
}

export { citizenLinks };
