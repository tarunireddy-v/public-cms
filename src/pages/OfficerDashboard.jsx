import React from 'react';
import Layout from '../components/Layout';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintTable from '../components/ComplaintTable';

const OFFICER_DEPARTMENT = 'Electricity';

function downloadComplaintsCsv(complaintRows) {
    const header = 'ID,Title,Department,Status,Date';
    const lines = complaintRows.map((c) => {
        const cells = [c.id, c.title, c.department, c.status, c.date].map((cell) => {
            const s = String(cell ?? '');
            if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
            return s;
        });
        return cells.join(',');
    });
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'complaints-export.csv';
    a.click();
    URL.revokeObjectURL(url);
}

export const officerLinks = [
    { path: '/officer', label: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg> },
    { path: '/officer/assigned', label: 'Assigned', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
    { path: '/officer/resolved', label: 'Resolved', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { path: '/officer/analytics', label: 'Analytics', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> }
];

export const officerUser = { name: 'Officer Wilson', idText: 'Dept: Electricity', avatar: 'https://ui-avatars.com/api/?name=Officer+Wilson&background=216669&color=fff' };

export default function OfficerDashboard() {
    const { getComplaintsByDepartment, filterComplaintsBySearch } = useComplaints();
    const deptComplaints = filterComplaintsBySearch(getComplaintsByDepartment(OFFICER_DEPARTMENT));
    
    const pending = deptComplaints.filter(c => c.status === 'Submitted' || c.status === 'Assigned');
    const inProgress = deptComplaints.filter(c => c.status === 'In Progress');
    const highPriority = [...pending, ...inProgress].filter(c => c.priority === 'High');

    const handleExportCsv = () => {
        downloadComplaintsCsv([...pending, ...inProgress]);
    };

    return (
        <Layout links={officerLinks} user={officerUser} mainStyle={{ padding: '2rem 3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Overview</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Summary of your department's current workload.</p>
                </div>
                <div>
                    <select className="form-control" style={{ fontSize: '0.75rem', padding: '0.25rem 2rem 0.25rem 0.75rem', backgroundColor: 'white' }}>
                        <option>This Week</option>
                        <option>This Month</option>
                    </select>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', minHeight: '120px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 'auto' }}>Pending Complaints</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{pending.length < 10 && pending.length > 0 ? '0'+pending.length : pending.length}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--status-error)' }}>~2%</span>
                    </div>
                </div>
                <div className="stat-card" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', minHeight: '120px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 'auto' }}>In Progress</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>{inProgress.length < 10 && inProgress.length > 0 ? '0'+inProgress.length : inProgress.length || '05'}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--status-resolved)' }}>~5%</span>
                    </div>
                </div>
                <div className="stat-card" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', minHeight: '120px' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 'auto' }}>High Priority</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '1rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--status-error)', lineHeight: 1 }}>{highPriority.length < 10 && highPriority.length > 0 ? '0'+highPriority.length : highPriority.length || '03'}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>Attention Required</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Active Records</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', backgroundColor: 'white' }}>Filter By Date</button>
                        <button type="button" className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', backgroundColor: 'white' }} onClick={handleExportCsv}>Export CSV</button>
                    </div>
                </div>
                <div style={{ margin: '-2rem', marginTop: '0' }}>
                    <ComplaintTable complaints={[...pending, ...inProgress]} isOfficer={true} />
                </div>
            </div>
        </Layout>
    );
}
