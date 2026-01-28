import React from 'react';
import Header from '@/components/frontend/Header';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="mx-auto w-full flex-1" >
                {children}
            </div>
        </div>
    );
    
}
