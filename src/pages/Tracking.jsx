import React from 'react';
import Layout from '../components/Layout';
import { citizenLinks } from './CitizenDashboard';
import { officerLinks, officerUser } from './OfficerDashboard';
import { adminLinks, adminUser } from './AdminDashboard';
import { useComplaints } from '../context/ComplaintContext';
import { useParams, Link } from 'react-router-dom';

export default function Tracking({ role = 'citizen' }) {
    const { id } = useParams();
    const { getComplaintById } = useComplaints();
    const complaint = getComplaintById(id);

    if (!complaint) return <Layout links={citizenLinks}><div className="p-4 text-center">Not found</div></Layout>;

    const statusFlow = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
    const currentStatusIndex = statusFlow.indexOf(complaint.status);

    let links = citizenLinks;
    let user = null;
    let mainStyle = {};
    let breadcrumbHome = "/dashboard";

    if (role === 'officer') {
        links = officerLinks;
        user = officerUser;
        mainStyle = { padding: '2rem 3rem' };
        breadcrumbHome = "/officer";
    } else if (role === 'admin') {
        links = adminLinks;
        user = adminUser;
        mainStyle = { padding: '2rem 3rem' };
        breadcrumbHome = "/admin";
    }

    return (
        <Layout links={links} user={user} mainStyle={mainStyle}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <Link to={breadcrumbHome} style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link> <span style={{ margin: '0 0.5rem' }}>/</span> 
                {role === 'citizen' ? (
                    <><Link to="/my-complaints" style={{ color: 'inherit', textDecoration: 'none' }}>My Complaints</Link> <span style={{ margin: '0 0.5rem' }}>/</span></>
                ) : role === 'admin' ? (
                    <><Link to="/admin/complaints" style={{ color: 'inherit', textDecoration: 'none' }}>Complaints</Link> <span style={{ margin: '0 0.5rem' }}>/</span></>
                ) : (
                    <><Link to="/officer/assigned" style={{ color: 'inherit', textDecoration: 'none' }}>Assigned</Link> <span style={{ margin: '0 0.5rem' }}>/</span></>
                )}
                <span>Tracking {complaint.id}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace', display: 'inline-block', marginBottom: '0.75rem' }}>{complaint.id}</div>
                    <h1 style={{ fontSize: '2.5rem', lineHeight: 1, marginBottom: '0.5rem' }}>{complaint.title}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Track the real-time resolution progress of your report.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ background: 'white' }}>Download PDF</button>
                    <button className="btn btn-primary">Share Status</button>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-color)', height: '100%' }}>
                    <h3 style={{ marginBottom: '2rem' }}>Current Progress</h3>
                    <div>
                        {statusFlow.map((status, index) => {
                            const log = complaint.timeline.find(l => l.status === status);
                            const isActive = !!log;
                            const isCurrent = index === currentStatusIndex;

                            return (
                                <div key={status} style={{ position: 'relative', paddingLeft: '2.5rem', paddingBottom: index === statusFlow.length - 1 ? 0 : '2rem' }}>
                                    {index !== statusFlow.length - 1 && (
                                        <div style={{ position: 'absolute', left: '0.6rem', top: '1.5rem', bottom: '-0.5rem', width: '2px', backgroundColor: isActive ? 'var(--primary)' : 'var(--border-color)' }}></div>
                                    )}
                                    <div style={{ position: 'absolute', left: 0, top: '0.125rem', width: '1.25rem', height: '1.25rem', borderRadius: '50%', color: 'white', backgroundColor: isActive ? 'var(--primary)' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                        {isActive ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }}></div>}
                                    </div>
                                    <div style={{ opacity: 1, fontSize: '0.875rem' }}>
                                        <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>{status}</div>
                                        {log ? (
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{log.date}<br/>{log.note && status === 'Assigned' ? 'Urban Maintenance Dept.' : ''}</div>
                                        ) : (
                                            status === 'Resolved' && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Expected: Oct 15</div>
                                        )}
                                        {isCurrent && status === 'In Progress' && <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-progress)', padding: '0.125rem 0.5rem', borderRadius: '4px', fontWeight: 700, marginTop: '0.25rem', display: 'inline-block' }}>ON SITE NOW</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>Complaint Details</h3>
                        <div className="grid" style={{ gridTemplateColumns: '2fr 1.5fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Description</div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{complaint.description}</p>
                                
                                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>Category</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                                            {complaint.category}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>Priority</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: complaint.priority === 'High' ? 'var(--status-error)' : complaint.priority === 'Medium' ? 'var(--status-progress)' : 'var(--text-muted)' }}></div>
                                            {complaint.priority}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>Location</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        {complaint.location}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>Evidence Attached</div>
                                <div style={{ backgroundColor: '#1f2937', height: '160px', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '0.5rem', overflow: 'hidden' }}>
                                    {complaint.evidence ? (
                                        <img src={complaint.evidence} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ opacity: 0.5, fontSize: '0.875rem' }}>No Image Uploaded</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>Uploaded on {complaint.date}</div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'rgba(33, 102, 105, 0.04)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Assigned Team</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{complaint.department}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ fontSize: '0.875rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Internal Log</h4>
                        <div>
                            {complaint.timeline.filter(log => log.note).map((log, i) => (
                                <div key={i} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>System Update</strong> <span style={{ opacity: 0.5, fontSize: '0.75rem', marginLeft: '0.5rem' }}>{log.date}</span>
                                    <div style={{ marginTop: '0.25rem' }}>{log.note}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
