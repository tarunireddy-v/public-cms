import React from 'react';
import Layout from '../components/Layout';
import { adminLinks } from './AdminDashboard';
import classifier from '../utils/classifier';

export default function Departments() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = '/login';
        return null;
    }
    const departmentData = {
        Electricity: { resolution: '12 hrs', satisfaction: '95%' },
        Water: { resolution: '18 hrs', satisfaction: '91%' },
        Sanitation: { resolution: '24 hrs', satisfaction: '89%' },
        Roads: { resolution: '48 hrs', satisfaction: '87%' },
        'Public Safety': { resolution: '6 hrs', satisfaction: '96%' },
        'Animal Control': { resolution: '36 hrs', satisfaction: '88%' },
        'Noise & Public Disturbance': { resolution: '8 hrs', satisfaction: '93%' },
        'Drainage & Sewage': { resolution: '30 hrs', satisfaction: '90%' }
    };

    return (
        <Layout links={adminLinks} user={user} mainStyle={{ padding: '2rem 3rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Municipal Departments</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage internal department configurations and verify connection status.</p>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {classifier.departments.map((dept, i) => {
                    const data = departmentData[dept] || {
                        resolution: '24 hrs',
                        satisfaction: '90%'
                    };

                    return (
                        <div key={i} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(33, 102, 105, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                                </div>
                                <span className="badge badge-resolved">Active</span>
                            </div>
                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{dept}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Handles public service requests related to {dept.toLowerCase()}.</p>
                            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)' }}>Avg Resolution</div>
                                    <div style={{ fontWeight: 600 }}>{data.resolution}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--text-secondary)' }}>Satisfaction</div>
                                    <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{data.satisfaction}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}
