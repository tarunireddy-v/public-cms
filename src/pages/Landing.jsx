import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
            <nav className="navbar" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                    </svg>
                    CivicSync
                </Link>
                <div className="nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <a href="#how-it-works" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>How it Works</a>
                    <a href="#departments" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Departments</a>
                    <a href="#benefits" className="nav-link" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Benefits</a>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Get Started</Link>
                </div>
            </nav>

            <main>
                <div className="hero" style={{ textAlign: 'center', padding: '6rem 1.5rem 4rem', maxWidth: '800px', margin: '0 auto' }}>
                    <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(33, 102, 105, 0.1)', color: 'var(--primary)', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        ♦ EASY CIVIC COMPLAINTS
                    </div>
                    <h1 style={{ fontFamily: 'Playfair Display', fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                        Empowering Citizens,<br/><span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Improving Governance</span>
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '600px', marginInline: 'auto' }}>
                        A modern platform to report public issues, track resolutions, and build a better community together. Efficient, transparent, and digital-first.
                    </p>
                    <div className="hero-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Report an Issue</Link>
                        <Link to="/login" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', background: 'white' }}>Track Complaint</Link>
                    </div>
                </div>

                <div className="hero-image-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', marginBottom: '5rem' }}>
                    <div className="hero-image" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', background: 'linear-gradient(135deg, #1f2937, #111827)', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '4px solid white' }}>
                        <div style={{ textAlign: 'center', opacity: 0.5 }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>
                            </svg>
                            <p>Dashboard Overview Preview</p>
                        </div>
                    </div>
                </div>

                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <div id="how-it-works" className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PROCESS</span>
                        <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>How it Works</h2>
                    </div>
                    
                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                        <div className="feature-card" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
                            <div className="feature-icon" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(33, 102, 105, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>1</div>
                            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>1. Report</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Snap a photo of the issue, pin the location, and describe it in a few words right from our app or web portal.</p>
                        </div>
                        <div className="feature-card" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
                            <div className="feature-icon" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(33, 102, 105, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>2</div>
                            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>2. Track</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Monitor the live status of your complaint as it moves from 'Submitted' to 'Assigned' and 'In Progress'.</p>
                        </div>
                        <div className="feature-card" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
                            <div className="feature-icon" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(33, 102, 105, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>3</div>
                            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>3. Resolve</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Receive automatic notifications and photographic proof once the relevant department resolves the problem.</p>
                        </div>
                    </div>

                    <div id="departments" className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>INTEGRATION</span>
                        <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>Connected Departments</h2>
                    </div>

                    <div className="departments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
                        <div className="dept-card" style={{ background: 'white', padding: '2rem 1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: 'var(--primary)' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg></div>
                            Electricity
                        </div>
                        <div className="dept-card" style={{ background: 'white', padding: '2rem 1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: 'var(--primary)' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></div>
                            Water
                        </div>
                        <div className="dept-card" style={{ background: 'white', padding: '2rem 1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: 'var(--primary)' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></div>
                            Sanitation
                        </div>
                        <div className="dept-card" style={{ background: 'white', padding: '2rem 1rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: 'var(--primary)' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8 4v-2m-4 2v-2"></path></svg></div>
                            Roads
                        </div>
                    </div>

                    <div className="cta-section" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '5rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)', marginBottom: '4rem' }}>
                        <h2 style={{ fontFamily: 'Playfair Display', color: 'white', fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to make a difference?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', maxWidth: '500px', marginInline: 'auto' }}>Join thousands of citizens improving their cities today. Start reporting issues to the right department instantly.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-outline" style={{ background: 'white', color: 'var(--primary)' }}>Register Now</Link>
                            <a href="#" className="btn btn-ghost" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>Contact Us</a>
                        </div>
                    </div>

                    <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Link to="/" className="footer-logo" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 21h18"></path><path d="M9 8h1"></path><path d="M9 12h1"></path><path d="M9 16h1"></path><path d="M14 8h1"></path><path d="M14 12h1"></path><path d="M14 16h1"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
                            </svg>
                            CivicSync
                        </Link>
                        <div className="footer-links" style={{ display: 'flex', gap: '4rem' }}>
                            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Platform</strong>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Features</a>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</a>
                            </div>
                            <div className="footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Support</strong>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>FAQs</a>
                                <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}>Contact</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
}
