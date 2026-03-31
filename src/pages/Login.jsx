import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('name@agency.gov');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        if(e) e.preventDefault();
        setError('');

        try {
            const response = await api.login({ email: username, password });
            localStorage.setItem('token', response.token);
            const user = response?.data?.user || response?.user || {};
            localStorage.setItem('user', JSON.stringify(user));

            const backendRole = user?.role;
            if (backendRole === 'Citizen') navigate('/dashboard');
            else if (backendRole === 'Officer') navigate('/officer-dashboard');
            else if (backendRole === 'Admin') navigate('/admin-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }} className="split-layout">
            <div style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: 700, marginBottom: '3rem', color: 'white', textDecoration: 'none' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
                    </svg>
                    CivicSync
                </Link>
                
                <h1 style={{ fontFamily: 'Playfair Display', color: 'white', fontSize: '3rem', lineHeight: 1.2, marginBottom: '1.5rem' }}>Building a better city,<br/>together.</h1>
                <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '400px', marginBottom: '4rem' }}>A collaborative platform connecting citizens, city authorities, and service partners to resolve public issues efficiently.</p>
                
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 'var(--radius-lg)', padding: '2rem', backdropFilter: 'blur(10px)', opacity: 0.8, maxWidth: '500px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7 }}>Active Cases</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>1,284</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.7 }}>Resolution Rate</span>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>94%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-color)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        SECURE GOVERNMENT & PARTNER PORTAL
                    </div>
                    
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Login to Portal</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Welcome back. Please enter your credentials to access your account.</p>

                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Email or Username</label>
                            <input type="text" className="form-control" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }} value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label className="form-label" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
                                <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</a>
                            </div>
                            <input type="password" className="form-control" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', fontSize: '0.875rem' }} value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', fontSize: '1rem' }}>Login to Portal →</button>
                        {error && (
                            <p style={{ marginTop: '0.75rem', color: 'var(--status-error)', fontSize: '0.875rem' }}>{error}</p>
                        )}
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                            Don&apos;t have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
