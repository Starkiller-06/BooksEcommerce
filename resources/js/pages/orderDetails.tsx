import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { ArrowLeft, Save } from 'lucide-react';
import '../../css/products.css';
import '../../css/orders.css'; // Import the new CSS


interface OrderItem {
    id: number;
    title: string;
    format: string;
    quantity: number;
    price: number;
    image: string | null;
}

interface OrderDetailData {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    items: OrderItem[];
    shipping: {
        recipient_name: string;
        address: string;
        city: string;
        state: string;
        zip_code: string;
        phone_number: string;
    };
}

export default function OrderDetails({ order }: { order: OrderDetailData }) {
    
    const [status, setStatus] = useState(order.status);
    const [isSaving, setIsSaving] = useState(false);

    const handleStatusChange = () => {
        setIsSaving(true);
        router.patch(`/admin/orders/${order.id}`, { status }, {
            onFinish: () => setIsSaving(false)
        });
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.id}`} />
            
            <div className="dashboard-content-wrapper">
                
                <div className="dashboard-header-row">
                    <div className="header-left">
                        <Link href="/admin/orders" className="back-nav">
                            <ArrowLeft size={20} /> Back
                        </Link>
                        <h2 className="products-heading">Order #{order.id}</h2>
                    </div>

                    <div className="status-toolbar">
                        <select 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            className="status-select"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                            onClick={handleStatusChange} 
                            disabled={isSaving || status === order.status}
                            className="btn-save-status"
                        >
                            <Save size={16} /> 
                            {isSaving ? 'Saving...' : 'Save Status'}
                        </button>
                    </div>
                </div>

                <div className="details-grid">
                    
                    <div className="table-container" style={{ marginTop: 0 }}>
                        <table className="admin-table">
                            <thead className="admin-thead">
                                <tr>
                                    <th className="th-cell">Item</th>
                                    <th className="th-cell">Price</th>
                                    <th className="th-cell">Qty</th>
                                    <th className="th-cell" style={{ textAlign: 'right' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} className="table-row">
                                        <td className="td-cell">
                                            <div className="item-preview">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="item-thumb" />
                                                ) : (
                                                    <div className="item-thumb"></div>
                                                )}
                                                <div className="item-text">
                                                    <h4>{item.title}</h4>
                                                    <p>{item.format}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="td-cell">${item.price}</td>
                                        <td className="td-cell">{item.quantity}</td>
                                        <td className="td-cell" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="table-row">
                                    <td colSpan={3} className="td-cell total-row-label">
                                        Grand Total:
                                    </td>
                                    <td className="td-cell total-row-value">
                                        ${Number(order.total_amount).toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="info-card">
                        <h3>Customer Details</h3>
                        
                        <div className="info-section">
                            <h4 className="info-label">Shipping Address</h4>
                            <p className="info-text highlight">{order.shipping.recipient_name}</p>
                            <p className="info-text">{order.shipping.address}</p>
                            <p className="info-text">
                                {order.shipping.city}, {order.shipping.state} {order.shipping.zip_code}
                            </p>
                            <p className="info-text">{order.shipping.phone_number}</p>
                        </div>

                        <div className="info-section">
                            <h4 className="info-label">Order Info</h4>
                            <p className="info-text"><strong>Date:</strong> {order.created_at}</p>
                            <p className="info-text"><strong>Payment:</strong> Credit Card (****)</p>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}