import React from 'react';
import Layout from '../components/Layout';
import { officerLinks } from './OfficerDashboard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', rate: 65 },
    { name: 'Tue', rate: 72 },
    { name: 'Wed', rate: 68 },
    { name: 'Thu', rate: 85 },
    { name: 'Fri', rate: 90 },
    { name: 'Sat', rate: 95 },
    { name: 'Sun', rate: 92 },
];

export default function OfficerAnalytics() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = '/login';
        return null;
    }

    return (
        <Layout links={officerLinks} user={user} mainStyle={{ padding: '2rem 3rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Department Analytics</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Performance metrics and resolution trends.</p>
            
            <div className="card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Resolution Rate</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip cursor={{fill: 'rgba(33, 102, 105, 0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }} formatter={(value) => [`${value}%`, 'Resolution Rate']} />
                            <Bar dataKey="rate" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
}
