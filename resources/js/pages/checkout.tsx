'use client';

import ShopLayout from '@/layouts/shop-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { CreditCard, Globe, Lock, Wallet } from 'lucide-react';
import '../../css/Checkout.css'; 


interface PaymentOption {
    id: string;
    label: string;
}

interface CartItem {
    id: number;
    title: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
}

interface CheckoutProps {
    paymentMethods: PaymentOption[];
    cardTypes: PaymentOption[];
    cartItems: CartItem[];
}

export default function Checkout({ 
    paymentMethods = [], 
    cardTypes = [], 
    cartItems = [] 
}: CheckoutProps) {
    console.log('items', cartItems);
    console.log('payments', paymentMethods);
    console.log('cards', cardTypes);

    const { cart } = usePage().props as any;

    console.log(cart);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 5.00; 
    const tax = subtotal * 0.08; 
    const total = subtotal + shipping + tax;
    const [activeMethod, setActiveMethod] = useState<string>(paymentMethods[0]?.id || 'credit_card');

    const [formData, setFormData] = useState({
        recipient_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        zip_code: '',
        phone_number: '',
        
        payment_method: paymentMethods[0]?.id || 'credit_card',
        payment_type: '',
        card_last4: '',
        expiry_date: '',
        
        full_card_number: '',
        cvv: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMethodChange = (methodId: string) => {
        setActiveMethod(methodId);
        setFormData({ ...formData, payment_method: methodId });
    };

    const handleSubmit = () => {
        const payload = {
            recipient_name: formData.recipient_name,
            address: formData.address_line1 + (formData.address_line2 ? ', ' + formData.address_line2 : ''),
            city: formData.city,
            state: formData.state,
            zip_code: formData.zip_code,
            phone_number: formData.phone_number,
            payment_method: formData.payment_method,
            payment_type: formData.payment_type,
            card_last4: formData.full_card_number.slice(-4),
            expiry_date: formData.expiry_date,
        };

        router.post('/checkout', payload, {
            onSuccess: () => alert("Order Placed Successfully!"),
            onError: (errors) => {
                console.error(errors);
                alert("Please check the form for errors.");
            }
        });
    };

    const getMethodIcon = (id: string) => {
        switch(id) {
            case 'credit_card': return <CreditCard size={20} />;
            case 'paypal': return <Globe size={20} />;
            default: return <Wallet size={20} />;
        }
    };

    return (
        <ShopLayout>
            <Head title="Checkout" />

            <div className="checkout-page-wrapper">
                <div className="checkout-grid">
                    
                    <div className="forms-column">
                        <div className="white-card">
                            <h2 className="card-title">Shipping Address</h2>
                            <div className="form-group">
                                <label>Recipient Name</label>
                                <input 
                                    type="text" name="recipient_name" placeholder="Full Name" 
                                    className="form-input" onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <input 
                                    type="text" name="address_line1" placeholder="Street Address" 
                                    className="form-input" onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Address 2 (Optional)</label>
                                <input 
                                    type="text" name="address_line2" placeholder="Apartment, Suite, etc." 
                                    className="form-input" onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-row-3">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" placeholder="City" className="form-input" onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input type="text" name="state" placeholder="State" className="form-input" onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Zip Code</label>
                                    <input type="text" name="zip_code" placeholder="12345" className="form-input" onChange={handleInputChange} />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="text" name="phone_number" placeholder="+1 234 567 890" className="form-input" onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="white-card">
                            <h2 className="card-title">Payment Method</h2>
                            
                            <div className="payment-tabs">
                                {paymentMethods.map((method) => (
                                    <button 
                                        key={method.id}
                                        className={`tab-btn ${activeMethod === method.id ? 'active' : ''}`}
                                        onClick={() => handleMethodChange(method.id)}
                                    >
                                        {getMethodIcon(method.id)} {method.label}
                                    </button>
                                ))}
                            </div>

                            {activeMethod === 'credit_card' && (
                                <div className="payment-form">
                                    <div className="form-group">
                                        <label>Card Type</label>
                                        <select 
                                            name="payment_type" 
                                            className="form-select" 
                                            onChange={handleInputChange}
                                            value={formData.payment_type}
                                        >
                                            <option value="">Select Card Type</option>
                                            {cardTypes.map((type) => (
                                                <option key={type.id} value={type.id}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <div className="input-with-icon">
                                            <input 
                                                type="text" name="full_card_number" placeholder="0000 0000 0000 0000" 
                                                className="form-input" onChange={handleInputChange}
                                                maxLength={19}
                                            />
                                            <Lock size={16} className="input-icon" />
                                        </div>
                                    </div>

                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label>Expiry (MM/YYYY)</label>
                                            <input 
                                                type="text" name="expiry_date" placeholder="01/2025" 
                                                className="form-input" onChange={handleInputChange}
                                                maxLength={7}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input 
                                                type="text" name="cvv" placeholder="123" 
                                                className="form-input" onChange={handleInputChange}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeMethod === 'paypal' && (
                                <div className="paypal-message" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    <p>You will be redirected to PayPal securely to complete your purchase.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="summary-column">
                        <div className="white-card sticky-card">
                            <h2 className="card-title">Order Summary</h2>
                            
                            <div className="order-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <img src={item.image} alt={item.title} className="item-img" />
                                        <div className="item-details">
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                            <p className="text-sm font-bold mt-1">
                                                ${item.price.toFixed(2)} x {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <hr className="divider" />

                            <div className="totals-section">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Tax (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="total-row final-total">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button className="place-order-btn" onClick={handleSubmit}>
                                {activeMethod === 'paypal' ? 'Continue with PayPal' : 'Place Order'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </ShopLayout>
    );
}