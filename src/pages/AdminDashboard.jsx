import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStatCard } from '../components/DashboardCards';

export const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg> },
    { path: '/admin/complaints', label: 'Complaints', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { path: '/admin/departments', label: 'Departments', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { path: '/admin/reports', label: 'Reports', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> }
];

const dataMap = [
    { name: 'WEEK 1', received: 400, resolved: 240 },
    { name: 'WEEK 2', received: 300, resolved: 139 },
    { name: 'WEEK 3', received: 800, resolved: 480 },
    { name: 'WEEK 4', received: 500, resolved: 200 }
];

const departmentColors = [
    'var(--primary)',
    '#4f8a8c',
    '#7baaa9',
    '#a7caca',
    '#b8d6d6',
    '#d3eaea',
    '#9fc9c8',
    '#c9e2e2'
];

const responseTimeDepartments = [
    'Electricity',
    'Water',
    'Sanitation',
    'Roads',
    'Public Safety',
    'Animal Control',
    'Noise & Public Disturbance',
    'Drainage & Sewage'
];

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        avgResponseTime: '0 Days',
    });
    const [departments, setDepartments] = useState([]);

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = '/login';
        return null;
    }

    useEffect(() => {
        let isMounted = true;

        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/stats', {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(localStorage.getItem('token')
                            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            : {}),
                    },
                });
                const data = await response.json().catch(() => ({}));
                console.log('API DATA:', data);

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load admin stats');
                }

                if (isMounted) {
                    setStats({
                        total: typeof data.total === 'number' ? data.total : 0,
                        pending: typeof data.pending === 'number' ? data.pending : 0,
                        resolved: typeof data.resolved === 'number' ? data.resolved : 0,
                        avgResponseTime:
                            typeof data.avgResponseTime === 'string' ? data.avgResponseTime : '0 Days',
                    });
                }
            } catch (error) {
                console.error('Failed to load admin stats:', error.message);
            }
        };

        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/admin/departments', {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(localStorage.getItem('token')
                            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
                            : {}),
                    },
                });
                const data = await response.json().catch(() => ([]));
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load department breakdown');
                }

                if (isMounted) {
                    setDepartments(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Failed to load department breakdown:', error.message);
            }
        };

        fetchStats();
        fetchDepartments();
        return () => {
            isMounted = false;
        };
    }, []);

    const total = (stats?.total ?? 0).toLocaleString();
    const pending = (stats?.pending ?? 0).toLocaleString();
    const resolved = (stats?.resolved ?? 0).toLocaleString();
    const avgResponse = responseTimeDepartments.length > 0 ? '1 Day' : '0 Days';

    return (
        <Layout links={adminLinks} user={user} mainStyle={{ padding: '2rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard Overview</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Real-time public grievance monitoring and analytics.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ background: 'white' }}>Last 30 Days</button>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <DashboardStatCard title="Total Complaints" value={total} badgeText="~12%" badgeBg="rgba(16, 185, 129, 0.1)" badgeColor="var(--status-resolved)" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} />
                <DashboardStatCard title="Pending Review" value={pending} badgeText="~8%" badgeBg="rgba(245, 158, 11, 0.1)" badgeColor="var(--status-progress)" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} />
                <DashboardStatCard title="Resolved Cases" value={resolved} badgeText="~18%" badgeBg="rgba(16, 185, 129, 0.1)" badgeColor="var(--status-resolved)" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>} />
                <DashboardStatCard title="Avg. Response Time" value={avgResponse} badgeText="~4%" badgeBg="rgba(239, 68, 68, 0.1)" badgeColor="var(--status-error)" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>} />
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem' }}>Complaints Trend</h3>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div> RECEIVED
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-resolved)' }}></div> RESOLVED
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '300px', width: '100%', marginLeft: '-1.5rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataMap}>
                                <defs>
                                    <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--status-resolved)" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="var(--status-resolved)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis hide={true} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                                <Area type="monotone" dataKey="received" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorReceived)" />
                                <Area type="monotone" dataKey="resolved" stroke="var(--status-resolved)" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem' }}>Department Breakdown</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {departments.map((dept, i) => {
                            const maxValue = Math.max(...departments.map((d) => d.count), 1);
                            const percent = Math.round((dept.count / maxValue) * 100);
                            const barColor = departmentColors[i % departmentColors.length];

                            return (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                                    <span>{dept.name}</span>
                                    <span>{dept.count}</span>
                                </div>
                                <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${percent}%`, backgroundColor: barColor, borderRadius: '4px' }}></div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
        </Layout>
    );
}
