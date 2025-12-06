import React from 'react';
import Header from '@/components/frontend/Header';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>
        <Header />
        <div className="mx-auto h-screen" >
            {children}
        </div>
    </div>;
}
