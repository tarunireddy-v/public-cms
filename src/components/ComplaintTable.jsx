import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ComplaintTable({ complaints, showCitizen = false, isOfficer = false, isAdmin = false, onUpdate = null }) {
    const [expandedId, setExpandedId] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [newPriority, setNewPriority] = useState('');
    const [note, setNote] = useState('');

    const handleExpand = (c) => {
        if (expandedId === c.id) {
            setExpandedId(null);
        } else {
            setExpandedId(c.id);
            setNewStatus(c.status);
            setNewPriority(c.priority || 'Medium');
            setNote('');
        }
    };

    const handleSubmitUpdate = (e, id) => {
        e.preventDefault();
        if (onUpdate) {
            onUpdate(id, newStatus, newPriority, note);
            setExpandedId(null);
        }
    };

    if (!complaints || complaints.length === 0) {
        return (
            <div className="table-container">
                <table style={{ width: '100%' }}>
                    <tbody>
                        <tr><td style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>No complaints found.</td></tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        {!isOfficer && <th>Subject</th>}
                        <th>Category</th>
                        {isOfficer && <th>Priority</th>}
                        {showCitizen && <th>Citizen ID</th>}
                        <th>{isOfficer ? 'Received' : 'Date'}</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map(c => {
                        const statusClass = c.status.toLowerCase().replace(' ', '-');
                        const isExpanded = expandedId === c.id;

                        // Priority Badge logic
                        let prioColor = 'var(--text-muted)';
                        let prioBg = 'var(--bg-color)';
                        if (c.priority === 'High') {
                            prioColor = 'var(--status-error)';
                            prioBg = '#fee2e2';
                        } else if (c.priority === 'Medium') {
                            prioColor = 'var(--status-progress)';
                            prioBg = '#fef3c7';
                        } else if (c.priority === 'Low') {
                            prioColor = 'var(--text-secondary)';
                            prioBg = '#f3f4f6';
                        } // fallback if undefined is okay

                        return (
                            <React.Fragment key={c.id}>
                                <tr style={{ backgroundColor: isExpanded ? 'rgba(33, 102, 105, 0.05)' : 'transparent', borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)' }}>
                                    <td style={{ fontWeight: 500 }}>
                                        {isAdmin ? (
                                            <Link to={`/admin/tracking/${c.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{c.id}</Link>
                                        ) : isOfficer ? (
                                            <Link to={`/officer/tracking/${c.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{c.id}</Link>
                                        ) : (
                                            <Link to={`/tracking/${c.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{c.id}</Link>
                                        )}
                                    </td>
                                    {!isOfficer && <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.title}>{c.title}</td>}
                                    <td>{c.category}</td>
                                    {isOfficer && <td><span style={{ backgroundColor: prioBg, color: prioColor, padding: '0.125rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>{c.priority.toUpperCase()}</span></td>}
                                    {showCitizen && <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{c.citizenId}</td>}
                                    <td style={{ color: 'var(--text-secondary)' }}>{c.date}</td>
                                    <td><span className={`badge badge-${statusClass}`}>{c.status.toUpperCase()}</span></td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => handleExpand(c)} className="btn btn-ghost" style={{ padding: '0.25rem', color: isExpanded ? 'var(--primary)' : 'var(--text-muted)', background: isExpanded ? 'rgba(33, 102, 105, 0.1)' : 'transparent' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        </button>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={showCitizen ? 7 : 6} style={{ padding: 0, borderBottom: '1px solid var(--border-color)' }}>
                                            <div style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>
                                                <div className="grid" style={{ gridTemplateColumns: isOfficer ? '1fr 1fr' : '1fr', gap: '2rem' }}>
                                                    <div>
                                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Detailed Description</h4>
                                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{c.description}</p>
                                                        {!!c.remarks && (
                                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                                                <strong>Remarks:</strong> {c.remarks}
                                                            </p>
                                                        )}
                                                        
                                                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                                            <div>
                                                                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Citizen Contact</h4>
                                                                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{c.citizenId || 'N/A'}</p>
                                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+1 (555) 0123-456</p>
                                                            </div>
                                                            <div>
                                                                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Location</h4>
                                                                <p style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                                    {c.location}
                                                                </p>
                                                                <p style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>View on Map</p>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Evidence Photos</h4>
                                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                {c.evidence ? (
                                                                    <img src={c.evidence} alt="Evidence" style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div style={{ width: '80px', height: '60px', backgroundColor: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Image Placeholder</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div style={{ marginTop: '2rem' }}>
                                                            {isAdmin ? (
                                                                <Link to={`/admin/tracking/${c.id}`} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
                                                                    View Full Complaint →
                                                                </Link>
                                                            ) : isOfficer ? (
                                                                <Link to={`/officer/tracking/${c.id}`} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
                                                                    View Full Complaint →
                                                                </Link>
                                                            ) : (
                                                                <Link to={`/tracking/${c.id}`} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
                                                                    View Full Complaint →
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {isOfficer && (
                                                        <form onSubmit={(e) => handleSubmitUpdate(e, c.id)} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.05em' }}>Resolution Form</h4>
                                                            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                                    <label className="form-label">Update Status</label>
                                                                    <select className="form-control" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                                                        <option value="Assigned">Assigned</option>
                                                                        <option value="In Progress">In Progress</option>
                                                                        <option value="Resolved">Resolved</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                                    <label className="form-label">New Priority</label>
                                                                    <select className="form-control" value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                                                                        <option value="High">High</option>
                                                                        <option value="Medium">Medium</option>
                                                                        <option value="Low">Low</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label className="form-label">Internal Remarks / Action Taken</label>
                                                                <textarea className="form-control" value={note} onChange={e => setNote(e.target.value)} placeholder="Describe progress or resolution steps..." required={newStatus === 'Resolved'} style={{ minHeight: '80px' }}></textarea>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                                    <input type="checkbox" /> Notify citizen via SMS/App
                                                                </label>
                                                                <button type="submit" className="btn btn-primary">Update Complaint</button>
                                                            </div>
                                                        </form>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
