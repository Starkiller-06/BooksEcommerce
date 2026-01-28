'use client';

import ShopLayout from '@/layouts/shop-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import '../../css/home.css'; 
import '../../css/catalog.css';

interface Author { name: string; }
interface Media { img_path: string; }
interface BookCopy { id: number | null; unit_price: number; media?: Media; }

interface Book {
    id: number;
    title: string;
    authors: Author[];
    copies: BookCopy[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface CatalogProps {
    products: {
        data: Book[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        genre?: string;
        availability?: string;
    };
}

const BookCard = ({ book }: { book: Book }) => {
    const copy = book.copies[0];
    const price = copy && copy.unit_price ? `$${copy.unit_price.toFixed(2)}` : 'N/A';
    const image = copy?.media?.img_path 
        ? copy.media.img_path 
        : 'https://placehold.co/400x600?text=No+Cover';
    const authorName = book.authors.length > 0 ? book.authors[0].name : 'Unknown Author';

    return (
        <Link href={`/product/${book.id}`} className="book-card">
            <div className="book-card-content"> 
                <div className="bookImg-container">
                    <img src={image} alt={book.title} className="book-img" />
                </div>
                <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{authorName}</p>
                    <p className="book-price">{price}</p> 
                </div>
            </div>
        </Link>
    );
};

export default function Catalog({ products, filters }: CatalogProps) {
    
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const isFirstRun = useRef(true);

    const genres = ['Fiction', 'Romance', 'Science', 'History', 'Biography', 'Fantasy', 'Business'];

    const handleFilterChange = (key: string, value: string | null) => {
        router.get('/catalog', {
            ...filters,
            [key]: value,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const timer = setTimeout(() => {
            handleFilterChange('search', searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <ShopLayout>
            <Head title="Catalog" />

            <div className="catalog-container">
                
                <div className="catalog-header">
                    <div className="catalog-title">
                        <h1>Book Catalog</h1>
                        <p className="catalog-subtitle">
                            Showing {products?.data?.length || 0} results
                        </p>
                    </div>

                    <div className="search-wrapper">
                        <div className="search-icon">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search title or author..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => { setSearchQuery(''); handleFilterChange('search', null); }}
                                className="search-clear-btn"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="catalog-content">
                    
                    <aside className="catalog-sidebar">
                        <div className="filter-section">
                            <h3 className="filter-title">
                                <Filter size={18} /> Genres
                            </h3>
                            <div className="filter-group">
                                <label className="filter-label">
                                    <input
                                        type="radio"
                                        name="genre"
                                        checked={!filters.genre}
                                        onChange={() => handleFilterChange('genre', null)}
                                        className="filter-radio"
                                    />
                                    <span className={`filter-text ${!filters.genre ? 'active' : ''}`}>All Genres</span>
                                </label>
                                {genres.map((g) => (
                                    <label key={g} className="filter-label">
                                        <input
                                            type="radio"
                                            name="genre"
                                            checked={filters.genre === g}
                                            onChange={() => handleFilterChange('genre', g)}
                                            className="filter-radio"
                                        />
                                        <span className={`filter-text ${filters.genre === g ? 'active' : ''}`}>{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="filter-section">
                            <h3 className="filter-title">Availability</h3>
                            <label className="filter-label">
                                <input
                                    type="checkbox"
                                    checked={filters.availability === 'instock'}
                                    onChange={(e) => handleFilterChange('availability', e.target.checked ? 'instock' : null)}
                                    className="filter-checkbox"
                                />
                                <span className="filter-text">In Stock Only</span>
                            </label>
                        </div>
                    </aside>

                    <div className="products-area">
                        {products && products.data && products.data.length > 0 ? (
                            <>
                                <div className="products-grid">
                                    {products.data.map((book) => (
                                        <BookCard key={book.id} book={book} />
                                    ))}
                                </div>

                                <div className="pagination-container">
                                    <div className="pagination-wrapper">
                                        {products.links.map((link, i) => {
                                            const label = link.label.replace('&laquo;', '').replace('&raquo;', '').trim();
                                            const isPrev = link.label.includes('Previous');
                                            const isNext = link.label.includes('Next');

                                            if (!link.url) return null;

                                            return (
                                                <Link
                                                    key={i}
                                                    href={link.url}
                                                    className={`pagination-link ${link.active ? 'active' : ''}`}
                                                >
                                                    {isPrev && <ChevronLeft size={16} />}
                                                    <span dangerouslySetInnerHTML={{ __html: label || link.label }} />
                                                    {isNext && <ChevronRight size={16} />}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="empty-state">
                                <Search size={48} className="empty-icon" />
                                <h3 className="empty-title">No books found</h3>
                                <p className="empty-text">
                                    We couldn't find any books matching your current filters.
                                </p>
                                <button 
                                    onClick={() => router.get('/catalog')}
                                    className="btn-clear"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}