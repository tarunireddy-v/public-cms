import React from 'react';
import Layout from '../components/Layout';
import { adminLinks, adminUser } from './AdminDashboard';
import classifier from '../utils/classifier';

export default function Departments() {
    return (
        <Layout links={adminLinks} user={adminUser} mainStyle={{ padding: '2rem 3rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Municipal Departments</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage internal department configurations and verify connection status.</p>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {classifier.departments.map((dept, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(33, 102, 105, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                            </div>
                            <span className="badge badge-resolved">Active</span>
                        </div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{dept}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Handles public {dept.split(' ')[0].toLowerCase()} cases.</p>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <div>
                                <div style={{ color: 'var(--text-secondary)' }}>Avg Resolution</div>
                                <div style={{ fontWeight: 600 }}>24 hrs</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--text-secondary)' }}>Satisfaction</div>
                                <div style={{ fontWeight: 600, color: 'var(--primary)' }}>92%</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
