'use client';

import CircularGallery from '@/components/CircularGallery';
import ShopLayout from '@/layouts/shop-layout';
import { Atom, Heart, Hourglass, Sparkles, UserPen } from 'lucide-react';
import '../../css/home.css';

interface GenreCardProps {
    genre: string;
    icon: React.ElementType | null;
    color: string;
    quote: string;
}

const GenreCard = ({ genre, icon: Icon, color, quote }: GenreCardProps) => {
    if (!Icon) return null;

    return (
        <a
            href="#"
            className="group relative block w-full overflow-hidden rounded-xl border-[1px] border-slate-300 bg-bg-secondary p-4 shadow-md"
        >
            {/* 1. Background Fill Effect */}
            <div
                style={{ backgroundColor: color }}
                className="absolute inset-0 z-0 translate-y-[100%] transition-transform duration-300 group-hover:translate-y-[0%]"
            />

            {/* 2. Large Floating Icon Effect */}
            <Icon className="absolute -top-12 -right-12 z-10 h-32 w-32 text-[#D7C4B2] transition-transform duration-300 group-hover:rotate-12 group-hover:text-white/20" />

            {/* 3. Main Icon (Small) */}
            <div
                style={{ color: color }}
                className="relative z-20 mb-2 text-2xl transition-colors duration-300 group-hover:!text-white"
            >
                <Icon className="h-6 w-6" />
            </div>

            {/* 4. Title/Genre Text */}
            <h3 className="relative z-20 text-xl font-semibold text-primary duration-300 group-hover:text-white">
                {genre}
            </h3>
            <p className="relative z-10 mt-[8px] text-sm text-foreground italic opacity-50 duration-300 group-hover:text-white">
                "{quote}"
            </p>
        </a>
    );
};

const GenreCategories = () => {
    const categories = [
        {
            genre: 'Fiction',
            color: '#CFA5D9',
            quote: "It's the possibility of having a dream come true that makes life interesting.",
        },
        {
            genre: 'Romance',
            color: '#E396BF',
            quote: 'To love or have loved, that is enough. Ask nothing further.',
        },
        {
            genre: 'Science',
            color: '#5C9167',
            quote: 'Nothing in life is to be feared, it is only to be understood.',
        },
        {
            genre: 'History',
            color: '#806252',
            quote: 'We are not makers of history. We are made by history.',
        },
        {
            genre: 'Biography',
            color: '#78B1C4',
            quote: 'Be yourself; everyone else is already taken.',
        },
    ];

    const getIcon = (genre: string) => {
        switch (genre) {
            case 'Fiction':
                return Sparkles;
            case 'Romance':
                return Heart;
            case 'Science':
                return Atom;
            case 'History':
                return Hourglass;
            case 'Biography':
                return UserPen;
            default:
                return null;
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

export default function Home() {
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
                    Authors
                </h2>
            </section>
            <section className="mx-[3rem] my-[3rem]">
                <h2 className="mb-4 mb-8 text-2xl font-bold text-accent">
                    The Literary Classics Collection
                </h2>
            </section>
        </ShopLayout>
    );
}
