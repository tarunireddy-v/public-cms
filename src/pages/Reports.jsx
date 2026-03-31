import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { adminLinks } from './AdminDashboard';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
    const [totalProcessed, setTotalProcessed] = useState(0);

    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = '/login';
        return null;
    }
    const timeData = [{ name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }, { name: 'Mar', value: 550 }, { name: 'Apr', value: 480 }];
    const pieData = [{ name: 'Electricity', value: 45 }, { name: 'Water', value: 25 }, { name: 'Sanitation', value: 20 }, { name: 'Roads', value: 10 }];
    const barData = [
        { name: 'Electricity', time: 24 },
        { name: 'Water', time: 36 },
        { name: 'Sanitation', time: 18 },
        { name: 'Roads', time: 48 },
        { name: 'Public Safety', time: 30 },
        { name: 'Animal Control', time: 22 },
        { name: 'Noise & Public Disturbance', time: 27 },
        { name: 'Drainage & Sewage', time: 34 }
    ];
    
    const COLORS = ['#216669', '#10b981', '#f59e0b', '#ef4444'];

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
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch admin stats');
                }

                if (isMounted) {
                    setTotalProcessed(typeof data.total === 'number' ? data.total : 0);
                }
            } catch (error) {
                console.error('Failed to fetch total processed:', error.message);
            }
        };

        fetchStats();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <Layout links={adminLinks} user={user} mainStyle={{ padding: '2rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>System Reports</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Comprehensive real-time analytics and visualizations.</p>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Avg Resolution Time</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>32 Hrs</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Processed</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{(totalProcessed ?? 0).toLocaleString()}</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>SLA Compliance</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--status-resolved)' }}>96.5%</div>
                </div>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '300px 1fr',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                    alignItems: 'start',
                }}
            >
                <div className="card" style={{ padding: '1.5rem', flexShrink: 0, height: '100%' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Complaints by Category</h3>
                    <div
                        style={{
                            minWidth: '250px',
                            minHeight: '300px',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <PieChart width={260} height={260}>
                            <Pie data={pieData} cx={130} cy={130} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                        </PieChart>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', minWidth: 0, height: '100%' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Resolution Time (Hrs)</h3>
                    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                        <div style={{ width: 'max-content' }}>
                            <BarChart width={1200} height={300} data={barData} barCategoryGap="18%" margin={{ top: 8, right: 8, left: 8, bottom: 40 }}>
                                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(33, 102, 105, 0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                                <Bar dataKey="time" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={44} />
                            </BarChart>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Annual Volume Trend</h3>
                <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeData}>
                            <defs>
                                <linearGradient id="colorVal2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                            <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVal2)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Layout>
    );
}
