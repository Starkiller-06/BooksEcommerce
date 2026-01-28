import React from 'react';
import '../../css/admin-layout.css';
import { Link, router } from '@inertiajs/react';

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
                    <Link href="/admin/dashboard" className="sidebar-link">Dashboard</Link>
                    <Link href="/admin/products" className="sidebar-link">Products</Link>
                    <Link href="/admin/orders" className="sidebar-link">Orders</Link>
                </nav>
            </aside>

            <div className="admin-main">
                <header className="admin-header">
                    <span>Admin Dashboard</span>
                    <button className="logout-btn" onClick={() => router.post('/logout')}>Logout</button>
                </header>

                <main className="admin-content">
                    {children}
                </main>
            </div>
        </div>
    );
}