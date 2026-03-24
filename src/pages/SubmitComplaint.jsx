import React, { useState } from 'react';
import Layout from '../components/Layout';
import { citizenLinks } from './CitizenDashboard';
import { useComplaints } from '../context/ComplaintContext';
import classifier from '../utils/classifier';
import { useNavigate } from 'react-router-dom';

export default function SubmitComplaint() {
    const { addComplaint } = useComplaints();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [dept, setDept] = useState('auto');
    const [location, setLocation] = useState('');
    const [evidence, setEvidence] = useState(null);

    const detectedDept = classifier.classify(title, desc);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEvidence(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        try {
            const created = await addComplaint({
                title,
                description: desc,
                location,
                department: dept === 'auto' ? detectedDept : dept,
                status: 'Submitted',
                userId: user.id,
                image: evidence
            });

            navigate(`/tracking/${created.id}`);
        } catch (_error) {
            // No visual changes requested; keep existing UI as-is.
        }
    };

    return (
        <Layout links={citizenLinks} mainStyle={{ padding: 0 }}>
            <div className="submit-container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem' }}>
                <div className="header-card" style={{ backgroundColor: 'rgba(33, 102, 105, 0.04)', borderRadius: 'var(--radius-lg)', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Submit New Complaint</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '400px' }}>Your report helps us build a better city. Please provide accurate details.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        Basic Information
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Complaint Title</label>
                        <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Pothole on Maple Street" required />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Detailed Description</label>
                        <textarea className="form-control" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue in detail..." required></textarea>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        Categorization & Location
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Target Department</label>
                            <select className="form-control" value={dept} onChange={e => setDept(e.target.value)}>
                                <option value="auto">Auto-detecting: {detectedDept}</option>
                                {classifier.departments.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Precise Location</label>
                            <input type="text" className="form-control" value={location} onChange={e => setLocation(e.target.value)} placeholder="Search address..." required />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--primary)', marginRight: '0.75rem' }}></div>
                        Evidence
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>Upload Evidence <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                        <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', position: 'relative', cursor: 'pointer', backgroundColor: 'rgba(33, 102, 105, 0.02)', transition: 'all 0.2s' }}>
                            <input 
                                type="file" 
                                accept="image/jpeg, image/png, image/jpg" 
                                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%', zIndex: 10 }} 
                                onChange={handleImageChange}
                            />
                            {evidence ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <img src={evidence} alt="Preview" style={{ maxHeight: '160px', borderRadius: 'var(--radius)', objectFit: 'contain', boxShadow: 'var(--shadow-sm)' }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 600 }}>Click or drag to change image</span>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--primary)' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                    </div>
                                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>Click to upload an image</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>JPG, PNG up to 5MB</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', marginTop: '2rem' }}>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-ghost" style={{ fontWeight: 700 }}>CANCEL</button>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>SUBMIT COMPLAINT</button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
