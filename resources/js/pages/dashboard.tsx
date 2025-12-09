// Dashboard.tsx
import React, { useState } from 'react';
// 1. Change the import to your new AdminLayout
import AdminLayout from '@/layouts/admin-layout'; 
import CreateBook from '@/components/frontend/CreateBook';

// Import specific styles for the dashboard content
import '../../css/dashboard.css'; 

export default function Dashboard() {
    const [currentView, setCurrentView] = useState<'products' | 'create'>('products');

    const renderContent = () => {
        if (currentView === 'create') {
            return (
                <CreateBook
                    // Assuming CreateBook takes an onCancel/onSave prop
                    onSave={() => setCurrentView('products')} 
                />
            );
        }
        
        return (
            <>
                <div className="dashboard-header-row">
                    <h2 className="products-heading">Current Products in Stock</h2>
                    
                    <button 
                        onClick={() => setCurrentView('create')}
                        className="add-btn" 
                    >
                        + Add New Product
                    </button>
                </div>

                {/* <ProductsSection /> */}
                <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px' }}>
                     <p>Product list placeholder...</p>
                </div>
            </>
        );
    };

    return (
        // 2. Wrap everything in AdminLayout
        <AdminLayout>
            {/* We don't need 'container' anymore because AdminLayout handles the padding */}
            <div className="dashboard-content-wrapper"> 
                {renderContent()}
            </div>
        </AdminLayout>
    );
}