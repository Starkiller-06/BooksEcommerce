'use client';

import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, router } from '@inertiajs/react';
import '../../css/bookDetails.css'; 

interface ProductDetails {
    id: number;
    title: string;
    synopsis: string;
    publish_year: number;
    author: string;
    genres: string[];
    price: number;
    format: string;
    isbn: string;
    stock: number;
    image: string;
}

export default function BookDetails({ product }: { product: ProductDetails }) {
    const sentences = product.synopsis.split('. ');
    const leadText = sentences.length > 1 ? sentences[0] + '.' : product.synopsis;
    const bodyText = sentences.length > 1 ? sentences.slice(1).join('. ') : "";

    // --- ADD TO CART HANDLER ---
    const handleAddToCart = () => {
        router.post('/cart/add', {
            book_id: product.id,
            format: product.format, 
        }, {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Added to cart!");
            }
        });
    };

    return (
        <ShopLayout>
            <Head title={product.title} />

            <div className="book-details-wrapper">
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/home" style={{ textDecoration: 'none', color: 'var(--secondary-foreground)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        ← Back to Catalog
                    </Link>
                </div>

                <div className="book-details-grid">
                    <div className="book-cover-section">
                        <div className="book-cover-bg-circle"></div>
                        <img 
                            src={product.image} 
                            alt={product.title} 
                            className="book-cover-img"
                        />
                    </div>

                    <div className="book-info-section">
                        <h1 className="book-title-main">{product.title}</h1>
                        <p className="book-author-main">by {product.author}</p>

                        <div className="book-description">
                            <p className="book-synopsis-italic">
                                {leadText}
                            </p>
                            {bodyText && (
                                <p className="book-synopsis-full">
                                    {bodyText}
                                </p>
                            )}
                        </div>

                        <div className="book-actions-row">
                            <span className="book-price-large">${product.price}</span>
                            <button 
                                className="btn-add-cart"
                                disabled={product.stock <= 0}
                                onClick={handleAddToCart} 
                            >
                                {product.stock > 0 ? `Add to Cart` : 'Out of Stock'}
                            </button>
                        </div>

                        <div className="book-meta-table">
                            <div className="meta-group">
                                <div className="meta-row">
                                    <span className="meta-label">Genres</span>
                                    <span className="meta-value">{product.genres[0] || 'General'}</span>
                                </div>
                                <div className="meta-row" style={{marginTop: '0.5rem'}}>
                                    <span className="meta-label">Release Date</span>
                                    <span className="meta-value">{product.publish_year}</span>
                                </div>
                                <div className="meta-row" style={{marginTop: '0.5rem'}}>
                                    <span className="meta-label">Format</span>
                                    <span className="meta-value">{product.format}</span>
                                </div>
                            </div>

                            <div className="meta-group">
                                <div className="meta-row">
                                    <span className="meta-label">Features</span>
                                    <span className="meta-value">Full color, {product.stock} in stock</span>
                                </div>
                                <div className="meta-row" style={{marginTop: '0.5rem'}}>
                                    <span className="meta-label">ISBN</span>
                                    <span className="meta-value">{product.isbn}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}