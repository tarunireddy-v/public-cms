import React from 'react';

// Reuse existing CSS classes: .stat-card, .stat-title, .stat-icon, .stat-value, .trend-up, .trend-down

export function DashboardStatCard({ title, value, badgeText, badgeColor, badgeBg, icon }) {
    return (
        <div className="stat-card" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                {icon && <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: 'rgba(33, 102, 105, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>}
                
                {badgeText && (
                    <div style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', background: badgeBg || 'rgba(16, 185, 129, 0.1)', color: badgeColor || 'var(--status-resolved)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {badgeText}
                    </div>
                )}
            </div>
            
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>
                {title}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                {value}
            </div>
        </div>
    );
}
