import React from 'react';
import '../../css/admin-layout.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-layout">
            {/* LEFT SIDEBAR */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">Admin Panel</div>
                <nav className="sidebar-nav">
                    <a href="/admin/dashboard" className="sidebar-link">Dashboard</a>
                    <a href="/admin/products" className="sidebar-link">Products</a>
                    <a href="/admin/settings" className="sidebar-link">Settings</a>
                </nav>
            </aside>

            {/* RIGHT SIDE: Header + Content */}
            <div className="admin-main">
                {/* Admin Header */}
                <header className="admin-header">
                    <span>Admin Dashboard</span>
                    <button className="logout-btn">Logout</button>
                </header>

                {/* Where your page content (children) goes */}
                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}