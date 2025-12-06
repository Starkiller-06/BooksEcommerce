'use client';

import { Button } from '@/components/ui/button';
import ShopLayout from '@/layouts/shop-layout';
import CircularGallery from '@/components/CircularGallery';
import { Sparkles, Heart, Atom, Hourglass, UserPen } from 'lucide-react';
import '../../css/home.css';


function Categories() {
    const categories = [
        {genre: 'Fiction', color:'#D8CDEA'}, 
        {genre: 'Romance', color:'#FFAED3'}, 
        {genre: 'Science', color:'#C8EFE2'}, 
        {genre: 'History', color:'#DEC7B1'}, 
        {genre:'Biography', color:'#C9DBF0'}
    ];

    const getIcon = (genre: string) => {
        switch (genre) {
            case 'Fiction':
                return <Sparkles className="h-6 w-6" />;
            case 'Romance':
                return <Heart className="h-6 w-6" />;
            case 'Science':
                return <Atom className="h-6 w-6" />;
            case 'History':
                return <Hourglass className="h-6 w-6" />;
            case 'Biography':
                return <UserPen className="h-6 w-6" />;
            default:
                return null;
        }
    };

    return (
        <div className="genre-container">
            {categories.map((gen, index) => (
                <div 
                    key={index}
                    className="genre-card"       
                    >
                    {getIcon(gen.genre)}
                    <span className="">{gen.genre}</span>
                </div>
            ))}
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
                    <Categories/>
                </section>
            </ShopLayout>
        </div>
    );
}
