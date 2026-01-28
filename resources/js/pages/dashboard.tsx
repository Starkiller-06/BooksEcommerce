import React, { useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout'; 
import { Pencil, Trash2, Book, BookOpen, AlertTriangle } from 'lucide-react'; 
import '../../css/dashboard.css'; 

interface BookData {
    id: number;
    title: string;
    synopsis: string;
    publish_year: number;
    genres: { id: number; genre: string }[];
    authors: { id: number; name: string }[];
    copies: { id: number; quantity: number; unit_price: number; isbn: string; format: string }[];
}

export default function Dashboard({ copies }: { copies: BookData[] }) {
    const stats = useMemo(() => {
        let hardcoverCount = 0;
        let paperbackCount = 0;
        let lowStockItems: BookData[] = [];

        copies.forEach(book => {
            const copy = book.copies[0];
            if (!copy) return;
            if (copy.format.toLowerCase() === 'hardcover') hardcoverCount++;
            if (copy.format.toLowerCase() === 'paperback') paperbackCount++;
            if (copy.quantity <= 10) {
                lowStockItems.push(book);
            }
        });

        return { hardcoverCount, paperbackCount, lowStockItems };
    }, [copies]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this book?')) {
            router.delete(`/admin/books/${id}`);
        }
    };

    const renderContent = () => {        
        return (
            <>
                <div className="dashboard-header-row">
                    <div>
                        <h2 className="products-heading">Dashboard Overview</h2>
                        <p className="text-gray-500 text-sm mt-1">Real-time inventory snapshot</p>
                    </div>
                    
                    <Link href="/admin/create">
                        <button className="add-btn">
                            + Add New Product
                        </button>
                    </Link>
                </div>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-wrapper bg-blue-100 text-blue-600">
                            <Book size={28} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.hardcoverCount}</span>
                            <span className="stat-label">Hardcover Books</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper bg-amber-100 text-amber-600">
                            <BookOpen size={28} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.paperbackCount}</span>
                            <span className="stat-label">Paperback Books</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon-wrapper bg-green-100 text-green-600">
                            <div className="text-xl font-bold">ALL</div>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{copies.length}</span>
                            <span className="stat-label">Total Titles</span>
                        </div>
                    </div>
                </div>

                <div className="table-header-row">
                    <h3 className="table-title">Low Stock Alerts</h3>
                    <span className="badge-warning">
                        {stats.lowStockItems.length} items need attention
                    </span>
                </div>
                <div className="table-wrapper">
                    <div className="table-container">
                        {stats.lowStockItems.length === 0 ? (
                            <div className="empty-state">
                                <div className="p-4 bg-green-50 text-green-700 rounded-md inline-block">
                                    All stock levels are healthy!
                                </div>
                            </div>
                        ) : (
                            <table className="admin-table">
                                <thead className="admin-thead">
                                    <tr>
                                        <th className="th-cell">Product / ISBN</th>
                                        <th className="th-cell">Authors</th>
                                        <th className="th-cell">Format</th>
                                        <th className="th-cell">Price</th>
                                        <th className="th-cell">Stock Level</th>
                                        <th className="th-cell" style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.lowStockItems.map((book) => {
                                        const mainCopy = book.copies[0]; 
                                        const stock = mainCopy?.quantity || 0;

                                        return (
                                            <tr key={book.id} className="table-row">
                                                <td className="td-cell">
                                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{book.title}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)' }}>
                                                        {mainCopy?.isbn || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{ color: 'var(--primary-foreground)' }}>
                                                    {book.authors.map(a => a.name).join(', ')}
                                                </td>
                                                <td className="td-cell">
                                                    <span className="format-badge">
                                                        {mainCopy?.format}
                                                    </span>
                                                </td>
                                                <td className="td-cell font-semibold">
                                                    ${mainCopy?.unit_price}
                                                </td>
                                                <td className="td-cell">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`stock-badge ${stock === 0 ? 'out-stock' : 'low-stock'}`}>
                                                            {stock} Remaining
                                                        </span>
                                                        {stock <= 5 && <AlertTriangle size={16} className="text-red-500"/>}
                                                    </div>
                                                </td>
                                                
                                                <td className="td-cell">
                                                    <div className="actions-cell-content">
                                                        <Link 
                                                            href={`/admin/books/${book.id}/edit`}
                                                            className="action-btn btn-edit"
                                                            title="Restock / Edit"
                                                        >
                                                            <Pencil size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(book.id)}
                                                            className="action-btn btn-delete"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </>
        );
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="dashboard-content-wrapper"> 
                {renderContent()}
            </div>
        </AdminLayout>
    );
}