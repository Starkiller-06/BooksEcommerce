'use client';

import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Trash2, Minus, Plus, MapPin, Truck } from 'lucide-react';
import { useState } from 'react';
import '../../css/cart.css'; 


interface CartItemData {
    cart_item_id: number; 
    id: number;           
    title: string;
    author: string;
    format: string;
    price: number;
    quantity: number;
    image: string;
}

export default function Cart({ cartItems = [] }: { cartItems: CartItemData[] }) {
    const [shippingMode, setShippingMode] = useState<'pickup' | 'delivery'>('pickup');

    const updateQty = (itemId: number, newQty: number) => {
        if (newQty < 1) return;
        
        router.post(`/cart/update/${itemId}`, { 
            quantity: newQty 
        }, { 
            preserveScroll: true 
        });
    };

    const removeItem = (itemId: number) => {
        if(confirm('Are you sure you want to remove this item?')) {
            router.delete(`/cart/remove/${itemId}`, { 
                preserveScroll: true 
            });
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = shippingMode === 'pickup' ? 0 : 15.00;
    const total = subtotal + shippingCost;

    return (
        <ShopLayout>
            <Head title="My Cart" />

            <div className="cart-page-container">
                <div className="cart-header-row">
                    <h1 className="cart-title">My Cart</h1>
                    <Link href="/shop" className="continue-shopping-link">
                        <ArrowLeft size={16} /> Continue shopping
                    </Link>
                </div>

                <div className="cart-card">
                    {cartItems.length > 0 ? (
                        <>
                            <div className="cart-table-header">
                                <span className="col-product">Product</span>
                                <span className="col-price">Price</span>
                                <span className="col-qty">Qty</span>
                                <span className="col-total">Total</span>
                                <span className="col-action"></span>
                            </div>

                            <div className="cart-rows">
                                {cartItems.map((item) => (
                                    <div key={item.cart_item_id} className="cart-item-row">
                                        
                                        <div className="col-product product-info">
                                            <div className="cart-img-wrapper">
                                                <img src={item.image} alt={item.title} />
                                            </div>
                                            <div className="cart-text-details">
                                                <h3>{item.title}</h3>
                                                <p className="detail-meta">Format: {item.format}</p>
                                                <p className="detail-meta">Author: {item.author}</p>
                                            </div>
                                        </div>

                                        <div className="col-price price-text">
                                            ${item.price.toFixed(2)}
                                        </div>

                                        <div className="col-qty">
                                            <div className="qty-stepper">
                                                <button 
                                                    onClick={() => updateQty(item.cart_item_id, item.quantity - 1)} 
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQty(item.cart_item_id, item.quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-total total-text">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>

                                        <div className="col-action">
                                            <button 
                                                onClick={() => removeItem(item.cart_item_id)} 
                                                className="btn-remove"
                                                title="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-cart-message" style={{padding: '4rem 2rem', textAlign: 'center', color: '#888'}}>
                            <p style={{fontSize: '1.2rem', marginBottom: '1rem'}}>Your cart is currently empty.</p>
                            <Link href="/shop" style={{color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline'}}>
                                Browse our Catalog
                            </Link>
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer-card">
                        <div className="shipping-section">
                            <h3>Choose shipping mode:</h3>
                            
                            <label className={`shipping-option ${shippingMode === 'pickup' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    checked={shippingMode === 'pickup'} 
                                    onChange={() => setShippingMode('pickup')} 
                                />
                                <div className="option-icon bg-red"><MapPin size={20} /></div>
                                <div className="option-text">
                                    <strong>Store pickup</strong> (In 20 min)
                                    <span className="free-tag">FREE</span>
                                </div>
                            </label>

                            <label className={`shipping-option ${shippingMode === 'delivery' ? 'active' : ''}`}>
                                <input 
                                    type="radio" 
                                    checked={shippingMode === 'delivery'} 
                                    onChange={() => setShippingMode('delivery')} 
                                />
                                <div className="option-icon bg-gray"><Truck size={20} /></div>
                                <div className="option-text">
                                    <strong>Delivery at home</strong> (Under 2 - 4 days)
                                    <span className="price-tag">$15.00</span>
                                </div>
                            </label>
                        </div>

                        <div className="checkout-section">
                            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span></div>
                            <div className="summary-row total-row"><span>Total</span><span>${total.toFixed(2)}</span></div>
                            
                            <Link href="/checkout">
                                <button className="btn-checkout">
                                    Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}