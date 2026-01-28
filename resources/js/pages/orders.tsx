import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Eye } from 'lucide-react';
import '../../css/products.css';
interface OrderSummary {
    id: number;
    customer_name: string;
    total_amount: number;
    status: string;
    date: string;
    items_count: number;
}

export default function Orders({ orders }: { orders: OrderSummary[] }) {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'completed': case 'delivered': return 'in-stock';
            case 'pending': return 'genre-tag'; 
            case 'cancelled': return 'out-stock'; 
            case 'shipped': return 'stock-badge'; 
            default: return 'genre-tag';
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Orders" />
            
            <div className="dashboard-content-wrapper">
                {/* Header */}
                <div className="dashboard-header-row">
                    <h2 className="products-heading">Customer Orders</h2>
                </div>

                <div className="table-container">
                    {orders.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                            <p>No orders found.</p>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead className="admin-thead">
                                <tr>
                                    <th className="th-cell">Order ID</th>
                                    <th className="th-cell">Customer</th>
                                    <th className="th-cell">Date</th>
                                    <th className="th-cell">Total</th>
                                    <th className="th-cell">Status</th>
                                    <th className="th-cell">Items</th>
                                    <th className="th-cell" style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="table-row">
                                        <td className="td-cell">
                                            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>#{order.id}</span>
                                        </td>
                                        <td className="td-cell">
                                            {order.customer_name}
                                        </td>
                                        <td className="td-cell">
                                            {order.date}
                                        </td>
                                        <td className="td-cell" style={{ fontWeight: '600' }}>
                                            ${Number(order.total_amount).toFixed(2)}
                                        </td>
                                        <td className="td-cell">
                                            <span className={`stock-badge ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="td-cell">
                                            {order.items_count} items
                                        </td>
                                        <td className="td-cell">
                                            <div className="actions-cell-content">
                                                <Link 
                                                    href={`/admin/orders/${order.id}`}
                                                    className="action-btn btn-edit"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}