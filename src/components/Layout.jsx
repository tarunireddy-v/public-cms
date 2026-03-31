import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children, links, user, mainStyle = {} }) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar user={user} />
            <div className="dashboard-layout" style={{ flex: 1 }}>
                <Sidebar links={links} user={user} />
                <main className="main-content" style={mainStyle}>
                    {children}
                </main>
            </div>
        </div>
    );
}
