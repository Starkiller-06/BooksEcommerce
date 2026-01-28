'use client';

import CircularGallery from '@/components/CircularGallery';
import ShopLayout from '@/layouts/shop-layout';
import { Link } from '@inertiajs/react';
import { Atom, Heart, Hourglass, Sparkles, UserPen, ShoppingCart } from 'lucide-react';
import '../../css/home.css';


interface Media {
    img_path: string;
}

interface BookCopy {
    id: number;
    unit_price: number;
    media?: Media;
}

interface Author {
    name: string;
}

interface Book {
    id: number;
    title: string;
    authors: Author[];
    copies: BookCopy[];
}

interface HomeProps {
    newArrivals: Book[];
    featured: Book[];
}

const BookCard = ({ book }: { book: Book }) => {
    const copy = book.copies[0];
    const price = copy ? `$${copy.unit_price}` : 'N/A';
    const image = copy?.media?.img_path || 'https://placehold.co/400x600?text=No+Cover';
    const authorName = book.authors.length > 0 ? book.authors[0].name : 'Unknown Author';

    return (
        <Link href={`/product/${book.id}`} className="book-card">
            <div className="book-card-content"> 
                <div className="bookImg-container">
                    <img
                        src={image}
                        alt={book.title}
                        className="book-img"
                    />
                </div>

                <div className="book-info">
                    <h3 className="book-title">
                        {book.title}
                    </h3>
                    <p className="book-author">
                        {authorName}
                    </p>
                    <p className="book-price">{price}</p> 
                </div>
            </div>
        </Link>
    );
};

interface GenreCardProps {
    genre: string;
    icon: React.ElementType | null;
    color: string;
    quote: string;
}

const GenreCard = ({ genre, icon: Icon, color, quote }: GenreCardProps) => {
    if (!Icon) return null;

    return (
        <Link
            href={`/catalog?genre=${encodeURIComponent(genre)}`}
            className="group relative block w-full overflow-hidden rounded-xl border-[1px] border-slate-300 bg-bg-secondary p-4 shadow-md"
        >
            <div
                style={{ backgroundColor: color }}
                className="absolute inset-0 z-0 translate-y-[100%] transition-transform duration-300 group-hover:translate-y-[0%]"
            />
            <Icon className="absolute -top-12 -right-12 z-10 h-32 w-32 text-[#D7C4B2] transition-transform duration-300 group-hover:rotate-12 group-hover:text-white/20" />
            <div
                style={{ color: color }}
                className="relative z-20 mb-2 text-2xl transition-colors duration-300 group-hover:!text-white"
            >
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="relative z-20 text-xl font-semibold text-primary duration-300 group-hover:text-white">
                {genre}
            </h3>
            <p className="relative z-10 mt-[8px] text-sm text-foreground italic opacity-50 duration-300 group-hover:text-white">
                "{quote}"
            </p>
        </Link>
    );
};

const GenreCategories = () => {
    const categories = [
        { genre: 'Fiction', color: '#CFA5D9', quote: "It's the possibility of having a dream come true that makes life interesting." },
        { genre: 'Romance', color: '#E396BF', quote: 'To love or have loved, that is enough. Ask nothing further.' },
        { genre: 'Science', color: '#5C9167', quote: 'Nothing in life is to be feared, it is only to be understood.' },
        { genre: 'History', color: '#806252', quote: 'We are not makers of history. We are made by history.' },
        { genre: 'Biography', color: '#78B1C4', quote: 'Be yourself; everyone else is already taken.' },
    ];

    const getIcon = (genre: string) => {
        switch (genre) {
            case 'Fiction': return Sparkles;
            case 'Romance': return Heart;
            case 'Science': return Atom;
            case 'History': return Hourglass;
            case 'Biography': return UserPen;
            default: return null;
        }
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 mb-8 text-2xl font-bold text-accent">
                Explore Worlds Within Pages
            </h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
                {categories.map((gen, index) => (
                    <GenreCard
                        key={index}
                        genre={gen.genre}
                        color={gen.color}
                        icon={getIcon(gen.genre)}
                        quote={gen.quote}
                    />
                ))}
            </div>
        </div>
    );
};

export default function Home({ newArrivals = [], featured = [] }: HomeProps) {
    return (
        <ShopLayout>
            <section className="flex h-[450px] w-screen flex-col items-center justify-center gap-6 overflow-hidden bg-card">
                <h1 className="mt-[1rem] font-montecarlo text-[3.5rem] text-primary">
                    Start your journey
                </h1>
                <CircularGallery bend={0} textColor="#592508" />
            </section>

            <section className="mx-[3rem] my-[3rem]">
                <GenreCategories />
            </section>

            <section className="mx-[3rem] my-[3rem]">
                <h2 className="mb-4 mb-8 text-2xl font-bold text-accent">
                    New Arrivals
                </h2>
                {newArrivals.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-5">
                        {newArrivals.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No new arrivals yet.</p>
                )}
            </section>

            <section className="mx-[3rem] my-[3rem]">
                <h2 className="mb-4 mb-8 text-2xl font-bold text-accent">
                    The Literary Classics Collection
                </h2>
                {featured.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6 lg:grid-cols-5">
                        {featured.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No classics found.</p>
                )}
            </section>
        </ShopLayout>
    );
}