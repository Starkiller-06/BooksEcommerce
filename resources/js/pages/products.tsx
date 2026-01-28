import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout'; 
import { Pencil, Trash2 } from 'lucide-react'; 
import '../../css/products.css'; 

interface BookData {
    id: number;
    title: string;
    synopsis: string;
    publish_year: number;
    genres: { id: number; genre: string }[];
    authors: { id: number; name: string }[];
    copies: { id: number; quantity: number; unit_price: number; isbn: string }[];
}

export default function Dashboard({ copies }: { copies: BookData[] }) {
    
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
            router.delete(`/admin/books/${id}`);
        }
    };

    const renderContent = () => {        
        return (
            <>
                <div className="dashboard-header-row">
                    <h2 className="products-heading">Current Products</h2>
                    
                    <Link href="/admin/create">
                        <button className="add-btn">
                            + Add New Product
                        </button>
                    </Link>
                </div>

                <div className="table-container">
                    
                    {copies.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                            <p>No products found.</p>
                            <p style={{ fontSize: '0.9em' }}>Click "Add New Product" to get started.</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead className="admin-thead">
                                <tr>
                                    <th className="th-cell">Title / ISBN</th>
                                    <th className="th-cell">Authors</th>
                                    <th className="th-cell">Genres</th>
                                    <th className="th-cell">Price</th>
                                    <th className="th-cell">Stock</th>
                                    <th className="th-cell" style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {copies.map((book) => {
                                    const mainCopy = book.copies[0]; 

                                    return (
                                        <tr key={book.id} className="table-row">
                                            <td className="td-cell">
                                                <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{book.title}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--secondary-foreground)' }}>ISBN: {mainCopy?.isbn || 'N/A'}</div>
                                            </td>
                                            <td className="td-cell" style={{ color: 'var(--primary-foreground)' }}>
                                                {book.authors.map(a => a.name).join(', ')}
                                            </td>
                                            <td className="td-cell">
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {book.genres.map(g => (
                                                        <span key={g.id} className="genre-tag">
                                                            {g.genre}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="td-cell" style={{ fontWeight: '600' }}>
                                                ${mainCopy?.unit_price}
                                            </td>
                                            <td className="td-cell">
                                                <span className={`stock-badge ${(mainCopy?.quantity || 0) > 0 ? 'in-stock' : 'out-stock'}`}>
                                                    {mainCopy?.quantity || 0} In Stock
                                                </span>
                                            </td>
                                            
                                            <td className="td-cell">
                                                <div className="actions-cell-content">
                                                    <Link 
                                                        href={`/admin/books/${book.id}/edit`}
                                                        className="action-btn btn-edit"
                                                        title="Edit"
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