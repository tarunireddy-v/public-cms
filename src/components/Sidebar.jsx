import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';

export default function Sidebar({ links, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div style={{ paddingTop: '1.5rem' }}>
        <div className="sidebar-nav">
          {links && links.map((link) => (
            <NavLink 
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Logout ABOVE user profile */}
        <button 
          onClick={handleLogout}
          className="btn btn-outline" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--status-error)', borderColor: '#fee2e2' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> 
          Logout
        </button>

        {/* User Profile Section auto-placed at bottom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=216669&color=fff"} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="Avatar" />
          <div style={{ fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || 'Marcus Johnson'}</div>
            <div style={{ color: 'var(--text-muted)' }}>{user?.idText || 'Resident ID: 8821'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
