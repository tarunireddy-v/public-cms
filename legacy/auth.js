// Auth Utilities
const AUTH_KEY = 'smart_public_cms_session';

const auth = {
    login(username, role) {
        const session = {
            username: username,
            role: role, // 'Citizen', 'Admin', 'Officer'
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        
        if (role === 'Citizen') {
            window.location.href = 'citizen-dashboard.html';
        } else if (role === 'Admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (role === 'Department Officer') {
            window.location.href = 'officer-dashboard.html';
        }
    },

    logout() {
        localStorage.removeItem(AUTH_KEY);
        window.location.href = 'login.html';
    },

    getSession() {
        const session = localStorage.getItem(AUTH_KEY);
        return session ? JSON.parse(session) : null;
    },

    requireRole(allowedRoles) {
        const session = this.getSession();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }
        
        if (allowedRoles && !allowedRoles.includes(session.role)) {
            // Redirect to appropriate dashboard if role mismatch
            if (session.role === 'Citizen') window.location.href = 'citizen-dashboard.html';
            else if (session.role === 'Admin') window.location.href = 'admin-dashboard.html';
            else if (session.role === 'Department Officer') window.location.href = 'officer-dashboard.html';
            else window.location.href = 'index.html';
        }
    }
};

window.auth = auth;

// Listen for logout button clicks globally
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtns = document.querySelectorAll('[data-action="logout"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    });

    // Populate user info if exists
    const session = auth.getSession();
    if (session) {
        const userNames = document.querySelectorAll('.user-name-display');
        userNames.forEach(el => el.textContent = session.username);
    }
});
