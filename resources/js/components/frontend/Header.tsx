'use client';

import { Search, ShoppingCart, CircleUserRound, Notebook} from "lucide-react";
import { Link, router } from '@inertiajs/react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Header() {
    return (
        <header className="w-full bg-primary p-4 text-primary-foreground">
            <nav className="flex w-full flex-row items-center justify-between px-6">
                <div className="flex items-center gap-12 text-white font-sans">
                    <Link href="/home" className="text-white text-4xl font-montecarlo">
                        Eterna
                    </Link>     
                </div>
                 
                <div className="flex items-center gap-12 text-white">
                    <Link href="/catalog">
                        <Notebook/> 
                    </Link>  
                    <Link href="/cart">
                        <ShoppingCart />
                    </Link>
                    <button 
                        onClick={() => router.post('/logout')}
                        className="logout-btn font-sans "
                    >Logout</button>
                </div>                    
            </nav>
        </header>
    )
}