'use client';

import { Button } from '@/components/ui/button';
import ShopLayout from '@/layouts/shop-layout';
import CircularGallery from '@/components/CircularGallery';
import { Sparkles, Heart, Atom, Hourglass, UserPen } from 'lucide-react';
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
            className="w-full p-4 rounded-xl border-[1px] border-slate-300 relative overflow-hidden group bg-[#EBE2D8] shadow-md block"
        >
            {/* 1. Background Fill Effect */}
            <div
                style={{ backgroundColor: color }}
                className="absolute inset-0 z-0 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"
            />

            {/* 2. Large Floating Icon Effect */}
            <Icon
                className="absolute z-10 -top-12 -right-12 w-32 h-32 text-[#E3D7C8] group-hover:text-white/20 group-hover:rotate-12 transition-transform duration-300"
            />

            {/* 3. Main Icon (Small) */}
            <div
                style={{ color: color }}
                className="mb-2 text-2xl group-hover:text-white transition-colors relative z-20 duration-300"
            >
                <Icon className="h-6 w-6" />
            </div>

            {/* 4. Title/Genre Text */}
            <h3 className="font-semibold text-xl  text-primary group-hover:text-white relative z-20 duration-300">
                {genre}
            </h3>
            <p className="text-foreground opacity-50 group-hover:text-white relative z-10 duration-300 italic text-sm mt-[8px]">
                "{quote}"
            </p>
        </a>
    );
};

const GenreCategories = () => {

    const categories = [
        { genre: 'Fiction', color: '#CFA5D9', quote: 'It\'s the possibility of having a dream come true that makes life interesting.' },
        { genre: 'Romance', color: '#E396BF', quote: 'To love or have loved, that is enough. Ask nothing further.' },
        { genre: 'Science', color: '#5C9167', quote: 'Nothing in life is to be feared, it is only to be understood.'},
        { genre: 'History', color: '#806252', quote: 'We are not makers of history. We are made by history.' },
        { genre: 'Biography', color: '#78B1C4', quote: 'Be yourself; everyone else is already taken.' }
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
            <h2 className="text-2xl font-bold mb-4">What's your mood?</h2>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
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
}


export default function Home() {
    return (
        <div>
            <ShopLayout>            
                <section className="w-screen h-[450px] overflow-hidden bg-[#DBDFD8] flex flex-col justify-center items-center gap-6">
                    <h1 className="text-primary font-montecarlo text-[3.5rem] mt-[1rem]">Start your journey</h1>
                    <CircularGallery bend={0} textColor="#592508"/>
                </section>
                <section className="my-[3rem] mx-[3rem]">
                    <GenreCategories/>
                </section>
            </ShopLayout>
        </div>
    );
}
