'use client';

import { Search, ShoppingCart, CircleUserRound} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Header() {
    return (
        <header className="w-full bg-primary p-4 text-primary-foreground">
            <nav className="flex w-full flex-row items-center justify-between px-6">
                <h1 className="text-white text-4xl font-bold">Eterna</h1>    
                <div className="relative flex w-1/3 max-w-md gap-2 mx-2 overflow-hidden rounded-md bg-white">
                    <Input
                        placeholder="I want a..."
                        className="focus:visible:ring-0 rounded-none border-0 h-10 bg-white "
                    />
                    <Button
                        className="absolute right-0 top-0 rounded-none rounded-r-sm h-10 bg-accent hover:bg-accent/90 focus-visible:ring-0">
                        <Search className="h-4 w-4 text-white" />
                    </Button>
                </div>
                <div className="flex items-center gap-12 text-white">
                    <a>
                        <ShoppingCart />
                    </a>
                    <a>
                        <CircleUserRound />
                    </a>
                </div>                    
            </nav>
        </header>
    )
}